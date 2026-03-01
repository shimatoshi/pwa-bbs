import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreateThread: React.FC = () => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/');
        const writableCats = response.data.filter((c: any) => !c.is_readonly);
        setCategories(writableCats);
        if (writableCats.length > 0) {
          setCategoryId(writableCats[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. スレッド作成
      const threadRes = await api.post('/threads/', {
        title,
        category_id: categoryId
      });
      const threadId = threadRes.data.id;

      // 2. 最初の投稿作成
      await api.post('/posts/', {
        content,
        thread_id: threadId
      });

      navigate(`/threads/${threadId}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create thread');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create New Thread</h2>
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select 
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Thread title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Initial Post Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="What's on your mind?"
            required
          />
        </div>
        <button type="submit" className="primary">Create Thread</button>
      </form>
    </div>
  );
};

export default CreateThread;
