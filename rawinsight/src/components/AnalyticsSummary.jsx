import React from 'react';

function AnalyticsSummary({ aiInsights }) {
  return (
    <div className="lg:col-span-2 p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-violet-500/20 flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 font-mono tracking-wide uppercase mb-2 flex items-center gap-2">
          ✨ RawInsight AI Analytical Assessment
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">
          {aiInsights}
        </p>
      </div>
    </div>
  );
}

export default AnalyticsSummary;