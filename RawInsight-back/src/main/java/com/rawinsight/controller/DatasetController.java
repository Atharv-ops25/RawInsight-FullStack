package com.rawinsight.controller;

import com.rawinsight.model.DatasetLog;
import com.rawinsight.repository.DatasetLogRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.ai.chat.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/datasets")
@CrossOrigin(origins = "http://localhost:5173")
public class DatasetController {

    private final ChatClient chatClient;
    private final DatasetLogRepository datasetLogRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");
    private static final Pattern NUMERIC_PATTERN = Pattern.compile("-?\\d+(\\.\\d+)?");

    public DatasetController(ChatClient chatClient, DatasetLogRepository datasetLogRepository) {
        this.chatClient = chatClient;
        this.datasetLogRepository = datasetLogRepository;
    }

    @GetMapping("/history")
    public ResponseEntity<?> getUploadHistory() {
        try {
            return ResponseEntity.ok(datasetLogRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch history logs: " + e.getMessage()));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDataset(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "The uploaded file is empty."));
        }

        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            List<String> headers = csvParser.getHeaderNames();
            List<Map<String, String>> previewRows = new ArrayList<>();
            
            Map<String, Integer> nullCounts = new HashMap<>();
            Map<String, Integer> formatErrors = new HashMap<>();
            
            for (String header : headers) {
                nullCounts.put(header, 0);
                formatErrors.put(header, 0);
            }

            int totalRows = 0;
            for (CSVRecord record : csvParser) {
                if (totalRows < 5) {
                    previewRows.add(record.toMap());
                }
                
                for (String header : headers) {
                    if (!record.isSet(header)) {
                        nullCounts.put(header, nullCounts.get(header) + 1);
                        continue;
                    }
                    
                    String val = record.get(header).trim();
                    String upperHeader = header.toUpperCase();
                    
                    if (val.isEmpty() || val.equalsIgnoreCase("null") || val.equalsIgnoreCase("missing") || val.equalsIgnoreCase("na")) {
                        nullCounts.put(header, nullCounts.get(header) + 1);
                    } 
                    else if (upperHeader.contains("EMAIL") || val.contains("@")) {
                        if (!EMAIL_PATTERN.matcher(val).matches()) {
                            formatErrors.put(header, formatErrors.get(header) + 1);
                        }
                    }
                    else if (upperHeader.contains("AMOUNT") || upperHeader.contains("SALARY") || upperHeader.contains("PRICE")) {
                        if (!NUMERIC_PATTERN.matcher(val).matches()) {
                            formatErrors.put(header, formatErrors.get(header) + 1);
                        }
                    }
                }
                totalRows++;
            }

            String aiPrompt = String.format(
                "You are an expert Data Profiler inside RawInsight. Analyze the file '%s' which contains %d total rows. " +
                "Columns: %s. Missing value/Blank summary counts: %s. Pattern/Data Type format validation faults: %s. " +
                "Provide a brief, 3-sentence expert data cleaning assessment detailing the most urgent anomalies to fix.",
                file.getOriginalFilename(), totalRows, headers.toString(), nullCounts.toString(), formatErrors.toString()
            );

            String aiSummary = chatClient.call(aiPrompt);

            // Calculate overall aggregates for persistent DB storage
            int aggregateNulls = nullCounts.values().stream().mapToInt(Integer::intValue).sum();
            int aggregateFormatErrors = formatErrors.values().stream().mapToInt(Integer::intValue).sum();

            DatasetLog log = new DatasetLog();
            log.setFileName(file.getOriginalFilename());
            log.setTotalRows(totalRows);
            log.setTotalNulls(aggregateNulls);
            log.setTotalFormatErrors(aggregateFormatErrors);
            log.setAiInsights(aiSummary);
            
            // Save log into MySQL database
            datasetLogRepository.save(log);

            return ResponseEntity.ok(Map.of(
                "fileName", file.getOriginalFilename(),
                "headers", headers,
                "preview", previewRows,
                "totalRows", totalRows,
                "nullAnalysis", nullCounts,
                "formatAnalysis", formatErrors,
                "aiInsights", aiSummary
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Analytical pipeline parsing error: " + e.getMessage()));
        }
    }

    @PostMapping("/clean")
    public ResponseEntity<byte[]> cleanAndDownloadDataset(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            List<String> headers = csvParser.getHeaderNames();
            StringBuilder csvContent = new StringBuilder();
            
            csvContent.append(String.join(",", headers)).append("\n");

            for (CSVRecord record : csvParser) {
                List<String> sanitizedRow = new ArrayList<>();
                boolean keepRow = true;

                for (String header : headers) {
                    if (!record.isSet(header)) {
                        sanitizedRow.add("0");
                        continue;
                    }

                    String val = record.get(header).trim();
                    String upperHeader = header.toUpperCase();

                    if (val.isEmpty() || val.equalsIgnoreCase("null") || val.equalsIgnoreCase("missing") || val.equalsIgnoreCase("na")) {
                        if (upperHeader.contains("AMOUNT") || upperHeader.contains("SALARY") || upperHeader.contains("PRICE")) {
                            val = "0";
                        } else {
                            val = "UNKNOWN";
                        }
                    }
                    else if ((upperHeader.contains("EMAIL") || val.contains("@")) && !EMAIL_PATTERN.matcher(val).matches()) {
                        keepRow = false; 
                        break; 
                    }
                    else if ((upperHeader.contains("AMOUNT") || upperHeader.contains("SALARY") || upperHeader.contains("PRICE")) && !NUMERIC_PATTERN.matcher(val).matches()) {
                        val = "0";
                    }

                    if (val.contains(",")) {
                        val = "\"" + val + "\"";
                    }
                    sanitizedRow.add(val);
                }

                if (keepRow) {
                    csvContent.append(String.join(",", sanitizedRow)).append("\n");
                }
            }

            byte[] outBytes = csvContent.toString().getBytes(StandardCharsets.UTF_8);
            String downloadName = "cleaned_" + file.getOriginalFilename();

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + downloadName)
                    .header("Content-Type", "text/csv")
                    .body(outBytes);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}