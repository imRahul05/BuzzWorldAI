import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ article, index }) => {
  // Generate a dummy ID if none exists
  const articleId = article.id || `article-${index}`;
  
  // Format the published date
  const formattedDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : 'Recent';

  // Extract tags from article (if available) or generate dummy tags
  const tags = article.tags || ['Local', 'News'];

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-4 bg-white">
      <Link 
        to={`/news/${articleId}`} 
        className="block"
        onClick={() => {
          // Save the article to sessionStorage to retrieve it on the detail page
          sessionStorage.setItem(`article-${articleId}`, JSON.stringify(article));
        }}
      >
        {article.urlToImage && (
          <img 
            src={article.urlToImage} 
            alt={article.title || 'News image'} 
            className="w-full h-48 object-cover rounded-md mb-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400?text=BuzzWorld+News';
            }}
          />
        )}
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {article.title || 'Breaking News'}
        </h2>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {article.description || 'Click to read more about this local news story.'}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {tags.map((tag, i) => (
              <span 
                key={i} 
                className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-500 text-sm">{formattedDate}</p>
        </div>
      </Link>
      <div className="mt-4 flex justify-end">
        <button 
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          onClick={(e) => {
            e.preventDefault();
            // Save the article in sessionStorage and redirect to AI chat
            sessionStorage.setItem('current-article-for-ai', JSON.stringify(article));
            window.location.href = '/ai-chat?source=article';
          }}
        >
          <span className="mr-1">💬</span> Ask AI about this
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
