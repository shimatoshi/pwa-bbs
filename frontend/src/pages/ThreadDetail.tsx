import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { threadService, postService, userService } from '../services/apiService';
import type { Thread, Post, User as UserType } from '../types';
import { Send, Reply, User, Clock } from 'lucide-react';

const ThreadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [newPost, setNewPost] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchThreadData = async () => {
      if (!id) return;
      try {
        const [threadRes, postsRes] = await Promise.all([
          threadService.getThread(Number(id)),
          postService.getPosts(Number(id))
        ]);
        setThread(threadRes.data);
        setPosts(postsRes.data);

        if (token) {
          const userRes = await userService.getCurrentUser();
          setCurrentUser(userRes.data);
        }
      } catch (err) {
        console.error('Failed to load thread', err);
        setError('スレッドの読み込みに失敗しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchThreadData();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !id) return;

    try {
      const response = await postService.createPost({
        content: newPost,
        thread_id: Number(id),
        parent_id: replyTo || undefined
      });
      setPosts([...posts, response.data]);
      setNewPost('');
      setReplyTo(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || '投稿に失敗しました。');
    }
  };

  if (loading) return <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>読み込み中...</div>;

  const isReadonly = thread?.category?.is_readonly;
  const canPost = !isReadonly || currentUser?.is_admin;

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span className={`badge ${isReadonly ? 'badge-readonly' : ''}`}>
            {thread?.category?.name}
          </span>
          {isReadonly && <span style={{ fontSize: '0.75rem', color: 'var(--danger-color)', fontWeight: 'bold' }}>[閲覧専用]</span>}
        </div>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{thread?.title}</h1>
      </header>
      
      {error && <div className="card" style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', marginBottom: '1.5rem' }}>{error}</div>}
      
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="card" style={{ marginLeft: post.parent_id ? '2rem' : '0', position: 'relative' }}>
            {post.parent_id && (
              <div style={{ position: 'absolute', left: '-1.25rem', top: '1.25rem', color: 'var(--border-color)' }}>
                <Reply size={16} style={{ transform: 'rotate(180deg)' }} />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600 }}>
                <User size={14} />
                {post.author?.username || `User ${post.author_id}`}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Clock size={14} />
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-color)', lineHeight: 1.6 }}>{post.content}</p>
            {token && canPost && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button 
                  onClick={() => {
                    setReplyTo(post.id);
                    document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-link nav-item" 
                  style={{ color: 'var(--primary-color)', fontSize: '0.8rem' }}
                >
                  <Reply size={14} />
                  <span>返信する</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!token ? (
        <div className="card" style={{ marginTop: '2.5rem', textAlign: 'center', borderStyle: 'dashed' }}>
          <p style={{ color: 'var(--secondary-color)' }}>返信するにはログインが必要です。</p>
        </div>
      ) : !canPost ? (
        <div className="card" style={{ marginTop: '2.5rem', textAlign: 'center', backgroundColor: 'rgba(51, 65, 85, 0.5)' }}>
          <p style={{ color: 'var(--secondary-color)' }}>このカテゴリは閲覧専用のため、返信できません。</p>
        </div>
      ) : (
        <div id="reply-form" className="card" style={{ marginTop: '2.5rem', border: '1px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{replyTo ? `返信先: #${replyTo}` : '新しい投稿'}</h3>
            {replyTo && (
              <button className="btn-link" onClick={() => setReplyTo(null)} style={{ fontSize: '0.8rem', color: 'var(--danger-color)' }}>
                キャンセル
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={4}
                placeholder="メッセージを入力してください..."
                required
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
              />
            </div>
            <button type="submit" className="primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={18} />
              <span>投稿する</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ThreadDetail;
