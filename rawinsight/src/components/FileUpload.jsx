import React from 'react';

function FileUpload({ handleFileChange, handleUpload, handleCleanAndDownload, file, loading, hasData }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] mb-10 hover:border-slate-700/60 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Step 1: Feed the Ingestion Pipeline
        </h2>
        
        {hasData && (
          <button
            onClick={handleCleanAndDownload}
            disabled={loading}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-[0.98] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            Stream 🧹 Auto-Clean & Download
          </button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 p-6 border border-dashed border-slate-700/80 hover:border-cyan-500/40 rounded-xl bg-slate-950/40 transition-all duration-300 group">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 file:transition-colors file:cursor-pointer flex-1 w-full"
        />
        <button 
          onClick={handleUpload} 
          disabled={loading || !file} 
          className="w-full md:w-auto bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 hover:brightness-110 active:scale-[0.99] transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
        >
          {loading ? "Parsing Stream..." : "Analyze Dataset"}
        </button>
      </div>
    </div>
  );
}

export default FileUpload;