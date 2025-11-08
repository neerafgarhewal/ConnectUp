import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  Calendar,
  Briefcase,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  UserCheck,
  Bell,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { authAPI, studentAPI, alumniAPI } from '../../services/api';

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

const stats = [
  { label: 'Connections', value: '12', icon: Users, color: 'text-blue-500' },
  { label: 'Messages', value: '24', icon: MessageSquare, color: 'text-green-500' },
  { label: 'Events Attended', value: '8', icon: Calendar, color: 'text-purple-500' },
  { label: 'Profile Views', value: '156', icon: TrendingUp, color: 'text-amber-500' },
];

const recentActivity = [
  {
    id: 1,
    type: 'message',
    text: 'New message from Dr. Sarah Johnson',
    time: '5 minutes ago',
    icon: MessageSquare,
  },
  {
    id: 2,
    type: 'event',
    text: 'Web Development Workshop starts in 1 hour',
    time: '1 hour ago',
    icon: Calendar,
  },
  {
    id: 3,
    type: 'connection',
    text: 'Alex Kumar accepted your mentorship request',
    time: '2 hours ago',
    icon: UserCheck,
  },
  {
    id: 4,
    type: 'achievement',
    text: 'You earned the "Active Learner" badge',
    time: '1 day ago',
    icon: Award,
  },
];

export const DashboardHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
    loadFeaturedProfiles();
  }, []);

  const loadFeaturedProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const currentUser = authAPI.getCurrentUser();
      
      // Load both students and alumni
      const [studentsResponse, alumniResponse] = await Promise.all([
        studentAPI.getAllStudents(),
        alumniAPI.getAllAlumni()
      ]);

      const students = studentsResponse.data.students.map((s: any) => ({ ...s, type: 'student' }));
      const alumni = alumniResponse.data.alumni.map((a: any) => ({ ...a, type: 'alumni' }));
      
      // Combine and filter out current user
      let allProfiles = [...students, ...alumni];
      allProfiles = allProfiles.filter(p => p._id !== currentUser?._id);
      
      // Get random 6 profiles
      const shuffled = allProfiles.sort(() => 0.5 - Math.random());
      setFeaturedProfiles(shuffled.slice(0, 6));
      
      setLoadingProfiles(false);
    } catch (error) {
      console.error('Error loading profiles:', error);
      setLoadingProfiles(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* Animated Background */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Header with Sparkles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                  Welcome Back, {currentUser?.firstName || 'User'}! 
                </h1>
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Here's what's happening with your mentorship journey
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                <div className="glass rounded-xl p-6 space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-foreground/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{activity.text}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Upcoming</h2>
                <div className="glass rounded-xl p-6 space-y-4">
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="text-sm font-medium text-primary">Today, 3:00 PM</p>
                    </div>
                    <p className="font-bold mb-1">Web Dev Workshop</p>
                    <p className="text-sm text-muted-foreground">Online Event</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-4 h-4 text-amber-500" />
                      <p className="text-sm font-medium text-amber-500">Tomorrow, 10:00 AM</p>
                    </div>
                    <p className="font-bold mb-1">1-on-1 with Mentor</p>
                    <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
                  </div>
                  <Link
                    to="/dashboard/events"
                    className="block text-center py-2 text-primary hover:underline text-sm font-medium"
                  >
                    View all events →
                  </Link>
                </div>
              </div>
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
        </main>
      </div>
    </div>
  );
};
