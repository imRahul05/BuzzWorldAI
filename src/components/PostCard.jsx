import React from 'react';

const PostCard = ({ post, onReply }) => {
  const formattedDate = post.timestamp 
    ? new Date(post.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : 'Just now';

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg text-gray-800">{post.title}</h3>
        <div className="flex items-center">
          <span className="text-gray-500 text-xs px-2 py-1 bg-gray-100 rounded-full">
            {post.location || 'Local area'}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{post.message}</p>

      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">{formattedDate}</span>
        <button 
          onClick={() => onReply(post.id)}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          <span className="mr-1">💬</span> Reply
        </button>
      </div>

      {post.replies && post.replies.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">{post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}</p>
          {post.replies.map((reply, i) => (
            <div key={i} className="pl-4 border-l-2 border-gray-200 mb-2 text-sm">
              <p className="text-gray-700">{reply.message}</p>
              <p className="text-gray-500 text-xs mt-1">{reply.timestamp ? new Date(reply.timestamp).toLocaleDateString() : 'Just now'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
