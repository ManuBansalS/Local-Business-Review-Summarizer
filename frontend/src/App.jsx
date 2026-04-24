import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles, AlertCircle, CheckCircle2, History, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewService } from './services/api';

const App = () => {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await reviewService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessName) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await reviewService.summarize(businessName, location);
      setResult(data);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.detail || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full glass border border-brand-500/30 text-brand-400 text-sm font-medium"
        >
          <Sparkles size={16} />
          <span>Next-Gen Sentiment Intelligence</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
          Local Business Review Summarizer
        </h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Harness the power of RAG and Local LLMs to distill thousands of reviews into actionable executive summaries.
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Search & History */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass p-6 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Search size={20} className="text-brand-400" />
              Analyze Business
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">Business Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Starbucks, Joe's Pizza"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">Location (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, London"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Clock size={20} />
                  </motion.div>
                ) : <Sparkles size={20} />}
                {loading ? "Analyzing Context..." : "Generate Summary"}
              </button>
            </form>
          </section>

          {/* History Section */}
          <section className="glass p-6 rounded-3xl overflow-hidden">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History size={18} className="text-gray-400" />
              Recent Audits
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm italic text-center py-4">No recent activity</p>
              ) : history.map((item) => (
                <div key={item.request_id} className="glass-card p-3 rounded-xl text-sm border-l-2 border-l-brand-500">
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
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
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
                  {['Fetching Serper Data', 'MCP Data Ingestion', 'Vectorizing Chunks', 'Local LLM Synthesis'].map((step, i) => (
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
                {/* Result Header */}
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
                  
                  {/* Markdown Content Parser (Simple for demo) */}
                  <div className="prose prose-invert max-w-none prose-headings:text-brand-400 prose-strong:text-white prose-p:text-gray-300">
                    <div className="whitespace-pre-wrap leading-relaxed text-lg bg-black/20 p-6 rounded-2xl border border-white/5">
                      {result.summary}
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
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
                      <p className="text-lg font-semibold">Local Ollama LLM</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>© 2026 Business Insights AI. Built with MCP + RAG + Ollama.</p>
      </footer>
    </div>
  );
};

export default App;
