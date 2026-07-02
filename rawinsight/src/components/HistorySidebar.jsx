import React from 'react';

function HistorySidebar({ isOpen, onClose, historyLogs }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop overlay filter */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900/95 border-l border-slate-800 backdrop-blur-2xl p-6 shadow-2xl flex flex-col justify-between">
          
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                📂 Operation Run History
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-white text-sm font-mono bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors">
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              {historyLogs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No historical data logs recorded yet in MySQL.</p>
              ) : (
                historyLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/80 hover:border-slate-700/60 transition-all space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-semibold text-cyan-400 font-mono truncate max-w-[200px]">{log.fileName}</span>
                      <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                        {new Date(log.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800/40">
                        <div className="text-[10px] text-slate-500">Rows</div>
                        <div className="text-xs font-bold text-white font-mono">{log.totalRows}</div>
                      </div>
                      <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800/40">
                        <div className="text-[10px] text-slate-500">Nulls</div>
                        <div className="text-xs font-bold text-rose-400 font-mono">{log.totalNulls}</div>
                      </div>
                      <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800/40">
                        <div className="text-[10px] text-slate-500">Faults</div>
                        <div className="text-xs font-bold text-amber-400 font-mono">{log.totalFormatErrors}</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 line-clamp-3 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40 italic">
                      "{log.aiInsights}"
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default HistorySidebar;