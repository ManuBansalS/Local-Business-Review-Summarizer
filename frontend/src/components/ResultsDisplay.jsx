import React from 'react';
import { TrendingUp, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ResultsDisplay = ({ result, loading, error, setError }) => {
  return (
    <AnimatePresence mode="wait">
      {!result && !loading && !error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl"
        >
          <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mb-6 text-brand-400">
            <TrendingUp size={40} />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Ready for Insight?</h3>
          <p className="text-gray-500">Enter a business name to begin the RAG-powered analysis.</p>
        </motion.div>
      )}

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full flex flex-col items-center justify-center p-12 glass rounded-3xl"
        >
          <div className="relative w-24 h-24 mb-8">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-brand-500 rounded-full blur-2xl"
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute inset-0 border-4 border-t-brand-500 border-white/10 rounded-full"
            />
          </div>
          <h3 className="text-xl font-medium mb-4">Mastering the Context...</h3>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {['Fetching Serper Data', 'MCP Data Ingestion', 'Vectorizing Chunks', 'Cloud LLM Synthesis'].map((step, i) => (
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.5 }}
                className="flex items-center gap-3 text-sm text-gray-400"
              >
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                {step}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 glass border-red-500/30 rounded-3xl text-center"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass p-8 rounded-3xl border-brand-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles size={120} className="text-brand-400" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 rounded-md bg-brand-500 text-[10px] font-bold uppercase tracking-wider">
                Executive Summary
              </div>
              <span className="text-gray-500 text-sm">ID: {result.request_id}</span>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-brand-500">{result.business_name}</h2>
            
            <div className="prose prose-invert max-w-none prose-headings:text-brand-400 prose-strong:text-white prose-p:text-gray-300">
              <div className="whitespace-pre-wrap leading-relaxed text-lg bg-black/20 p-6 rounded-2xl border border-white/5">
                {result.summary}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">Data Quality</p>
                <p className="text-lg font-semibold">Localized Vector Retrieval</p>
              </div>
            </div>
            <div className="glass p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">Source Engine</p>
                <p className="text-lg font-semibold">Groq Cloud LLM</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
