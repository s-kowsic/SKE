import { useState, useEffect } from 'react';
import api from '../services/api';
import { marked } from 'marked';
import { Loader2 } from 'lucide-react';

export default function AdminInsights() {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/ai/demand');
      setInsights(data.insights);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-industrial-orange" size={48} />
        <p className="text-gray-400 text-lg">Loading AI Insights...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">AI Demand Insights</h2>
        <div className="bg-industrial-800 p-8 rounded-lg border border-industrial-orange/50 shadow-[0_0_15px_rgba(234,88,12,0.1)]">
          <div 
            className="prose prose-invert max-w-none text-lg leading-relaxed prose-headings:text-industrial-orange prose-a:text-blue-400" 
            dangerouslySetInnerHTML={{ __html: marked.parse(insights) }} 
          />
        </div>
      </div>
    </div>
  );
}
