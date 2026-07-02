package com.rawinsight.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dataset_logs")
public class DatasetLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private int totalRows;
    private int totalNulls;
    private int totalFormatErrors;

    @Column(columnDefinition = "TEXT")
    private String aiInsights;

    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public int getTotalRows() { return totalRows; }
    public void setTotalRows(int totalRows) { this.totalRows = totalRows; }
    public int getTotalNulls() { return totalNulls; }
    public void setTotalNulls(int totalNulls) { this.totalNulls = totalNulls; }
    public int getTotalFormatErrors() { return totalFormatErrors; }
    public void setTotalFormatErrors(int totalFormatErrors) { this.totalFormatErrors = totalFormatErrors; }
    public String getAiInsights() { return aiInsights; }
    public void setAiInsights(String aiInsights) { this.aiInsights = aiInsights; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}