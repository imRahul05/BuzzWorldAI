import React, { useState, useEffect } from 'react';

import { searchNews } from '../utils/newsAPI';

const NewsDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        
        let foundArticle = null;
        const cachedArticle = sessionStorage.getItem(`article-${id}`);
        
        if (cachedArticle) {
          foundArticle = JSON.parse(cachedArticle);
        } else if (id.startsWith('http')) {
          const encodedUrl = encodeURIComponent(id);
          const apiUrl = `https://newsapi.org/v2/everything?q=${encodedUrl}&apiKey=${apiKey}&pageSize=1`;
          
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch from NewsAPI');
          }
          
          const data = await response.json();
          if (data.articles && data.articles.length > 0) {
            foundArticle = data.articles[0];
            // Add location and tags
            foundArticle.location = determineLocation(foundArticle);
            foundArticle.tags = generateTagsFromContent(foundArticle);
            foundArticle.id = id;
          }
        } else {
          const apiUrl = `https://newsapi.org/v2/everything?q=local+news+bangalore&apiKey=${apiKey}&pageSize=10`;
          
          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.articles && data.articles.length > 0) {
              const randomIndex = Math.floor(Math.random() * data.articles.length);
              foundArticle = data.articles[randomIndex];
              foundArticle.location = determineLocation(foundArticle);
              foundArticle.tags = generateTagsFromContent(foundArticle);
              foundArticle.id = id;
            }
          }
        }
        
        if (foundArticle) {
          setArticle(foundArticle);
          
          const keywords = extractKeywords(foundArticle);
          const relatedApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords.join(' OR '))}&apiKey=${apiKey}&pageSize=3&language=en`;
          
          const relatedResponse = await fetch(relatedApiUrl);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            const relatedArticles = relatedData.articles.map(article => {
              return {
                ...article,
                id: article.url,
                location: determineLocation(article),
                tags: generateTagsFromContent(article)
              };
            }).filter(a => a.id !== id);
            
            setRelatedNews(relatedArticles.length > 0 ? relatedArticles : generateRelatedNews(foundArticle));
          } else {
            setRelatedNews(generateRelatedNews(foundArticle));
          }
        } else {
          const dummyArticle = generateDummyArticle(id);
          setArticle(dummyArticle);
          setRelatedNews(generateRelatedNews(dummyArticle));
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load the article. Please try again later.');
        
        const dummyArticle = generateDummyArticle(id);
        setArticle(dummyArticle);
        setRelatedNews(generateRelatedNews(dummyArticle));
      } finally {
        setIsLoading(false);
      }
    };
    
    const determineLocation = (article) => {
      const locations = ['Koramangala', 'Indiranagar', 'JP Nagar', 'Whitefield', 'Electronic City'];
      
      const content = `${article.title || ''} ${article.description || ''}`.toLowerCase();
      
      for (const loc of locations) {
        if (content.includes(loc.toLowerCase())) {
          return loc;
        }
      }
      
      return 'Bangalore';
    };
    
    const generateTagsFromContent = (article) => {
      const tags = [];
      const content = `${article.title || ''} ${article.description || ''}`.toLowerCase();
      
      const categories = [
        'Technology', 'Business', 'Health', 'Environment', 
        'Politics', 'Sports', 'Entertainment', 'Education'
      ];
      
      categories.forEach(category => {
        if (content.includes(category.toLowerCase())) {
          tags.push(category);
        }
      });
      
      const locations = ['Koramangala', 'Indiranagar', 'JP Nagar', 'Whitefield', 'Electronic City', 'Bangalore'];
      locations.forEach(loc => {
        if (content.includes(loc.toLowerCase())) {
          tags.push(loc);
        }
      });
      
      if (tags.length === 0) {
        tags.push('Local News');
      }
      
      return tags;
    };
    
    const extractKeywords = (article) => {
      const keywords = [];
      
      if (article.location) {
        keywords.push(article.location);
      }
      
      const title = article.title || '';
      const words = title.split(' ')
        .filter(word => word.length > 4) 
        .filter(word => !['about', 'after', 'again', 'along', 'could', 'every', 'from', 'their', 'there', 'these', 'those', 'what', 'when', 'where', 'which', 'would'].includes(word.toLowerCase()));
      
      if (words.length > 0) {
        keywords.push(...words.slice(0, 3));
      }
      
      keywords.push('Bangalore', 'news');
      
      return keywords.filter((item, index, self) => self.indexOf(item) === index); // Remove duplicates
    };
    
    fetchArticle();
  }, [id]);
  
  const generateDummyArticle = (articleId) => {
    const locations = ['Koramangala', 'Indiranagar', 'JP Nagar', 'Whitefield', 'Electronic City'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const topics = ['community', 'infrastructure', 'events', 'business', 'environment'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    return {
      id: articleId,
      title: `Local ${topic.charAt(0).toUpperCase() + topic.slice(1)} Update in ${location}`,
      description: `Recent developments regarding ${topic} in the ${location} area have caught residents' attention.`,
      content: `
        <p class="mb-4">BANGALORE, ${new Date().toLocaleDateString()} - Recent developments regarding ${topic} in the ${location} area have caught residents' attention as local authorities announced new initiatives.</p>
        
        <p class="mb-4">Community members gathered to discuss the implications of these changes, with many expressing optimism about the potential benefits for the neighborhood.</p>
        
        <p class="mb-4">"We've been waiting for progress on this front for some time," said a local resident who attended the community meeting. "It's encouraging to see concrete steps being taken."</p>
        
        <p class="mb-4">The initiative is expected to roll out in phases over the next few months, with the first visible changes anticipated by the end of the quarter.</p>
        
        <p class="mb-4">Local businesses have also weighed in on the announcement, with most indicating support for the direction being taken by authorities. Some have already begun preparations to adapt to the expected changes.</p>
        
        <p class="mb-4">Further details are expected to be released in the coming weeks as plans are finalized and additional community feedback is incorporated.</p>
      `,
      publishedAt: new Date().toISOString(),
      author: 'BuzzWorld News Team',
      urlToImage: `https://source.unsplash.com/random/1200x800?${location.toLowerCase()},${topic}`,
      location: location,
      tags: [location, topic, 'Local News']
    };
  };
  
  const generateRelatedNews = (baseArticle) => {
    const relatedArticles = [];
    const location = baseArticle.location;
    const tags = baseArticle.tags || [];
    
    for (let i = 0; i < 3; i++) {
      relatedArticles.push({
        id: `related-${baseArticle.id}-${i}`,
        title: `${i === 0 ? 'Earlier' : i === 1 ? 'Related' : 'Upcoming'} News in ${location}: ${['Development Project', 'Community Initiative', 'Local Business Update'][i % 3]}`,
        description: `Another news story related to ${tags[0] || 'local'} developments in the ${location} area.`,
        publishedAt: new Date(Date.now() - (i * 86400000)).toISOString(),
        urlToImage: `https://source.unsplash.com/random/800x600?${location.toLowerCase()},${i}`,
        location: location,
        tags: [location, tags[Math.floor(Math.random() * tags.length)]]
      });
    }
    
    return relatedArticles;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleAskAI = () => {
    if (article) {
      sessionStorage.setItem('current-article-for-ai', JSON.stringify(article));
      
      window.location.href = '/ai-chat?source=article';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error || 'Article not found'}
        </div>
        <div className="mt-4">
          <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline">← Back to News Feed</Link>
      </div>
      
      <article className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{article.title}</h1>
        
        {article.urlToImage && (
          <img 
            src={article.urlToImage} 
            alt={article.title}
            className="w-full h-auto rounded-lg mb-6 object-cover max-h-96"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/1200x600?text=BuzzWorld+News';
            }}
          />
        )}
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">Published: {formatDate(article.publishedAt)}</p>
            {article.author && <p className="text-gray-500">By: {article.author}</p>}
          </div>
          
          <div className="flex space-x-2">
            {article.tags && article.tags.map((tag, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {article.content ? (
          <div 
            className="prose max-w-none text-gray-700 mb-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <p className="text-gray-700 mb-6">{article.description}</p>
        )}
        
        <div className="mt-8 border-t border-gray-200 pt-4">
          <button 
            onClick={handleAskAI}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <span className="mr-2">💬</span> Ask AI about this article
          </button>
        </div>
      </article>
      
      {relatedNews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Related News</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map((related, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/news/${related.id}`} className="block">
                  {related.urlToImage && (
                    <img 
                      src={related.urlToImage} 
                      alt={related.title} 
                      className="w-full h-32 object-cover rounded-md mb-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/600x400?text=Related+News';
                      }}
                    />
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{related.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{related.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
