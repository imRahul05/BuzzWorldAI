import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import LocationSelector from '../components/LocationSelector';
import { fetchNewsByLocation, fetchTopHeadlines } from '../utils/newsAPI';

const Home = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  
  const locations = ['All Locations', 'Koramangala', 'Indiranagar', 'JP Nagar', 'Whitefield', 'Electronic City'];

  // Fetch news data based on location
  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      try {
        let articles = [];
        
        if (selectedLocation === 'All Locations') {
          // If no specific location is selected, get top headlines for India
          articles = await fetchTopHeadlines();
        } else {
          // Otherwise get news for the selected location
          articles = await fetchNewsByLocation(selectedLocation);
        }
        
        setNews(articles);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        
        // Fallback to dummy data if fetch fails
        setNews(generateDummyNews());
      } finally {
        setIsLoading(false);
      }
    };

    getNews();
  }, [selectedLocation]);

  // Filter news based on search query and location
  const filteredNews = news.filter(article => {
    const matchesSearch = searchQuery === '' || 
      (article.title && article.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = selectedLocation === 'All Locations' || 
      (article.location && article.location === selectedLocation);
    
    return matchesSearch && matchesLocation;
  });

  // Handle refresh action
  const handleRefresh = () => {
    setIsLoading(true);
    // In a real app, this would re-fetch from the API
    setTimeout(() => {
      setNews(generateDummyNews());
      setIsLoading(false);
    }, 1000);
  };

  // Generate dummy news if needed
  const generateDummyNews = () => {
    const locations = ['Koramangala', 'Indiranagar', 'JP Nagar', 'Whitefield', 'Electronic City'];
    const dummyNews = [];
    
    for (let i = 0; i < 10; i++) {
      const location = locations[Math.floor(Math.random() * locations.length)];
      dummyNews.push({
        id: `dummy-${i}`,
        title: `Local News in ${location}: ${['New Park Opening', 'Traffic Update', 'Community Event', 'Water Supply Issue', 'Local Business Spotlight'][i % 5]}`,
        description: `This is a sample news article about events happening in ${location}. Click to read more details about this local news story.`,
        publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        urlToImage: `https://source.unsplash.com/random/800x600?city,${i}`,
        location: location,
        tags: [location, ['Community', 'Infrastructure', 'Events', 'Business', 'Environment'][i % 5]]
      });
    }
    
    return dummyNews;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">BuzzWorld News</h1>
        <Link to="/ai-chat" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          🧠 AI Assistant
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="🔍 Search news..."
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-gray-600">📍</span>
          <LocationSelector
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
          
          <button
            onClick={handleRefresh}
            className="ml-2 p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
            title="Refresh news"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No news found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article, index) => (
            <NewsCard key={article.id || index} article={article} index={index} />
          ))}
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <Link to="/discussion" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium">
          View Community Discussions
        </Link>
      </div>
    </div>
  );
};

export default Home;
