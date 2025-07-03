import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import LocationSelector from '../components/LocationSelector';

const Discussion = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [isLoading, setIsLoading] = useState(true);
  
  const locations = ['All Locations', 'Koramangala', 'Indiranagar', 'JP Nagar', 'Whitefield', 'Electronic City'];

  useEffect(() => {
    setIsLoading(true);
    const storedPosts = localStorage.getItem('buzzworld_posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      const dummyPosts = generateDummyPosts();
      setPosts(dummyPosts);
      localStorage.setItem('buzzworld_posts', JSON.stringify(dummyPosts));
    }
    setIsLoading(false);
  }, []);

  const generateDummyPosts = () => {
    const dummyPosts = [];
    const topics = [
      'Water shortage in our area',
      'New park development',
      'Traffic signal not working',
      'Looking for good restaurants',
      'Community cleanup drive',
      'Power outage issues',
      'Street dogs situation',
      'Weekend farmers market'
    ];
    
    for (let i = 0; i < 12; i++) {
      const location = locations[Math.floor(Math.random() * (locations.length - 1)) + 1]; // Skip 'All Locations'
      const topicIndex = i % topics.length;
      const daysAgo = Math.floor(Math.random() * 7);
      
      dummyPosts.push({
        id: `post-${Date.now() - i}`,
        title: topics[topicIndex],
        message: `This is a community discussion about ${topics[topicIndex].toLowerCase()} in our neighborhood. Let's discuss how we can address this issue together.`,
        location,
        timestamp: new Date(Date.now() - (daysAgo * 86400000)).toISOString(),
        replies: generateDummyReplies(Math.floor(Math.random() * 4)) // 0-3 replies
      });
    }
    
    return dummyPosts;
  };
  
  const generateDummyReplies = (count) => {
    const replies = [];
    const replyMessages = [
      'I agree with this!',
      'Has anyone contacted the authorities about this?',
      'This has been an ongoing issue for weeks.',
      'I can help organize a community response.',
      'We faced the same issue last month.',
      'Thanks for bringing attention to this problem.'
    ];
    
    for (let i = 0; i < count; i++) {
      replies.push({
        id: `reply-${Date.now() - i}`,
        message: replyMessages[Math.floor(Math.random() * replyMessages.length)],
        timestamp: new Date(Date.now() - (Math.random() * 86400000)).toISOString()
      });
    }
    
    return replies;
  };

  const filteredPosts = posts.filter(post => {
    return selectedLocation === 'All Locations' || post.location === selectedLocation;
  });

  const handleCreatePost = (newPost) => {
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('buzzworld_posts', JSON.stringify(updatedPosts));
  };

  const handleReply = (postId) => {
    const replyMessage = prompt('Enter your reply:');
    if (replyMessage && replyMessage.trim()) {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const newReply = {
            id: `reply-${Date.now()}`,
            message: replyMessage.trim(),
            timestamp: new Date().toISOString()
          };
          
          return {
            ...post,
            replies: [...(post.replies || []), newReply]
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      localStorage.setItem('buzzworld_posts', JSON.stringify(updatedPosts));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4 sm:mb-0">Community Discussion Board</h1>
        
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">📍</span>
            <LocationSelector
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
            />
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <span className="mr-2">➕</span> New Post
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No discussions yet for this location.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start a discussion
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
      
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
        locations={locations.slice(1)} 
      />
    </div>
  );
};

export default Discussion;
