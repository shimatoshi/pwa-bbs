import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../services/apiService';
import { Notification } from '../types';
import { Bell, Check, Clock } from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  if (loading) return <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div className="container">
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <Bell size={28} color="var(--primary-color)" />
        <h1 style={{ margin: 0 }}>通知</h1>
      </header>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', borderStyle: 'dashed' }}>
            <p style={{ color: 'var(--secondary-color)' }}>通知はありません。</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`notification-item ${n.is_read ? '' : 'unread'}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Link to={n.link || '#'} onClick={() => !n.is_read && markAsRead(n.id)} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: n.is_read ? 400 : 600 }}>{n.message}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--secondary-color)' }}>
                    <Clock size={12} />
                    <span>{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                </Link>
                {!n.is_read && (
                  <button 
                    onClick={() => markAsRead(n.id)}
                    className="btn-link"
                    style={{ color: 'var(--primary-color)', marginLeft: '1rem', padding: '0.5rem' }}
                    title="既読にする"
                  >
                    <Check size={20} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
