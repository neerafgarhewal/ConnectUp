import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  UserCheck,
  MessageCircle,
  MessageSquare,
  Calendar,
  Briefcase,
  Star,
  User,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { name: 'Browse Profiles', icon: Users, path: '/dashboard/browse-profiles' },
  { name: 'My Profile', icon: User, path: '/dashboard/my-profile' },
  { name: 'Find Mentors', icon: UserCheck, path: '/dashboard/find-mentors' },
  { name: 'Messages', icon: MessageCircle, path: '/dashboard/messages', badge: 3 },
  { name: 'Forum', icon: MessageSquare, path: '/dashboard/forum' },
  { name: 'Events', icon: Calendar, path: '/dashboard/events' },
  { name: 'Opportunities', icon: Briefcase, path: '/dashboard/opportunities', badge: 5 },
  { name: 'Success Stories', icon: Star, path: '/dashboard/stories' },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                CU
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ConnectUp
              </span>
            </Link>
            <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && onClose()}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary rounded-lg -z-10"
                          transition={{ type: 'spring', duration: 0.5 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="glass p-4 rounded-lg">
              <h4 className="font-semibold mb-1">Need Help?</h4>
              <p className="text-sm text-muted-foreground mb-3">Check our documentation</p>
              <button className="w-full py-2 px-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-sm font-medium">
                Get Support
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
