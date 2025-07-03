import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';

const AIChat = () => {
  const [searchParams] = useSearchParams();
  const [articleContext, setArticleContext] = useState(null);
  
  // Suggestions for the chat, will be updated based on context
  const [suggestions, setSuggestions] = useState([
    "Summarize the latest news",
    "What's happening in Koramangala?",
    "Tell me about traffic issues",
    "Latest community events",
    "Who is affected by the water shortage?"
  ]);
  
  // Initial messages state
  const [initialMessages, setInitialMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your BuzzWorld AI assistant. How can I help you with local news or information today?'
    }
  ]);
  
  // Check if user came from an article page
  useEffect(() => {
    const source = searchParams.get('source');
    if (source === 'article') {
      try {
        const articleData = sessionStorage.getItem('current-article-for-ai');
        if (articleData) {
          const article = JSON.parse(articleData);
          setArticleContext(article);
          
          // Update suggestions based on article
          setSuggestions([
            `Summarize this article about ${article.title}`,
            "Who is affected by this news?",
            "Give more context about this topic",
            "What are the implications of this news?",
            "Is there similar news from other areas?"
          ]);
          
          // Update initial message
          setInitialMessages([
            {
              role: 'assistant',
              content: `I see you're interested in the article "${article.title}". How can I help you understand more about this topic?`
            }
          ]);
        }
      } catch (error) {
        console.error('Error parsing article data:', error);
      }
    }
  }, [searchParams]);
  
  // Connect to the Gemini API
  const handleSendMessage = async (message) => {
    console.log('User sent:', message);
    
    try {
      // Import the askGemini function
      const { askGemini } = await import('../utils/geminiAPI');
      
      // Determine if the message is about a specific location
      const locations = ['Koramangala', 'Indiranagar', 'JP Nagar', 'Whitefield', 'Electronic City', 'Bangalore'];
      const messageLocation = locations.find(loc => message.toLowerCase().includes(loc.toLowerCase()));
      
      // Get recent news for context if a location is mentioned
      let context = {};
      
      if (messageLocation) {
        try {
          const apiKey = '6144067bfae64c9ab2bdd7446931f9e5';
          const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(messageLocation)}&apiKey=${apiKey}&pageSize=3&language=en`;
          const response = await fetch(apiUrl);
          
          if (response.ok) {
            const data = await response.json();
            if (data.articles && data.articles.length > 0) {
              // Add recent news to the context
              context = {
                location: messageLocation,
                recentNews: data.articles.map(article => ({
                  title: article.title,
                  description: article.description
                }))
              };
            }
          }
        } catch (error) {
          console.error('Error fetching news for context:', error);
        }
      }
      
      // Add article context if available
      if (articleContext) {
        context = {
          ...context,
          article: articleContext
        };
      }
      
      // Call Gemini API
      const response = await askGemini(message, context);
      return response;
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      // Fallback responses in case of API failure
      const messageLower = message.toLowerCase();
      
      if (messageLower.includes('summarize')) {
        return "Here's a summary of recent local news: There have been reports of water shortages in JP Nagar, a new community park opening in Indiranagar, and ongoing traffic signal issues at the Koramangala junction. The farmers market in Whitefield this weekend had record attendance.";
      }
      else if (messageLower.includes('koramangala')) {
        return "In Koramangala, there's a new traffic management system being implemented near the 80 Feet Road junction. Also, several new cafes have opened in Koramangala 5th Block. Residents have reported improved garbage collection services in the area over the past week.";
      }
      else if (messageLower.includes('traffic')) {
        return "Traffic updates: There are ongoing roadworks on Outer Ring Road causing delays during peak hours. The flyover near Electronic City is partially closed for maintenance until Friday. A new traffic signal has been installed at the Indiranagar 100 Feet Road junction to help manage congestion.";
      }
      else {
        return "I'm sorry, I encountered an error processing your request. Please try again later.";
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-600">BuzzWorld AI Assistant</h1>
        <p className="text-gray-600">Ask me anything about local news and events</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-[600px] border border-gray-200">
        <ChatBox 
          onSendMessage={handleSendMessage} 
          initialMessages={initialMessages}
          suggestions={suggestions}
        />
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">About AI Assistant</h3>
        <p className="text-blue-700">
          This AI assistant can help you get information about local news, events, and community discussions.
          You can ask about specific neighborhoods, topics like traffic or water issues, or request summaries of recent news.
        </p>
        <p className="text-blue-700 mt-2 text-sm">
          <strong>Note:</strong> This is a prototype demonstration. In a production version, this would connect to the Gemini API
          and provide real-time information based on the latest news articles and community posts.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
