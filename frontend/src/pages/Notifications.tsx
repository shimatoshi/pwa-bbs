import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Bell, Check } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/');
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
      await api.put(`/notifications/${id}`, { is_read: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <Bell size={24} color="var(--primary-color)" />
        <h1>Notifications</h1>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`notification-item ${n.is_read ? '' : 'unread'}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Link to={n.link} onClick={() => !n.is_read && markAsRead(n.id)} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                  <p>{n.message}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--secondary-color)' }}>
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </Link>
                {!n.is_read && (
                  <button 
                    onClick={() => markAsRead(n.id)}
                    className="btn-link"
                    style={{ color: 'var(--success-color)', marginLeft: '1rem' }}
                    title="Mark as read"
                  >
                    <Check size={18} />
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
