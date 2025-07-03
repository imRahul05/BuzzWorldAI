// Real implementation for the Gemini API integration
// using the provided API key

/**
 * Sends a prompt to the Gemini API and returns the response
 * @param {string} prompt - The prompt to send to Gemini
 * @param {object} context - Optional context about articles or location
 * @returns {Promise<string>} - The response from Gemini
 */
export const askGemini = async (prompt, context = {}) => {
  console.log('Sending to Gemini API:', { prompt, context });
  
  const API_KEY = "AIzaSyD-kvFzEo9vFoChd8ymqUNJtw7zepYm83E";
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent";
  
  try {
    // Construct a context-aware prompt
    let fullPrompt = prompt;
    
    // Add article context if available
    if (context.article) {
      fullPrompt = `
      I'm answering questions about this news article:
      Title: ${context.article.title}
      Description: ${context.article.description || 'No description available'}
      Location: ${context.article.location || 'Unknown location'}
      Date: ${context.article.publishedAt ? new Date(context.article.publishedAt).toLocaleDateString() : 'Unknown date'}
      
      ${context.article.content ? `Content: ${context.article.content}` : ''}
      
      The user's question is: ${prompt}
      
      Please provide a helpful response based on this article.
      `;
    }
    
    // Add location context if available
    if (context.location && !context.article) {
      fullPrompt = `
      I'm answering questions about news and events in ${context.location}.
      The user's question is: ${prompt}
      
      Please provide relevant information about ${context.location} related to this question.
      `;
    }
    
    // Make the API request to Gemini
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topK: 40,
          topP: 0.95
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    // Extract the text from the response
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback responses in case of API failure
    if (prompt.toLowerCase().includes('summarize') && context.article) {
      return `Here's a summary of "${context.article.title}": ${context.article.description} The article discusses key developments and potential impacts on local residents.`;
    }
    
    if (prompt.toLowerCase().includes('who is affected') && context.article) {
      return `Based on the article "${context.article.title}", the people most affected appear to be residents in the ${context.article.location || 'local'} area, particularly those who rely on the services or infrastructure being discussed.`;
    }
    
    if (context.location) {
      return `Regarding ${context.location}: There have been several recent developments including infrastructure improvements, community initiatives, and local business changes. Residents have been discussing these topics in community forums.`;
    }
    
    // Default error response
    return "I'm sorry, I encountered an error processing your request. Please try again later.";
  }
};

/**
 * Generates dummy news content for a specific location
 * @param {string} location - The location to generate news for
 * @param {number} count - Number of articles to generate
 * @returns {Array} - Array of generated news articles
 */
export const generateNewsForLocation = async (location, count = 5) => {
  // In a real implementation, this would use the Gemini API to generate content
  console.log(`Generating ${count} news articles for ${location}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const articles = [];
  const topics = [
    'infrastructure', 'community', 'business', 
    'environment', 'traffic', 'events', 
    'water supply', 'public services', 'education'
  ];
  
  for (let i = 0; i < count; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    
    articles.push({
      id: `${location}-${Date.now()}-${i}`,
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Update: ${location} residents notice changes`,
      description: `Recent developments regarding ${topic} in ${location} have residents talking. Local authorities have announced new initiatives that will affect the neighborhood.`,
      publishedAt: new Date(Date.now() - (daysAgo * 86400000)).toISOString(),
      urlToImage: `https://source.unsplash.com/random/800x600?${location.toLowerCase()},${topic}`,
      location: location,
      tags: [location, topic, 'Local News']
    });
  }
  
  return articles;
};

export default {
  askGemini,
  generateNewsForLocation
};
