import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArticles } from '../services/api';
import { ChevronLeft, ExternalLink, Info } from 'lucide-react';

const ComparisonPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles().then(({ data }) => {
      const list = Array.isArray(data) ? data : data.blogs || [];
      const found = list.find(a => a._id === id);
      setArticle(found);
    });
  }, [id]);

  if (!article) return <div className="p-20 text-center animate-pulse text-gray-500">Loading Article Analysis...</div>;

  const renderAIContent = () => {
    try {
      const data = JSON.parse(article.updated_content);
      return (
        <div className="space-y-10">
          <header>
            <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">{data.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-indigo-500 pl-6 italic">
              {data.introduction}
            </p>
          </header>

          <main className="space-y-12">
            {data.sections?.map((section, idx) => (
              <section key={idx} className="group">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                  <span className="text-indigo-300 text-sm font-mono">0{idx + 1}.</span>
                  {section.heading}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {section.content}
                </p>
              </section>
            ))}
          </main>

          <footer className="pt-10 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Final Verdict</h3>
            <p className="text-gray-800 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100 font-medium">
              {data.conclusion}
            </p>
          </footer>
        </div>
      );
    } catch (e) {
        console.log(e.message)
      return <p className="whitespace-pre-wrap text-gray-800">{article.updated_content}</p>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 lg:p-10">
      <div className="max-w-[1700px] mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 font-semibold transition-all group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Articles
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
          
          <div className="flex flex-col h-[85vh]">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Source Content</h3>
              <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold">RAW TEXT</span>
            </div>
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 overflow-y-auto custom-scrollbar flex-1">
              <h1 className="text-3xl font-bold text-gray-400 mb-8 select-none">Original Version</h1>
              <div className="text-gray-500 leading-relaxed whitespace-pre-wrap font-serif">
                {article.content}
              </div>
            </div>
          </div>

          <div className="flex flex-col h-[85vh]">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-indigo-500 font-bold text-xs uppercase tracking-[0.2em]">AI Strategic Rewrite</h3>
              <div className="flex gap-2">
                {article.related_articles?.map((url, i) => (
                   <a key={i} href={url} target="_blank" rel="noreferrer" title="View Competitor Source">
                     <ExternalLink size={14} className="text-indigo-300 hover:text-indigo-600 cursor-pointer" />
                   </a>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-2xl shadow-indigo-100/50 p-10 overflow-y-auto custom-scrollbar flex-1 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Info size={120} />
              </div>
              {renderAIContent()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;