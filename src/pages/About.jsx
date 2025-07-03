import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">About BuzzWorld AI</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📱 About BuzzWorld</h2>
        <p className="text-gray-700 mb-4">
          BuzzWorld AI is a hyperlocal news and community platform that connects you with what's happening in your neighborhood.
          From local news and events to community discussions, BuzzWorld keeps you informed about your immediate surroundings.
        </p>
        <p className="text-gray-700">
          Our mission is to strengthen local communities by providing relevant, timely information and creating spaces for
          meaningful neighborhood discussions.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🤖 How AI Works</h2>
        <p className="text-gray-700 mb-4">
          BuzzWorld leverages Google's Gemini AI to enhance your local news experience. Our AI assistant can:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
          <li>Summarize news articles to give you the key points</li>
          <li>Answer questions about specific news topics or events</li>
          <li>Provide context about local issues</li>
          <li>Analyze trends in community discussions</li>
          <li>Help you find relevant information based on your location</li>
        </ul>
        <p className="text-gray-700">
          The AI uses RAG (Retrieval-Augmented Generation) technology to access and understand the latest local news and
          community posts, ensuring you get accurate and relevant information.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🛠 Built Using</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium text-blue-600 mb-2">Frontend</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>React</li>
              <li>React Router</li>
              <li>Tailwind CSS</li>
              <li>React Modal</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium text-blue-600 mb-2">Backend & APIs</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Google Gemini API</li>
              <li>NewsAPI.org</li>
              <li>LocalStorage for demonstration</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            BuzzWorld AI 
          </p>
         
        </div>
      </div>
    </div>
  );
};

export default About;
