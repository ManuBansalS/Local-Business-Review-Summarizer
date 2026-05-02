import React from 'react';
import { History, CheckCircle2 } from 'lucide-react';

export const HistoryList = ({ history, handleHistoryClick }) => (
  <section className="glass p-6 rounded-3xl overflow-hidden">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <History size={18} className="text-gray-400" />
      Recent Audits
    </h2>
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {history.length === 0 ? (
        <p className="text-gray-500 text-sm italic text-center py-4">No recent activity</p>
      ) : history.map((item) => (
        <div 
          key={item.request_id} 
          onClick={() => handleHistoryClick(item)}
          className="glass-card p-3 rounded-xl text-sm border-l-2 border-l-brand-500 cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="flex justify-between items-start mb-1">
            <span className="font-medium text-gray-200 truncate">{item.input.business_name}</span>
            <span className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <CheckCircle2 size={10} className="text-green-500" />
            <span>{item.steps.length} Pipeline Steps</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);
