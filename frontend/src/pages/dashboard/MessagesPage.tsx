import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Video,
  Info,
  MoreVertical,
  Check,
  CheckCheck,
  ArrowLeft,
  ArrowDown,
  MessageCircle,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';

// Mock conversations data
const mockConversations = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Senior Software Engineer at Google',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Great session today! Here are the resources I mentioned...',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    unread: 2,
    online: true,
    pinned: true,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager at Microsoft',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Looking forward to our next meeting!',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    unread: 0,
    online: false,
    pinned: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Data Scientist at Amazon',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    lastMessage: 'I found this article that might help you',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    unread: 1,
    online: true,
    pinned: false,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Full Stack Developer at Meta',
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    lastMessage: 'Thanks for the recommendation!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unread: 0,
    online: false,
    pinned: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

// Mock messages data
const mockMessages = {
  1: [
    {
      id: 1,
      senderId: 1,
      text: 'Hi! Thanks for accepting my mentorship request.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'read',
      isSent: false,
    },
    {
      id: 2,
      senderId: 'me',
      text: "You're welcome! I'm excited to help you on your journey.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
      status: 'read',
      isSent: true,
    },
    {
      id: 3,
      senderId: 1,
      text: 'I have some questions about machine learning career paths.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
      status: 'read',
      isSent: false,
    },
    {
      id: 4,
      senderId: 'me',
      text: 'Of course! What specifically would you like to know?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 12 * 60 * 1000),
      status: 'read',
      isSent: true,
    },
    {
      id: 5,
      senderId: 1,
      text: 'What skills should I focus on to get into ML engineering?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'read',
      isSent: false,
    },
    {
      id: 6,
      senderId: 'me',
      text: 'Great question! Focus on Python, TensorFlow/PyTorch, and understanding ML algorithms deeply. Also work on real projects.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: 'read',
      isSent: true,
    },
    {
      id: 7,
      senderId: 'me',
      text: 'Great session today! Here are the resources I mentioned...',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'delivered',
      isSent: true,
    },
  ],
};

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const MessagesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'mentors' | 'students' | 'unread'>('all');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Record<number, any[]>>(mockMessages as any);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const selectedConv = mockConversations.find((c) => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      senderId: 'me',
      text: messageInput,
      timestamp: new Date(),
      status: 'sending' as const,
      isSent: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }));

    setMessageInput('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        ),
      }));
    }, 500);

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ),
      }));
    }, 1000);

    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(true);
    }, 2000);

    setTimeout(() => {
      setIsTyping(false);
      const response = {
        id: Date.now() + 1,
        senderId: selectedConversation,
        text: 'Thanks! I appreciate your help.',
        timestamp: new Date(),
        status: 'read' as const,
        isSent: false,
      };
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: [...prev[selectedConversation], response],
      }));
    }, 4000);
  };

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch =
      searchQuery === '' ||
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterTab === 'all' ||
      (filterTab === 'unread' && conv.unread > 0) ||
      (filterTab === 'mentors' && conv.role.includes('at')) ||
      (filterTab === 'students' && !conv.role.includes('at'));

    return matchesSearch && matchesFilter;
  });

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <aside
            className={`w-full md:w-96 border-r border-border flex flex-col bg-background ${
              selectedConversation ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-4 border-b border-border overflow-x-auto">
              {(['all', 'mentors', 'students', 'unread'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterTab === tab
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {sortedConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No conversations found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : (
                sortedConversations.map((conv) => (
                  <motion.button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-foreground/5 transition-all border-b border-border ${
                      selectedConversation === conv.id ? 'bg-primary/5' : ''
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.avatar}
                        alt={conv.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold truncate">{conv.name}</h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {formatTimestamp(conv.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-1">{conv.role}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <span className="ml-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </aside>

          {/* Chat Area */}
          <div
            className={`flex-1 flex flex-col ${
              !selectedConversation ? 'hidden md:flex' : 'flex'
            }`}
          >
            {selectedConversation && selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-foreground/5 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <img
                        src={selectedConv.avatar}
                        alt={selectedConv.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selectedConv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConv.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConv.online
                          ? 'Active now'
                          : `Last seen ${formatTimestamp(selectedConv.lastSeen || new Date())}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-foreground/5 rounded-lg transition-all">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-foreground/5 rounded-lg transition-all">
                      <Info className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-foreground/5 rounded-lg transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  <AnimatePresence>
                    {currentMessages.map((message, index) => {
                      const showDate =
                        index === 0 ||
                        new Date(currentMessages[index - 1].timestamp).toDateString() !==
                          new Date(message.timestamp).toDateString();

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="flex items-center justify-center my-4">
                              <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                                {new Date(message.timestamp).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`flex items-end gap-2 max-w-[70%] ${
                                message.isSent ? 'flex-row-reverse' : 'flex-row'
                              }`}
                            >
                              {!message.isSent && (
                                <img
                                  src={selectedConv.avatar}
                                  alt={selectedConv.name}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                              )}
                              <div>
                                <div
                                  className={`px-4 py-2 rounded-2xl ${
                                    message.isSent
                                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm shadow-md'
                                      : 'bg-card border border-border text-foreground rounded-bl-sm'
                                  }`}
                                >
                                  <p className="text-sm">{message.text}</p>
                                </div>
                                <div
                                  className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                                    message.isSent ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  <span>{formatMessageTime(message.timestamp)}</span>
                                  {message.isSent && (
                                    <span>
                                      {message.status === 'sending' && <Check className="w-3 h-3" />}
                                      {message.status === 'sent' && <Check className="w-3 h-3" />}
                                      {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                                      {message.status === 'read' && (
                                        <CheckCheck className="w-3 h-3 text-blue-500" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-2"
                    >
                      <img
                        src={selectedConv.avatar}
                        alt={selectedConv.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="px-4 py-3 bg-muted rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
                          <span
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: '0.4s' }}
                          ></span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Scroll to Bottom Button */}
                <AnimatePresence>
                  {showScrollButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      onClick={scrollToBottom}
                      className="absolute bottom-24 right-8 p-3 bg-primary text-white rounded-full shadow-lg hover:opacity-90 transition-all"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-end gap-2">
                    <button className="p-2 hover:bg-foreground/5 rounded-lg transition-all">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-foreground/5 rounded-lg transition-all">
                      <Smile className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
                      />
                      <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        Press Enter to send
                      </span>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="p-3 bg-primary text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-6">
                  <MessageCircle className="w-16 h-16 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Select a conversation</h2>
                <p className="text-muted-foreground max-w-md">
                  Choose a conversation from the list to start messaging with your mentors and mentees
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
