import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { HistoryList } from './components/HistoryList';
import { ResultsDisplay } from './components/ResultsDisplay';
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

  const handleHistoryClick = async (item) => {
    const finalizedStep = item.steps.find(s => s.step === 'request_finalized');
    if (finalizedStep && finalizedStep.data && finalizedStep.data.summary) {
      setBusinessName(item.input.business_name);
      setLocation(item.input.location || '');
      setResult({
        business_name: item.input.business_name,
        summary: finalizedStep.data.summary,
        request_id: item.request_id
      });
      setError(null);
    } else {
      // Fallback: Re-fetch using backend cache
      setBusinessName(item.input.business_name);
      setLocation(item.input.location || '');
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const data = await reviewService.summarize(item.input.business_name, item.input.location || '');
        setResult(data);
        fetchHistory();
      } catch (err) {
        setError(err.response?.data?.detail || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Header />
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Search & History */}
        <div className="lg:col-span-4 space-y-6">
          <SearchForm 
            businessName={businessName}
            setBusinessName={setBusinessName}
            location={location}
            setLocation={setLocation}
            loading={loading}
            handleSubmit={handleSubmit}
          />
          <HistoryList 
            history={history}
            handleHistoryClick={handleHistoryClick}
          />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          <ResultsDisplay 
            result={result}
            loading={loading}
            error={error}
            setError={setError}
          />
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>© 2026 Business Insights AI. Built with MCP + RAG + Groq Cloud LLM.</p>
      </footer>
    </div>
  );
};

export default App;
