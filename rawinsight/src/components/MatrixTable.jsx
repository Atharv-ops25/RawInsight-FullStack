import React from 'react';

function MatrixTable({ headers, preview }) {
  return (
    <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-slate-950/20">
      <table className="min-w-full divide-y divide-slate-800/60 text-left text-sm">
        <thead className="bg-slate-900/60 font-mono text-xs uppercase text-slate-300 tracking-wider">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-6 py-4 font-semibold border-b border-slate-800/60">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40 bg-slate-950/10">
          {preview.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-900/20 transition-colors group">
              {headers.map((header) => (
                <td key={header} className="px-6 py-4 whitespace-nowrap text-slate-400 group-hover:text-slate-200 transition-colors">
                  {row[header] || <span className="text-rose-500/70 font-mono font-semibold text-xs bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10">null</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MatrixTable;