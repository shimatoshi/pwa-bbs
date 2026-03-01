import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Send, Reply, User } from 'lucide-react';

interface Post {
  id: number;
  content: string;
  created_at: string;
  author_id: number;
  parent_id: number | null;
}

interface Category {
  id: number;
  name: string;
  is_readonly: boolean;
}

interface Thread {
  id: number;
  title: string;
  category_id: number;
  category?: Category;
}

const ThreadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchThreadData = async () => {
      try {
        const [threadRes, postsRes] = await Promise.all([
          api.get(`/threads/${id}`),
          api.get(`/threads/${id}/posts/`)
        ]);
        setThread(threadRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Failed to load thread', err);
        setError('Failed to load thread.');
      } finally {
        setLoading(false);
      }
    };
    fetchThreadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await api.post('/posts/', {
        content: newPost,
        thread_id: Number(id),
        parent_id: replyTo
      });
      setPosts([...posts, response.data]);
      setNewPost('');
      setReplyTo(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to post reply.');
    }
  };

  if (loading) return <div>Loading...</div>;

  const isReadonly = thread?.category?.is_readonly;

  return (
    <div>
      <h1>{thread?.title || `Thread #${id}`}</h1>
      <div style={{ marginBottom: '1rem' }}>
        <span className="badge">{thread?.category?.name}</span>
        {isReadonly && <span className="badge" style={{ backgroundColor: 'var(--secondary-color)', marginLeft: '0.5rem' }}>Read Only</span>}
      </div>
      
      {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
      
      <div className="posts-list">
        {posts.map((post, index) => (
          <div key={post.id} className="card" style={{ marginLeft: post.parent_id ? '2rem' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--secondary-color)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={14} />
                User {post.author_id}
              </span>
              <span>{new Date(post.created_at).toLocaleString()}</span>
            </div>
            <p>{post.content}</p>
            {token && !isReadonly && (
              <button 
                onClick={() => {
                  setReplyTo(post.id);
                  document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-link" 
                style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-color)', fontSize: '0.85rem' }}
              >
                <Reply size={14} />
                Reply
              </button>
            )}
          </div>
        ))}
      </div>

      {!token ? (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p>Please login to post a reply.</p>
        </div>
      ) : isReadonly ? (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
          <p>This thread is in a read-only category. Replies are not allowed.</p>
        </div>
      ) : (
        <div id="reply-form" className="card" style={{ marginTop: '2rem' }}>
          <h3>{replyTo ? `Reply to Post #${replyTo}` : 'Post a reply'}</h3>
          {replyTo && (
            <button className="btn-link" onClick={() => setReplyTo(null)} style={{ fontSize: '0.8rem', color: 'var(--danger-color)', marginBottom: '0.5rem' }}>
              Cancel reply
            </button>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={4}
                placeholder="Write your message here..."
                required
              />
            </div>
            <button type="submit" className="primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={18} />
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ThreadDetail;
