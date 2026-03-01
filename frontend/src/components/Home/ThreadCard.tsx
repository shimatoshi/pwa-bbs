import React from 'react';
import { Link } from 'react-router-dom';
import type { Thread, Category } from '../../types';
import { Clock, MessageSquare } from 'lucide-react';

interface ThreadCardProps {
  thread: Thread;
  category?: Category;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, category }) => {
  return (
    <Link to={`/threads/${thread.id}`} className="card thread-item">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-color)' }}>{thread.title}</h3>
        {category && (
          <span className={`badge ${category.is_readonly ? 'badge-readonly' : ''}`} style={{ fontSize: '0.7rem' }}>
            {category.name}
          </span>
        )}
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
  );
};

export default ThreadCard;
