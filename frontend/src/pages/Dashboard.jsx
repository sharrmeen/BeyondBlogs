import React, { useEffect, useState } from 'react';
import { fetchArticles, processArticle } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Loader2, Zap, Eye, CheckCircle, Clock, LayoutGrid, FileText } from 'lucide-react';

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const response = await fetchArticles();
      const data = Array.isArray(response.data) ? response.data : response.data.blogs || [];
      setArticles(data);
    } catch (err) {
      console.error("Failed to load articles", err);
      setArticles([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleProcess = async (id) => {
    setProcessingId(id);
    try {
      await processArticle(id);
      await loadData(); 
    } catch (err) {
      alert("AI Processing failed: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={64} />
        <p className="text-gray-500 font-medium animate-pulse">Syncing your content library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <LayoutGrid size={20} />
              <span className="font-bold uppercase tracking-wider text-sm">Content Engine</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              BeyondChats Article Dashboard
            </h1>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex gap-8">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase font-bold">Total</p>
              <p className="text-xl font-black text-gray-800">{articles.length}</p>
            </div>
            <div className="w-px bg-gray-100"></div>
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase font-bold">Updated</p>
              <p className="text-xl font-black text-green-600">
                {articles.filter(a => a.is_updated).length}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <div 
              key={article._id} 
              className="group bg-white rounded-[2rem] border border-gray-100 p-8 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-2 h-full ${article.is_updated ? 'bg-green-500' : 'bg-amber-400'}`}></div>
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${article.is_updated ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    <FileText size={24} />
                  </div>
                  {article.is_updated ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      <CheckCircle size={12} /> Optimized
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                      <Clock size={12} /> Legacy
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-800 leading-snug mb-4 group-hover:text-indigo-600 transition-colors line-clamp-3">
                  {article.title}
                </h2>
              </div>

              <div className="mt-8">
                {article.is_updated ? (
                  <button 
                    onClick={() => navigate(`/compare/${article._id}`)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 shadow-lg shadow-gray-200 hover:shadow-indigo-200 transition-all active:scale-[0.98]"
                  >
                    <Eye size={18} /> View Comparison
                  </button>
                ) : (
                  <button 
                    disabled={processingId === article._id}
                    onClick={() => handleProcess(article._id)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:bg-indigo-200 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                  >
                    {processingId === article._id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Zap size={18} fill="currentColor" />
                    )}
                    {processingId === article._id ? 'AI is working...' : 'Enhance with AI'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="inline-flex p-6 bg-gray-50 rounded-full text-gray-300 mb-4">
              <FileText size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No articles found</h3>
            <p className="text-gray-500">Your content library is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;