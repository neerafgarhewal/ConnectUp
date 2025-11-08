import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Send, X } from 'lucide-react';
import { postsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { authAPI } from '../../services/api';

interface CreatePostProps {
  onPostCreated: () => void;
}

export const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [posting, setPosting] = useState(false);
  const currentUser = authAPI.getCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    try {
      setPosting(true);
      await postsAPI.createPost({
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });

      toast.success('Post created successfully!');
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {currentUser?.firstName?.[0]?.toUpperCase() || 'U'}
        </div>

        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, experiences, or ask a question..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
            maxLength={5000}
          />

          {showImageInput && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => {
                  setShowImageInput(false);
                  setImageUrl('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}

          {imageUrl && (
            <div className="mt-3 relative rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={() => {
                  toast.error('Invalid image URL');
                  setImageUrl('');
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Photo</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!content.trim() || posting}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {posting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
