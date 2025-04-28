import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PopularCategories = ({ navigate }) => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Sedans', icon: '🚗', count: 0, color: '#8b5cf6' },
    { id: 2, name: 'SUVs', icon: '🚙', count: 0, color: '#ec4899' },
    { id: 3, name: 'Hatchbacks', icon: '🚘', count: 0, color: '#3b82f6' },
    { id: 4, name: 'Luxury Cars', icon: '🏎️', count: 0, color: '#f59e0b' },
    { id: 5, name: 'Electric', icon: '⚡', count: 0, color: '#10b981' },
    { id: 6, name: 'Budget Cars', icon: '💰', count: 0, color: '#ef4444' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        const counts = response.data;
        console.log('PopularCategories: Fetched counts:', counts);
        setCategories(prevCategories =>
          prevCategories.map(category => {
            const countData = counts.find(c => c.name === category.name);
            return { ...category, count: countData ? countData.count : 0 };
          })
        );
        setLoading(false);
      } catch (err) {
        setError('Failed to load category counts');
        setLoading(false);
      }
    };
    fetchCategoryCounts();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate('all-cars', { filter: { category: categoryName } });
    console.log(`Selected category: ${categoryName}`);
  };

  return (
    <section className="popular-categories-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Find Your Perfect Car</h2>
          <p className="section-subtitle">Browse our most popular categories</p>
        </div>
        {loading && <p>Loading categories...</p>}
        {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>}
        {!loading && !error && (
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => handleCategoryClick(category.name)}
                style={{ '--category-color': category.color }}
              >
                <div
                  className="category-icon-wrapper"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <span className="category-icon-emoji">{category.icon}</span>
                </div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} cars</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCategories;