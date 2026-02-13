import { memo } from 'react';
import { FaExternalLinkAlt, FaNewspaper } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';

const NewsCard = ({ article, truncateText, formatDate }) => {
  return (
    <div className="bg-gray-800/60 rounded-xl p-3 hover:bg-gray-800/60 transition-all duration-200 border-l-4 border-accent-dark">
      {/* Заголовок и дата */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-white text-sm sm:text-base line-clamp-2 grow">
          {truncateText(article.title, 60)}
        </h3>
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-accent-dark hover:text-white ml-2 shrink-0"
          title="Открыть новость"
        >
          <FaExternalLinkAlt className="w-4 h-4" />
        </a>
      </div>

      {/* Описание */}
      {article.description && (
        <p className="text-sub-text-dark text-xs sm:text-sm mb-3 line-clamp-2">
          {truncateText(article.description, 120)}
        </p>
      )}

      {/* Источник и время */}
      <div className="flex justify-between items-center text-xs text-sub-text-dark">
        <div className="flex items-center">
          {article.source?.name && (
            <>
              <FaNewspaper className="mr-1" />
              <span className="truncate max-w-25 sm:max-w-37.5">
                {article.source.name}
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center">
          <MdAccessTime className="mr-1" />
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>

      {/* Изображение */}
      {article.urlToImage && (
        <div className="mt-3 overflow-hidden rounded-lg">
          <img 
            src={article.urlToImage} 
            alt={article.title} 
            className="w-full h-32 sm:h-40 object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default memo(NewsCard);
