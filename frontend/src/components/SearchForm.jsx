import React from 'react';
import { Search, MapPin, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const SearchForm = ({ businessName, setBusinessName, location, setLocation, loading, handleSubmit }) => (
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
);
