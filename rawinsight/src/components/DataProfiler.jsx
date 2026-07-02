import React from 'react';

function DataProfiler({ nullAnalysis, formatAnalysis }) {
  return (
    <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4 divide-y divide-slate-800/60">
      {/* Section A: Missing Fields */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 font-mono tracking-wide uppercase mb-2.5">
          🧹 Missing/Null Entries
        </h4>
        <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
          {nullAnalysis && Object.entries(nullAnalysis).map(([column, count]) => (
            <div key={column} className="flex justify-between items-center text-[11px] font-mono py-0.5">
              <span className="text-slate-400 truncate max-w-[120px]">{column}</span>
              {count > 0 ? (
                <span className="text-rose-400 font-bold bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10">
                  {count} null
                </span>
              ) : (
                <span className="text-emerald-500">Clean</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Structural Pattern Matching Errors */}
      <div className="pt-4">
        <h4 className="text-xs font-bold text-rose-400 font-mono tracking-wide uppercase mb-2.5 pt-1">
          ⚠️ Pattern Format Faults
        </h4>
        <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
          {formatAnalysis && Object.entries(formatAnalysis).map(([column, count]) => (
            <div key={column} className="flex justify-between items-center text-[11px] font-mono py-0.5">
              <span className="text-slate-400 truncate max-w-[120px]">{column}</span>
              {count > 0 ? (
                <span className="text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 animate-pulse">
                  {count} malformed
                </span>
              ) : (
                <span className="text-slate-500">Valid</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DataProfiler;