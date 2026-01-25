// NewsSettings.jsx
import { useState } from 'react';
import { getNewsCategories } from '../../../services/api/NewsAPI';

const NewsSettings = ({ currentCategory, onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(currentCategory || 'general');
  const categories = getNewsCategories();

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Настройки новостей</h3>
      <div className="space-y-2">
        <label className="block text-sm font-medium mb-2">Категория новостей:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`p-3 rounded-lg text-center text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-accent-dark text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSettings;