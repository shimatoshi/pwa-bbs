import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { MessageSquare, Clock, Filter } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  is_readonly: boolean;
}

interface Thread {
  id: number;
  title: string;
  created_at: string;
  category_id: number;
}

const Home: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, threadsRes] = await Promise.all([
          api.get('/categories/').catch(() => ({ data: [] })),
          api.get('/threads/', { params: { category_id: selectedCategory } }).catch(() => ({ data: [] }))
        ]);
        setCategories(catsRes.data || []);
        setThreads(threadsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch data', err);
        setCategories([]);
        setThreads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Threads</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Filter size={18} color="var(--secondary-color)" />
          <select 
            value={selectedCategory || ''} 
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            style={{ width: 'auto', padding: '0.5rem' }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="category-chips" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          className={`badge ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
          style={{ border: 'none', cursor: 'pointer', backgroundColor: selectedCategory === null ? 'var(--primary-color)' : '', color: selectedCategory === null ? 'white' : '' }}
        >
          All
        </button>
        {categories?.map(cat => (
          <button 
            key={cat.id} 
            className={`badge ${selectedCategory === cat.id ? 'active' : ''} ${cat.is_readonly ? 'badge-readonly' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ border: 'none', cursor: 'pointer', backgroundColor: selectedCategory === cat.id ? 'var(--primary-color)' : '', color: selectedCategory === cat.id ? 'white' : '' }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="thread-list">
        {threads?.length === 0 ? (
          <p>No threads found.</p>
        ) : (
          threads?.map(thread => (
            <Link key={thread.id} to={`/threads/${thread.id}`} className="card thread-item">
              <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>{thread.title}</h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} />
                  {new Date(thread.created_at).toLocaleString()}
                </span>
                <span className="badge">
                  {categories?.find(c => c.id === thread.category_id)?.name}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
