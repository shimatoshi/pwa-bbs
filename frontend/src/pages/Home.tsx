import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { threadService, categoryService } from '../services/apiService';
import { Thread, Category } from '../types';
import { Plus } from 'lucide-react';
import CategoryFilter from '../components/Home/CategoryFilter';
import ThreadCard from '../components/Home/ThreadCard';

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
      <div className="loading-spinner">読み込み中...</div>
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

      <CategoryFilter 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      <main className="thread-list">
        {threads.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--secondary-color)', padding: '3rem', borderStyle: 'dashed' }}>
            スレッドが見つかりませんでした。
          </div>
        ) : (
          threads.map(thread => (
            <ThreadCard 
              key={thread.id} 
              thread={thread} 
              category={categories.find(c => c.id === thread.category_id)} 
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
