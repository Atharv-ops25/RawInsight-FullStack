import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import AnalyticsSummary from './components/AnalyticsSummary';
import DataProfiler from './components/DataProfiler';
import MatrixTable from './components/MatrixTable';
import HistorySidebar from './components/HistorySidebar'; // Inject new sidebar components

function App() {
  const [file, setFile] = useState(null);
  const [dataPreview, setDataPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [historyLogs, setHistoryLogs] = useState([]);

  // Fetch log rows from MySQL database context
  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/datasets/history");
      if (response.ok) {
        const data = await response.json();
        // Sort newest entries to the top
        setHistoryLogs(data.reverse());
      }
    } catch (error) {
      console.error("Failed fetching database history mapping:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage(""); 
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file before uploading!");
    
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setErrorMessage("");
    setDataPreview(null);

    try {
      const response = await fetch("http://localhost:8080/api/datasets/upload", {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Ingestion pipeline fault.");
      
      setDataPreview(result);
      fetchHistory(); // Refresh background drawer logs instantly upon database update save
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Could not reach the backend server pipeline.");
    } finally {
      setLoading(false);
    }
  };

  const handleCleanAndDownload = async () => {
    if (!file) return;
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8080/api/datasets/clean", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Cleaning sequence broke down.");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `cleaned_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("Sanitization sequence failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative overflow-x-hidden">
      
      {/* Background Ambience orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent cursor-pointer">
              RawInsight
            </span>
            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-medium border border-blue-500/20">
              v1.0
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {/* ✨ PERMANENT DB LOG SIDEBAR LAUNCHER CONTROL */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-300 hover:text-cyan-400 transition-colors font-semibold flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs"
            >
              📊 History Logs ({historyLogs.length})
            </button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">Documentation</a>
          </nav>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-4xl leading-tight">
            Turn Raw Data into <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">Instant Intelligence</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Drop your raw CSV matrices into our engine. We handle the intense parsing routines while AI strings together strategic visual breakdowns.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <strong>Pipeline Fault:</strong> {errorMessage}
          </div>
        )}

        <FileUpload 
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          handleCleanAndDownload={handleCleanAndDownload}
          file={file}
          loading={loading}
          hasData={!!dataPreview}
        />

        {dataPreview && (
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Active Matrix View</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active file stream: <span className="text-cyan-400 font-mono font-semibold bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">{dataPreview.fileName}</span>
                  <span className="ml-3 text-slate-500">| Total Records: <strong>{dataPreview.totalRows}</strong></span>
                </p>
              </div>
              <div className="self-start sm:self-auto text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Analysis Complete
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <AnalyticsSummary aiInsights={dataPreview.aiInsights} />
              <DataProfiler 
                nullAnalysis={dataPreview.nullAnalysis} 
                formatAnalysis={dataPreview.formatAnalysis} 
              />
            </div>

            <MatrixTable headers={dataPreview.headers} preview={dataPreview.preview} />
          </div>
        )}

        {!dataPreview && !errorMessage && (
          <div className="border border-slate-800/60 border-dashed rounded-2xl p-16 text-center bg-slate-900/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-5 h-5 text-slate-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">Viewport Offline</p>
            <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">Upload a standard delimited dataset file above to stream structured analysis modules.</p>
          </div>
        )}
      </main>

      {/* Persistent History Panel component injection */}
      <HistorySidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        historyLogs={historyLogs}
      />
    </div>
  );
}

export default App;