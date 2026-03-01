import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Bell, Home, PlusSquare, RefreshCcw } from 'lucide-react';

const APP_VERSION = 'v0.1.1';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpdate = async () => {
    if (confirm('アプリを最新版に更新します。保存済みデータはそのまま残ります。')) {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
      // 全てのキャッシュを削除
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      window.location.reload();
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/" className="logo">PWA-BBS</Link>
          <span style={{ fontSize: '0.7rem', color: 'var(--secondary-color)', backgroundColor: 'var(--border-color)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            {APP_VERSION}
          </span>
          <button 
            onClick={handleUpdate} 
            className="btn-link" 
            style={{ display: 'flex', alignItems: 'center', color: 'var(--secondary-color)', padding: '0.25rem' }}
            title="アプリを更新"
          >
            <RefreshCcw size={14} />
          </button>
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-item">
            <Home size={18} />
            <span className="nav-text">ホーム</span>
          </Link>
          {token ? (
            <>
              <Link to="/threads/new" className="nav-item">
                <PlusSquare size={18} />
                <span className="nav-text">投稿</span>
              </Link>
              <Link to="/notifications" className="nav-item">
                <Bell size={18} />
                <span className="nav-text">通知</span>
              </Link>
              <button onClick={handleLogout} className="nav-item btn-link" style={{ border: 'none', background: 'none' }}>
                <LogOut size={18} />
                <span className="nav-text">ログアウト</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                <LogIn size={18} />
                <span className="nav-text">ログイン</span>
              </Link>
              <Link to="/register" className="nav-item">
                <User size={18} />
                <span className="nav-text">登録</span>
              </Link>
            </>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 480px) {
          .nav-text { display: none; }
          .nav-links { gap: 1rem; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
