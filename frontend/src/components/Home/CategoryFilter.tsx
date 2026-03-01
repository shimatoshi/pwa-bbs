import React from 'react';
import { Category } from '../../types';
import { Filter } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <section className="filters" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <Filter size={18} color="var(--secondary-color)" />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary-color)' }}>カテゴリで絞り込み</span>
      </div>
      
      <div className="category-chips" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          className={`badge ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
          style={{ 
            border: 'none', 
            cursor: 'pointer', 
            backgroundColor: selectedCategory === null ? 'var(--primary-color)' : 'var(--card-bg)', 
            color: selectedCategory === null ? 'white' : 'var(--secondary-color)',
            border: selectedCategory === null ? 'none' : '1px solid var(--border-color)'
          }}
        >
          すべて
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id} 
            className={`badge ${selectedCategory === cat.id ? 'active' : ''} ${cat.is_readonly ? 'badge-readonly' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
            style={{ 
              border: 'none', 
              cursor: 'pointer', 
              backgroundColor: selectedCategory === cat.id ? 'var(--primary-color)' : 'var(--card-bg)', 
              color: selectedCategory === cat.id ? 'white' : (cat.is_readonly ? 'var(--danger-color)' : 'var(--secondary-color)'),
              border: selectedCategory === cat.id ? 'none' : '1px solid var(--border-color)'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilter;
