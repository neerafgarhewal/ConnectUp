import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  Plus,
  MoreVertical,
  Check,
  CheckCheck,
  MessageCircle,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { messagingAPI, authAPI, studentAPI, alumniAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../hooks/useSocket';

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    profilePhoto?: string;
    title?: string;
    subtitle?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isOwnMessage: boolean;
  } | null;
  unreadCount: number;
  lastMessageTime: string;
}

interface Message {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
  };
  content: string;
  createdAt: string;
  read: boolean;
  delivered: boolean;
}

export const MessagesPageNew = () => {
  const { socket } = useSocket();
  const currentUser = authAPI.getCurrentUser();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'mentors' | 'students' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [view, setView] = useState<'conversations' | 'users'>('users'); // Default to users view
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations and users
  useEffect(() => {
    loadConversations();
    loadAllUsers();
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('message:new', (data: { conversationId: string; message: Message }) => {
      if (selectedConversation?.id === data.conversationId) {
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
        
        // Mark as read
        messagingAPI.markAsRead(data.conversationId, [data.message._id]);
      }
      
      // Update conversation list
      loadConversations();
    });

    return () => {
      socket.off('message:new');
    };
  }, [socket, selectedConversation]);

  const loadConversations = async () => {
    try {
      const response = await messagingAPI.getConversations();
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    }
  };

  const loadAllUsers = async () => {
    try {
      setLoading(true);
      // Load both students and alumni
      const [studentsResponse, alumniResponse] = await Promise.all([
        studentAPI.getAllStudents(),
        alumniAPI.getAllAlumni()
      ]);

      const students = studentsResponse.data.students.map((s: any) => ({
        ...s,
        type: 'student',
        name: `${s.firstName} ${s.lastName}`
      }));
      
      const alumni = alumniResponse.data.alumni.map((a: any) => ({
        ...a,
        type: 'alumni',
        name: `${a.firstName} ${a.lastName}`
      }));

      // Combine and filter out current user
      let allUsersList = [...students, ...alumni];
      allUsersList = allUsersList.filter(u => u._id !== currentUser?._id);
      
      setAllUsers(allUsersList);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const response = await messagingAPI.getMessages(conversationId);
      setMessages(response.data.messages);
      
      // Mark unread messages as read
      const unreadIds = response.data.messages
        .filter((m: Message) => !m.read && m.sender._id !== currentUser?._id)
        .map((m: Message) => m._id);
      
      if (unreadIds.length > 0) {
        await messagingAPI.markAsRead(conversationId, unreadIds);
        loadConversations(); // Refresh to update unread counts
      }
      
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
    loadMessages(conversation.id);
    
    // Join conversation room via socket
    if (socket) {
      socket.emit('conversation:join', conversation.id);
    }
  };

  const handleSelectUser = async (user: any) => {
    try {
      // Get or create conversation with this user
      const response = await messagingAPI.getOrCreateConversation(user._id);
      const conversation = response.data.conversation;
      
      // Format conversation
      const formattedConv: Conversation = {
        id: conversation._id,
        participant: {
          id: user._id,
          name: user.name,
          profilePhoto: user.profilePhoto,
          title: user.currentPosition || user.degree,
          subtitle: user.currentCompany || user.university
        },
        lastMessage: null,
        unreadCount: 0,
        lastMessageTime: new Date().toISOString()
      };
      
      setSelectedConversation(formattedConv);
      setShowMobileChat(true);
      setView('conversations');
      
      // Load messages if conversation exists
      if (conversation.lastMessage) {
        loadMessages(conversation._id);
      } else {
        setMessages([]);
      }
      
      // Join conversation room
      if (socket) {
        socket.emit('conversation:join', conversation._id);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !selectedConversation || sending) return;

    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      conversation: selectedConversation.id,
      sender: {
        _id: currentUser?._id || '',
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        profilePhoto: currentUser?.profilePhoto,
      },
      content: messageText.trim(),
      createdAt: new Date().toISOString(),
      read: false,
      delivered: false,
    };

    setMessages(prev => [...prev, tempMessage]);
    setMessageText('');
    scrollToBottom();

    try {
      setSending(true);
      const response = await messagingAPI.sendMessage(selectedConversation.id, {
        content: messageText.trim(),
      });

      // Replace temp message with real one
      setMessages(prev =>
        prev.map(m => (m._id === tempMessage._id ? response.data.message : m))
      );

      // Emit via socket for real-time delivery
      if (socket) {
        socket.emit('message:send', {
          conversationId: selectedConversation.id,
          message: response.data.message,
          recipientId: selectedConversation.participant.id,
        });
      }

      loadConversations(); // Update conversation list
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(conv => {
    // Search filter
    if (searchQuery && !conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filter === 'unread' && conv.unreadCount === 0) return false;
    // Add more filters as needed
    
    return true;
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col bg-[#F9FAFB] border-r border-gray-200`}>
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Link to="/dashboard" className="md:hidden">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                  </Link>
                  <h2 className="text-xl font-bold">Messages</h2>
                </div>
                <Link
                  to="/dashboard/browse-profiles"
                  className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </Link>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 mt-3 mb-3">
                <button
                  onClick={() => setView('users')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    view === 'users'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => setView('conversations')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    view === 'conversations'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Chats
                </button>
              </div>

              {/* Filters - Only show for conversations view */}
              {view === 'conversations' && (
                <div className="flex gap-2">
                  {(['all', 'unread'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filter === f
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Conversations or Users List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : view === 'users' ? (
                // Show all users
                allUsers.filter(u => 
                  !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold mb-2">No users found</h3>
                    <p className="text-gray-600 text-sm">
                      Try adjusting your search
                    </p>
                  </div>
                ) : (
                  allUsers
                    .filter(u => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((user) => (
                      <button
                        key={user._id}
                        onClick={() => handleSelectUser(user)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-white transition-all"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {user.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            user.name[0].toUpperCase()
                          )}
                        </div>

                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="font-semibold text-foreground truncate">
                            {user.name}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            {user.type === 'student' ? '🎓 Student' : '👔 Alumni'} • {user.university || user.currentCompany}
                          </p>
                        </div>
                      </button>
                    ))
                )
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Start a conversation with a mentor or student
                  </p>
                  <Link
                    to="/dashboard/browse-profiles"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
                  >
                    Start Conversation
                  </Link>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-white transition-all border-l-4 ${
                      selectedConversation?.id === conv.id
                        ? 'bg-white border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                        {conv.participant.profilePhoto ? (
                          <img
                            src={conv.participant.profilePhoto}
                            alt={conv.participant.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          conv.participant.name[0].toUpperCase()
                        )}
                      </div>
                      {/* Online indicator - placeholder for now */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground truncate">
                          {conv.participant.name}
                        </h4>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {conv.lastMessage && formatTimestamp(conv.lastMessage.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="flex-shrink-0 ml-2 w-5 h-5 bg-[#EF4444] text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedConversation.participant.profilePhoto ? (
                        <img
                          src={selectedConversation.participant.profilePhoto}
                          alt={selectedConversation.participant.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        selectedConversation.participant.name[0].toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.participant.name}</h3>
                      <p className="text-sm text-gray-600">{selectedConversation.participant.title}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-600">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwnMessage = message.sender._id === currentUser?._id;
                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isOwnMessage
                                  ? 'bg-primary text-white rounded-br-sm'
                                  : 'bg-gray-100 text-foreground rounded-bl-sm'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{message.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                              <span>{formatMessageTime(message.createdAt)}</span>
                              {isOwnMessage && (
                                message.read ? (
                                  <CheckCheck className="w-4 h-4 text-blue-500" />
                                ) : message.delivered ? (
                                  <CheckCheck className="w-4 h-4" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim() || sending}
                      className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="text-8xl mb-6">💬</div>
                <h3 className="text-2xl font-bold mb-2">Select a conversation</h3>
                <p className="text-gray-600">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
