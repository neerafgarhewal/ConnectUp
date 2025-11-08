import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  BookOpen,
  ArrowRight,
  UserCheck,
  Target,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { authAPI, dashboardAPI } from '../../services/api';
import { CreatePost } from '../../components/dashboard/CreatePost';
import { CommunityFeed } from '../../components/dashboard/CommunityFeed';

const quickActions = [
  {
    title: 'My Profile',
    description: 'View and edit your profile',
    icon: UserCheck,
    link: '/dashboard/my-profile',
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20',
  },
  {
    title: 'Browse Profiles',
    description: 'Discover students and alumni',
    icon: Users,
    link: '/dashboard/browse-profiles',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Find Mentors',
    description: 'Connect with experienced alumni',
    icon: Target,
    link: '/dashboard/find-mentors',
    color: 'from-violet-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20',
  },
  {
    title: 'Messages',
    description: 'Chat with your connections',
    icon: MessageSquare,
    link: '/dashboard/messages',
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
  },
  {
    title: 'Events',
    description: 'Discover upcoming events',
    icon: Calendar,
    link: '/dashboard/events',
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
  },
  {
    title: 'Forum',
    description: 'Join discussions',
    icon: BookOpen,
    link: '/dashboard/forum',
    color: 'from-indigo-500 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
  },
];

// Stats interface
interface DashboardStats {
  connections: number;
  totalProfiles: number;
  skills: number;
  interests: number;
}

export const DashboardHome = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    connections: 0,
    totalProfiles: 0,
    skills: 0,
    interests: 0,
  });
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [postFilter, setPostFilter] = useState('all');
  const [feedKey, setFeedKey] = useState(0);

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...');
      console.log('Token:', localStorage.getItem('token')?.substring(0, 20) + '...');
      console.log('User:', localStorage.getItem('user'));
      
      // Load stats and profiles in parallel
      const [statsData, profilesData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecommended(8),
      ]);

      console.log('Stats data received:', statsData);
      console.log('Profiles data received:', profilesData);

      // Update stats
      if (statsData.data?.stats) {
        setStats(statsData.data.stats);
      }
      setLoadingStats(false);

      // Update profiles
      if (profilesData.data?.profiles) {
        setFeaturedProfiles(profilesData.data.profiles);
      }
      setLoadingProfiles(false);
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setLoadingStats(false);
      setLoadingProfiles(false);
    }
  };


  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:pl-12 md:pr-6 lg:pl-12 lg:pr-8">
          <div className="max-w-[1400px] mx-auto">
          {/* Animated Background */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Banner with Ocean Blue Gradient */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome back, {currentUser?.firstName || 'User'}! 👋
                </h1>
              </div>
              <p className="text-blue-100 flex items-center gap-2">
                Here's what's happening with your mentorship journey today.
              </p>
            </motion.div>

            {/* Stats Grid - Real Data from API */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Connections', value: stats.connections, icon: Users, color: 'bg-blue-500' },
                { label: 'Total Profiles', value: stats.totalProfiles, icon: MessageSquare, color: 'bg-success' },
                { label: 'Skills', value: stats.skills, icon: Calendar, color: 'bg-purple-500' },
                { label: 'Interests', value: stats.interests, icon: TrendingUp, color: 'bg-warning' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.button
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      // Navigate based on stat type
                      if (stat.label === 'Connections') navigate('/dashboard/browse-profiles');
                      else if (stat.label === 'Total Profiles') navigate('/dashboard/browse-profiles');
                      else if (stat.label === 'Skills') navigate('/dashboard/my-profile');
                      else if (stat.label === 'Interests') navigate('/dashboard/my-profile');
                    }}
                    className="w-full bg-surface rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:scale-105 hover:border-primary transition-all cursor-pointer text-left"
                  >
                    {loadingStats ? (
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                          <Icon size={24} />
                        </div>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={action.link}
                      className={`relative glass p-6 rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 group block overflow-hidden ${action.gradient}`}
                    >
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg`}>
                        <action.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                      <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Community Feed Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Community Feed</h2>
                
                {/* Filter Buttons */}
                <div className="flex items-center gap-2">
                  {['all', 'mentors', 'students', 'following'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setPostFilter(filter);
                        setFeedKey(prev => prev + 1);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        postFilter === filter
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Post */}
              <div className="mb-6">
                <CreatePost onPostCreated={() => setFeedKey(prev => prev + 1)} />
              </div>

              {/* Posts Feed */}
              <CommunityFeed key={feedKey} filter={postFilter} />
            </div>

            {/* Featured Profiles Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Featured Profiles
                </h2>
                <Link
                  to="/dashboard/browse-profiles"
                  className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loadingProfiles ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass p-6 rounded-xl animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-muted"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredProfiles.map((profile, index) => (
                    <motion.div
                      key={profile._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/dashboard/profile/${profile._id}`}
                        className="glass p-6 rounded-xl hover:scale-105 hover:shadow-xl transition-all block group"
                      >
                        {/* Profile Header */}
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={profile.profilePhoto || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&size=200&background=random`}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                              {profile.firstName} {profile.lastName}
                            </h3>
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                              {profile.type === 'student' ? '🎓 Student' : '👔 Alumni'}
                            </span>
                          </div>
                        </div>

                        {/* Profile Info */}
                        <div className="space-y-2 mb-4">
                          {profile.type === 'student' ? (
                            <>
                              <p className="text-sm text-muted-foreground truncate">
                                📚 {profile.degree} in {profile.branch}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                🏛️ {profile.university}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground truncate">
                                💼 {profile.currentPosition}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                🏢 {profile.currentCompany}
                              </p>
                            </>
                          )}
                        </div>

                        {/* Interests */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(profile.type === 'student' ? profile.careerInterests : profile.mentorshipAreas)
                            ?.slice(0, 2)
                            .map((interest: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary"
                              >
                                {interest}
                              </span>
                            ))}
                        </div>

                        {/* View Profile Button */}
                        <button className="w-full py-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-all font-medium flex items-center justify-center gap-2">
                          View Profile
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {!loadingProfiles && featuredProfiles.length === 0 && (
                <div className="glass p-12 rounded-xl text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Profiles Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to register and connect with others!
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
                  >
                    Invite Friends
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};
