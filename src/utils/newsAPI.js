// NewsAPI utility for fetching news from newsapi.org
import axios from 'axios';

const NEWS_API_KEY = '6144067bfae64c9ab2bdd7446931f9e5';
const BASE_URL = 'https://newsapi.org/v2';

/**
 * Fetches news articles based on location
 * @param {string} location - Location to search for
 * @param {number} pageSize - Number of articles to fetch
 * @returns {Promise<Array>} - Array of news articles
 */
export const fetchNewsByLocation = async (location, pageSize = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: location,
        apiKey: NEWS_API_KEY,
        pageSize,
        language: 'en',
        sortBy: 'publishedAt'
      }
    });
    
    return response.data.articles.map(article => ({
      ...article,
      id: article.url,
      location: determineLocation(article, location !== 'All Locations' ? location : 'Bangalore'),
      tags: generateTagsFromContent(article)
    }));
  } catch (error) {
    console.error('Error fetching news by location:', error);
    throw error;
  }
};

/**
 * Searches for news articles by keyword
 * @param {string} keyword - Keyword to search for
 * @param {number} pageSize - Number of articles to fetch
 * @returns {Promise<Array>} - Array of news articles
 */
export const searchNews = async (keyword, pageSize = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: keyword,
        apiKey: NEWS_API_KEY,
        pageSize,
        language: 'en'
      }
    });
    
    return response.data.articles.map(article => ({
      ...article,
      id: article.url,
      location: determineLocation(article, 'Bangalore'),
      tags: generateTagsFromContent(article)
    }));
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};

/**
 * Fetches top headlines for India with local news focus
 * @param {number} pageSize - Number of articles to fetch
 * @returns {Promise<Array>} - Array of news articles
 */
export const fetchTopHeadlines = async (pageSize = 20) => {
  try {
    // First try to get India-focused local news
    try {
      const localResponse = await axios.get(`${BASE_URL}/everything`, {
        params: {
          q: 'India local news Bangalore',
          apiKey: NEWS_API_KEY,
          pageSize: pageSize,
          language: 'en',
          sortBy: 'publishedAt'
        }
      });
      
      if (localResponse.data.articles && localResponse.data.articles.length > 0) {
        console.log('Found local India news:', localResponse.data.articles.length);
        return localResponse.data.articles.map(article => ({
          ...article,
          id: article.url,
          location: determineLocation(article, 'Bangalore'),
          tags: generateTagsFromContent(article)
        }));
      }
    } catch (localError) {
      console.error('Error fetching local India news:', localError);
      // Continue to fallback
    }
    
    // Fall back to top headlines if local search fails
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        country: 'in',
        apiKey: NEWS_API_KEY,
        pageSize
      }
    });
    
    return response.data.articles.map(article => ({
      ...article,
      id: article.url,
      location: determineLocation(article, 'Bangalore'),
      tags: generateTagsFromContent(article)
    }));
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    throw error;
  }
};

// Helper function to determine location from article content
const determineLocation = (article, defaultLocation) => {
  const locations = ['Koramangala', 'Indiranagar', 'JP Nagar', 'Whitefield', 'Electronic City', 'Bangalore'];
  
  // Search for location mentions in title or description
  const content = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  
  for (const loc of locations) {
    if (content.includes(loc.toLowerCase())) {
      return loc;
    }
  }
  
  return defaultLocation;
};

// Helper function to generate tags from article content
const generateTagsFromContent = (article) => {
  const tags = [];
  const content = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  
  // Check for common categories
  const categories = [
    'Technology', 'Business', 'Health', 'Environment', 
    'Politics', 'Sports', 'Entertainment', 'Education',
    'Infrastructure', 'Community', 'Traffic', 'Weather'
  ];
  
  categories.forEach(category => {
    if (content.includes(category.toLowerCase())) {
      tags.push(category);
    }
  });
  
  // Add a location tag if found
  const locations = ['Koramangala', 'Indiranagar', 'JP Nagar', 'Whitefield', 'Electronic City', 'Bangalore'];
  locations.forEach(loc => {
    if (content.includes(loc.toLowerCase())) {
      tags.push(loc);
    }
  });
  
  // If no tags were found, add a default
  if (tags.length === 0) {
    tags.push('Local News');
  }
  
  return tags;
};

export default {
  fetchNewsByLocation,
  searchNews,
  fetchTopHeadlines
};
