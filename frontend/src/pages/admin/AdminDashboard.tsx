import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  UserCheck,
  FileText,
  Briefcase,
  BarChart3,
  Settings,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data
const userGrowthData = [
  { month: 'Jan', students: 120, alumni: 45 },
  { month: 'Feb', students: 180, alumni: 62 },
  { month: 'Mar', students: 250, alumni: 85 },
  { month: 'Apr', students: 320, alumni: 110 },
  { month: 'May', students: 410, alumni: 145 },
  { month: 'Jun', students: 520, alumni: 180 },
];

const engagementData = [
  { day: 'Mon', messages: 245, posts: 32, events: 5 },
  { day: 'Tue', messages: 312, posts: 45, events: 8 },
  { day: 'Wed', messages: 289, posts: 38, events: 6 },
  { day: 'Thu', messages: 356, posts: 52, events: 10 },
  { day: 'Fri', messages: 401, posts: 61, events: 12 },
  { day: 'Sat', messages: 278, posts: 35, events: 7 },
  { day: 'Sun', messages: 198, posts: 28, events: 4 },
];

const categoryData = [
  { name: 'Career Advice', value: 340, color: '#3b82f6' },
  { name: 'Technical Help', value: 280, color: '#10b981' },
  { name: 'Opportunities', value: 210, color: '#8b5cf6' },
  { name: 'Events', value: 150, color: '#f59e0b' },
  { name: 'General', value: 120, color: '#6b7280' },
];

const recentActivity = [
  {
    id: 1,
    type: 'user',
    message: 'New student registered: Alex Kumar',
    time: '2 minutes ago',
    icon: Users,
  },
  {
    id: 2,
    type: 'mentorship',
    message: 'Mentorship connection: Sarah Johnson → Priya Sharma',
    time: '15 minutes ago',
    icon: UserCheck,
  },
  {
    id: 3,
    type: 'post',
    message: 'New post in Career Advice: "How to prepare for interviews"',
    time: '32 minutes ago',
    icon: MessageSquare,
  },
  {
    id: 4,
    type: 'event',
    message: 'New event created: Web Development Workshop',
    time: '1 hour ago',
    icon: Calendar,
  },
];

const adminMenuItems = [
  { name: 'Dashboard', icon: BarChart3, path: '/admin' },
  { name: 'Users', icon: Users, path: '/admin/users' },
  { name: 'Mentorships', icon: UserCheck, path: '/admin/mentorships' },
  { name: 'Moderation', icon: Shield, path: '/admin/moderation' },
  { name: 'Events', icon: Calendar, path: '/admin/events' },
  { name: 'Opportunities', icon: Briefcase, path: '/admin/opportunities' },
  { name: 'Analytics', icon: Activity, path: '/admin/analytics' },
  { name: 'Reports', icon: FileText, path: '/admin/reports' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

export const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const metrics = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Mentorships',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: UserCheck,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Forum Posts',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Events This Month',
      value: '24',
      change: '-3.1%',
      trend: 'down',
      icon: Calendar,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } border-r border-border transition-all duration-300 flex flex-col bg-background`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="font-bold">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-foreground/5 ${
                      item.name === 'Dashboard' ? 'bg-primary text-white' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Last updated: Just now</span>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all">
                Export Report
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                const TrendIcon = metric.trend === 'up' ? ArrowUp : ArrowDown;
                return (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-6 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm font-medium ${
                          metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        <TrendIcon className="w-4 h-4" />
                        {metric.change}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass p-6 rounded-xl"
              >
                <h2 className="text-lg font-bold mb-4">User Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="alumni" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Engagement Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass p-6 rounded-xl"
              >
                <h2 className="text-lg font-bold mb-4">Weekly Engagement</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="messages" fill="#3b82f6" />
                    <Bar dataKey="posts" fill="#10b981" />
                    <Bar dataKey="events" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass p-6 rounded-xl"
              >
                <h2 className="text-lg font-bold mb-4">Popular Categories</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="lg:col-span-2 glass p-6 rounded-xl"
              >
                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-foreground/5 transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{activity.message}</p>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Quick Stats Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass p-6 rounded-xl"
            >
              <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Most Active User</h3>
                  <p className="font-semibold">Alex Kumar</p>
                  <span className="text-xs text-muted-foreground">245 interactions</span>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Top Contributor</h3>
                  <p className="font-semibold">Dr. Sarah Johnson</p>
                  <span className="text-xs text-muted-foreground">89 posts</span>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular Event</h3>
                  <p className="font-semibold">Web Dev Workshop</p>
                  <span className="text-xs text-muted-foreground">120 attendees</span>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Trending Topic</h3>
                  <p className="font-semibold">#GoogleInterviews</p>
                  <span className="text-xs text-muted-foreground">156 mentions</span>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};
