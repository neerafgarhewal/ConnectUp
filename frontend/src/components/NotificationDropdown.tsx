import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  Settings,
  UserCheck,
  MessageCircle,
  ThumbsUp,
  Calendar,
  Briefcase,
  Award,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'mentorship',
    title: 'New mentorship request',
    message: 'Alex Kumar wants to connect with you as a mentor',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    actions: [
      { label: 'Accept', type: 'primary' },
      { label: 'Decline', type: 'secondary' },
    ],
    link: '/dashboard/my-mentors',
  },
  {
    id: 2,
    type: 'message',
    title: 'New message',
    message: 'Dr. Sarah Johnson sent you a message',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    link: '/dashboard/messages',
  },
  {
    id: 3,
    type: 'forum',
    title: 'Post liked',
    message: 'Michael Chen liked your post "How to prepare for Google interviews"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    link: '/dashboard/forum',
  },
  {
    id: 4,
    type: 'event',
    title: 'Event reminder',
    message: 'Web Development Workshop starts in 1 hour',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
    link: '/dashboard/events',
  },
  {
    id: 5,
    type: 'opportunity',
    title: 'New opportunity',
    message: 'Software Engineer Intern at Google matches your interests',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    link: '/dashboard/opportunities',
  },
  {
    id: 6,
    type: 'system',
    title: 'Milestone achieved',
    message: 'Congratulations! You have completed 5 mentorship sessions',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    link: '/dashboard/profile',
  },
];

const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    mentorship: UserCheck,
    message: MessageCircle,
    forum: ThumbsUp,
    event: Calendar,
    opportunity: Briefcase,
    system: Award,
  };
  return icons[type] || Bell;
};

const getNotificationColor = (type: string) => {
  const colors: Record<string, string> = {
    mentorship: 'text-blue-500 bg-blue-500/10',
    message: 'text-green-500 bg-green-500/10',
    forum: 'text-purple-500 bg-purple-500/10',
    event: 'text-amber-500 bg-amber-500/10',
    opportunity: 'text-pink-500 bg-pink-500/10',
    system: 'text-cyan-500 bg-cyan-500/10',
  };
  return colors[type] || 'text-muted-foreground bg-muted';
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

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'mentions' | 'requests'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'requests') return n.type === 'mentorship' && n.actions;
    // For 'all' and 'mentions' tabs
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-96 glass rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Mark all read
                    </button>
                  )}
                  <Link
                    to="/notifications/settings"
                    className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
                    onClick={onClose}
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                {(['all', 'unread', 'mentions', 'requests'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === 'unread' && unreadCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const colorClass = getNotificationColor(notification.type);

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 border-b border-border hover:bg-foreground/5 transition-all cursor-pointer relative ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) {
                          onClose();
                        }
                      }}
                    >
                      {/* Unread Indicator */}
                      {!notification.read && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></span>
                      )}

                      <div className="flex gap-3 ml-4">
                        {/* Icon or Avatar */}
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm mb-1">
                            <span className="font-semibold">{notification.title}</span>
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.link && (
                              <Link
                                to={notification.link}
                                className="text-xs text-primary hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onClose();
                                }}
                              >
                                View
                              </Link>
                            )}
                          </div>

                          {/* Action Buttons */}
                          {notification.actions && (
                            <div className="flex gap-2 mt-3">
                              {notification.actions.map((action, idx) => (
                                <button
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle action
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    action.type === 'primary'
                                      ? 'bg-primary text-white hover:opacity-90'
                                      : 'border border-border hover:bg-foreground/5'
                                  }`}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 hover:bg-foreground/5 rounded transition-all flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border text-center">
              <Link
                to="/notifications"
                className="text-sm text-primary hover:underline"
                onClick={onClose}
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
