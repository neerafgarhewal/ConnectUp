import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  MessageSquare,
  Eye,
  Bookmark,
  Share2,
  ChevronUp,
  ChevronDown,
  Plus,
  Filter,
  Search,
  Tag,
  X,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';

// Mock forum posts data
const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Alex Kumar',
      role: 'Student at IIT Ropar',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    title: 'How to prepare for Google interviews?',
    content: 'I have an interview coming up at Google for SWE intern position. What are the best resources and strategies to prepare? Any tips from people who have been through the process?',
    category: 'Career Advice',
    tags: ['Interviews', 'Google', 'Career'],
    upvotes: 45,
    downvotes: 2,
    comments: 23,
    views: 342,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    bookmarked: false,
  },
  {
    id: 2,
    author: {
      name: 'Priya Sharma',
      role: 'Data Scientist at Amazon',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    title: 'Best resources for learning React in 2025',
    content: 'Looking for comprehensive resources to learn React from scratch. I have basic JavaScript knowledge. What courses, books, or projects would you recommend?',
    category: 'Technical Help',
    tags: ['React', 'JavaScript', 'Learning'],
    upvotes: 38,
    downvotes: 1,
    comments: 15,
    views: 256,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    bookmarked: true,
  },
  {
    id: 3,
    author: {
      name: 'Dr. Sarah Johnson',
      role: 'Senior Engineer at Google',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    title: 'Hosting a Web Development Workshop - Register Now!',
    content: 'I will be hosting a free web development workshop covering React, Node.js, and deployment. Limited seats available. Register in the comments!',
    category: 'Events',
    tags: ['Workshop', 'Web Development', 'Free'],
    upvotes: 52,
    downvotes: 0,
    comments: 28,
    views: 489,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    bookmarked: false,
  },
  {
    id: 4,
    author: {
      name: 'Michael Chen',
      role: 'Product Manager at Microsoft',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    title: 'Transitioning from engineering to product management',
    content: 'After 5 years as a software engineer, I made the switch to PM. Here is my journey and lessons learned. AMA!',
    category: 'Career Advice',
    tags: ['Product Management', 'Career Switch', 'AMA'],
    upvotes: 67,
    downvotes: 3,
    comments: 34,
    views: 521,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    bookmarked: true,
  },
  {
    id: 5,
    author: {
      name: 'Rahul Verma',
      role: 'Student at IIT Ropar',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    title: 'Software Engineer Internship at Microsoft - Apply Now',
    content: 'Microsoft is hiring interns for summer 2025. Great opportunity for students interested in cloud computing and AI. Link in comments.',
    category: 'Opportunities',
    tags: ['Internship', 'Microsoft', 'Jobs'],
    upvotes: 89,
    downvotes: 1,
    comments: 19,
    views: 678,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    bookmarked: false,
  },
];

const categories = ['Career Advice', 'Technical Help', 'Opportunities', 'Events', 'General'];
const popularTags = [
  'Interviews',
  'Career',
  'React',
  'Python',
  'Machine Learning',
  'Internships',
  'Jobs',
  'Networking',
];

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const ForumPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'my'>('all');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posts, setPosts] = useState(mockPosts);

  const handleVote = (postId: number, type: 'up' | 'down') => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          if (type === 'up') {
            return { ...post, upvotes: post.upvotes + 1 };
          } else {
            return { ...post, downvotes: post.downvotes + 1 };
          }
        }
        return post;
      })
    );
  };

  const toggleBookmark = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post))
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(post.category);

      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => post.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    })
    .sort((a, b) => {
      if (sortBy === 'hot') {
        const scoreA = a.upvotes - a.downvotes + a.comments * 2;
        const scoreB = b.upvotes - b.downvotes + b.comments * 2;
        return scoreB - scoreA;
      }
      if (sortBy === 'new') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      if (sortBy === 'top') {
        return b.upvotes - a.upvotes;
      }
      return 0;
    });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Career Advice': 'bg-blue-500/10 text-blue-500',
      'Technical Help': 'bg-green-500/10 text-green-500',
      Opportunities: 'bg-purple-500/10 text-purple-500',
      Events: 'bg-amber-500/10 text-amber-500',
      General: 'bg-muted text-muted-foreground',
    };
    return colors[category] || colors.General;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-hidden flex">
          {/* Left Sidebar - Desktop */}
          <aside className="w-64 border-r border-border overflow-y-auto p-6 hidden lg:block">
            <div className="space-y-6">
              {/* Popular Tags */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Topics */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </h3>
                <div className="space-y-2">
                  {['Google Interviews', 'React Best Practices', 'Career Switch'].map((topic) => (
                    <button
                      key={topic}
                      className="w-full text-left text-sm hover:text-primary transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Forum Stats */}
              <div>
                <h3 className="font-bold mb-3">Forum Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Posts</span>
                    <span className="font-semibold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Users</span>
                    <span className="font-semibold">456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Today's Posts</span>
                    <span className="font-semibold">23</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
              {/* Top Navigation */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Tabs */}
                  <div className="flex gap-2">
                    {(['all', 'following', 'my'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeTab === tab
                            ? 'bg-primary text-white'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {tab === 'all' ? 'All Posts' : tab === 'following' ? 'Following' : 'My Posts'}
                      </button>
                    ))}
                  </div>

                  {/* Sort & Create */}
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
                    >
                      <option value="hot">🔥 Hot</option>
                      <option value="new">🆕 New</option>
                      <option value="top">⭐ Top</option>
                    </select>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Create Post
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* Active Filters */}
                {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {cat}
                        <button onClick={() => toggleCategory(cat)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                      >
                        {tag}
                        <button onClick={() => toggleTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="glass rounded-xl overflow-hidden hover:shadow-xl transition-all group"
                    >
                      <div className="flex">
                        {/* Voting Section */}
                        <div className="flex flex-col items-center gap-1 p-4 bg-muted/30">
                          <button
                            onClick={() => handleVote(post.id, 'up')}
                            className="p-1 hover:bg-primary/10 rounded transition-all"
                          >
                            <ChevronUp className="w-5 h-5" />
                          </button>
                          <span className="font-bold text-sm">
                            {post.upvotes - post.downvotes}
                          </span>
                          <button
                            onClick={() => handleVote(post.id, 'down')}
                            className="p-1 hover:bg-red-500/10 rounded transition-all"
                          >
                            <ChevronDown className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Post Content */}
                        <div className="flex-1 p-4">
                          {/* Author & Meta */}
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm">{post.author.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {post.author.role}
                                </span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(post.timestamp)}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                post.category
                              )}`}
                            >
                              {post.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors cursor-pointer">
                            {post.title}
                          </h3>

                          {/* Content Preview */}
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {post.content}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Interaction Bar */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <MessageSquare className="w-4 h-4" />
                              {post.comments}
                            </button>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </span>
                            <button
                              onClick={() => toggleBookmark(post.id)}
                              className={`flex items-center gap-1 transition-colors ${
                                post.bookmarked ? 'text-primary' : 'hover:text-primary'
                              }`}
                            >
                              <Bookmark
                                className={`w-4 h-4 ${post.bookmarked ? 'fill-primary' : ''}`}
                              />
                            </button>
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No posts found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or create a new post
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      Create Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Desktop */}
          <aside className="w-80 border-l border-border overflow-y-auto p-6 hidden xl:block">
            <div className="space-y-6">
              {/* Create Post Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Post
              </button>

              {/* Filters */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>

                {/* Categories */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 rounded border-border text-primary"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Saved Posts */}
              <div className="glass p-4 rounded-xl">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  Saved Posts
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {posts.filter((p) => p.bookmarked).length} posts saved
                </p>
                <button className="text-sm text-primary hover:underline">View All</button>
              </div>
            </div>
          </aside>
        </main>
      </div>

      {/* Create Post Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-foreground/5 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-muted-foreground">
                Full create post form with rich text editor will be implemented here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Create Button - Mobile */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center xl:hidden z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
