import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => (
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
      Harness the power of RAG and Cloud LLMs to distill thousands of reviews into actionable executive summaries.
    </p>
  </header>
);
