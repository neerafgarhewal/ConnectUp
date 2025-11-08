import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Clock,
  CheckCircle,
  TrendingUp,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { authAPI } from '../../services/api';

// Mock data
const stats = [
  {
    title: 'Applications Sent',
    value: 24,
    icon: Briefcase,
    trend: { value: 12, isPositive: true },
    color: 'bg-blue-500',
  },
  {
    title: 'Interviews Scheduled',
    value: 5,
    icon: Clock,
    trend: { value: 8, isPositive: true },
    color: 'bg-amber-500',
  },
  {
    title: 'Offers Received',
    value: 2,
    icon: CheckCircle,
    color: 'bg-green-500',
  },
  {
    title: 'Profile Views',
    value: 847,
    icon: TrendingUp,
    trend: { value: 23, isPositive: true },
    color: 'bg-purple-500',
  },
];

const recentApplications = [
  {
    company: 'Google',
    position: 'Software Engineer',
    status: 'Interview',
    statusColor: 'bg-amber-100 text-amber-700',
    date: '2 days ago',
  },
  {
    company: 'Microsoft',
    position: 'Product Manager',
    status: 'Applied',
    statusColor: 'bg-blue-100 text-blue-700',
    date: '5 days ago',
  },
  {
    company: 'Amazon',
    position: 'Data Scientist',
    status: 'Rejected',
    statusColor: 'bg-red-100 text-red-700',
    date: '1 week ago',
  },
  {
    company: 'Meta',
    position: 'Frontend Developer',
    status: 'Offer',
    statusColor: 'bg-green-100 text-green-700',
    date: '3 days ago',
  },
];

const recommendedJobs = [
  {
    emoji: '🚀',
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $180k',
  },
  {
    emoji: '💼',
    title: 'Product Designer',
    company: 'DesignHub',
    location: 'Remote',
    salary: '$90k - $130k',
  },
  {
    emoji: '⚡',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    salary: '$100k - $150k',
  },
  {
    emoji: '🎯',
    title: 'Marketing Manager',
    company: 'GrowthCo',
    location: 'Austin, TX',
    salary: '$80k - $120k',
  },
];

export const ModernDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const user = authAPI.getCurrentUser();
  const userName = user?.firstName || user?.fullName?.split(' ')[0] || 'User';

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-surface border-r border-gray-200 flex flex-col relative"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"
            >
              ConnectUp
            </motion.h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: '📊', label: 'Dashboard', active: true },
            { icon: '💼', label: 'Jobs', active: false },
            { icon: '📝', label: 'Applications', active: false },
            { icon: '👤', label: 'Profile', active: false },
            { icon: '⚙️', label: 'Settings', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                ${item.active 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              authAPI.logout();
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="text-xl flex-shrink-0">🚪</span>
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 bg-surface border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or people..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
                {userName[0].toUpperCase()}
              </div>
              <span className="font-medium text-foreground">{userName}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white"
            >
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-blue-100">
                Here's what's happening with your job search today.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        {stat.trend && (
                          <div className="flex items-center mt-2 text-sm text-success">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>+{stat.trend.value}%</span>
                            <span className="text-gray-500 ml-1">from last month</span>
                          </div>
                        )}
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                        <Icon size={24} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-surface rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Recent Applications
                </h2>
                <div className="space-y-4">
                  {recentApplications.map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{app.company}</h3>
                        <p className="text-sm text-gray-600">{app.position}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.statusColor}`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-gray-500">{app.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recommended Jobs */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-surface rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Recommended Jobs
                </h2>
                <div className="space-y-4">
                  {recommendedJobs.map((job, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {job.emoji}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} />
                            {job.salary}
                          </span>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
