import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { threadService, categoryService } from '../services/apiService';
import { Thread, Category } from '../types';
import { MessageSquare, Clock, Filter, Plus } from 'lucide-react';

const Home: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, threadsRes] = await Promise.all([
          categoryService.getCategories(),
          threadService.getThreads(selectedCategory || undefined)
        ]);
        setCategories(catsRes.data);
        setThreads(threadsRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <div className="loading-spinner">Loading...</div>
    </div>
  );

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>掲示板</h1>
        <Link to="/threads/new" className="nav-item" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
          <Plus size={20} />
          <span>スレッド作成</span>
        </Link>
      </header>

      <section className="filters" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Filter size={18} color="var(--secondary-color)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: var('--secondary-color') }}>カテゴリで絞り込み</span>
        </div>
        
        <div className="category-chips" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`badge ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
            style={{ 
              border: 'none', 
              cursor: 'pointer', 
              backgroundColor: selectedCategory === null ? 'var(--primary-color)' : 'var(--card-bg)', 
              color: selectedCategory === null ? 'white' : 'var(--secondary-color)',
              border: selectedCategory === null ? 'none' : '1px solid var(--border-color)'
            }}
          >
            すべて
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              className={`badge ${selectedCategory === cat.id ? 'active' : ''} ${cat.is_readonly ? 'badge-readonly' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              style={{ 
                border: 'none', 
                cursor: 'pointer', 
                backgroundColor: selectedCategory === cat.id ? 'var(--primary-color)' : 'var(--card-bg)', 
                color: selectedCategory === cat.id ? 'white' : (cat.is_readonly ? 'var(--danger-color)' : 'var(--secondary-color)'),
                border: selectedCategory === cat.id ? 'none' : '1px solid var(--border-color)'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <main className="thread-list">
        {threads.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--secondary-color)', padding: '3rem' }}>
            スレッドが見つかりませんでした。
          </div>
        ) : (
          threads.map(thread => (
            <Link key={thread.id} to={`/threads/${thread.id}`} className="card thread-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-color)' }}>{thread.title}</h3>
                <span className={`badge ${categories.find(c => c.id === thread.category_id)?.is_readonly ? 'badge-readonly' : ''}`} style={{ fontSize: '0.7rem' }}>
                  {categories.find(c => c.id === thread.category_id)?.name}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Clock size={14} />
                  {new Date(thread.created_at).toLocaleDateString()} {new Date(thread.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <MessageSquare size={14} />
                  返信を表示
                </span>
              </div>
            </Link>
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
