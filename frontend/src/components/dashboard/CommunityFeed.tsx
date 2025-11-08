import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import { postsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

interface Post {
  _id: string;
  author: {
    id: string;
    name: string;
    profilePhoto?: string;
    title?: string;
    subtitle?: string;
    type: string;
  };
  content: string;
  imageUrl?: string;
  likeCount: number;
  commentCount: number;
  shares: number;
  isLiked: boolean;
  createdAt: string;
  edited?: boolean;
}

interface CommunityFeedProps {
  filter: string;
}

export const CommunityFeed = ({ filter }: CommunityFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadPosts(1);
  }, [filter]);

  const loadPosts = async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await postsAPI.getPosts(pageNum, 10, filter);
      
      if (pageNum === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
      }

      setHasMore(response.data.pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await postsAPI.toggleLike(postId);
      
      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? {
                ...post,
                isLiked: response.data.isLiked,
                likeCount: response.data.likeCount,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-surface rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl p-12 text-center"
      >
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
        <p className="text-gray-600 mb-6">
          Be the first to share something with the community!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-surface rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {post.author.profilePhoto ? (
                  <img
                    src={post.author.profilePhoto}
                    alt={post.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  post.author.name[0].toUpperCase()
                )}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{post.author.name}</h4>
                <p className="text-sm text-gray-600">
                  {post.author.title} • {formatTimestamp(post.createdAt)}
                  {post.edited && <span className="ml-1">(edited)</span>}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Image */}
          {post.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleLike(post._id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-100 ${
                post.isLiked ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`}
              />
              <span className="text-sm font-medium">{post.likeCount}</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-100 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.commentCount}</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-100 text-gray-600">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">{post.shares}</span>
            </button>
          </div>
        </motion.div>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={() => loadPosts(page + 1)}
            disabled={loadingMore}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
