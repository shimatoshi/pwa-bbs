import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { threadService, categoryService, postService } from '../services/apiService';
import type { Category } from '../types';
import { PlusCircle, AlertCircle } from 'lucide-react';

const CreateThread: React.FC = () => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        const writableCats = response.data.filter(c => !c.is_readonly);
        setCategories(writableCats);
        if (writableCats.length > 0) {
          setCategoryId(writableCats[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. スレッド作成
      const threadRes = await threadService.createThread({
        title,
        category_id: categoryId
      });
      const threadId = threadRes.data.id;

      // 2. 最初の投稿作成
      await postService.createPost({
        content,
        thread_id: threadId
      });

      navigate(`/threads/${threadId}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'スレッドの作成に失敗しました。');
    }
  };

  if (loading) return <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid var(--primary-color)' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <PlusCircle size={24} color="var(--primary-color)" />
          <h2 style={{ margin: 0 }}>新しくスレッドを立てる</h2>
        </header>

        {error && (
          <div className="card" style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', padding: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">カテゴリ</label>
            <select 
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="title">タイトル</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="スレッドのタイトルを入力してください"
              required
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">最初の投稿内容</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="内容を入力してください..."
              required
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
            />
          </div>
          <button type="submit" className="primary" style={{ marginTop: '1rem', height: '3rem', fontSize: '1.1rem' }}>
            スレッドを作成する
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateThread;
