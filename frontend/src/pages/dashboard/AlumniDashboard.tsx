import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageCircle,
  Calendar,
  Star,
  TrendingUp,
  CheckCircle,
  X,
  Clock,
  Video,
  MapPin,
  Edit,
  Eye,
  Plus,
  Briefcase,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';

// Mock data
const pendingRequests = [
  {
    id: 1,
    name: 'Alex Kumar',
    university: 'IIT Ropar',
    year: '3rd Year',
    branch: 'Computer Science',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    interests: ['Machine Learning', 'Web Development', 'Cloud Computing'],
    matchScore: 95,
    requestDate: '2 days ago',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    university: 'IIT Ropar',
    year: '2nd Year',
    branch: 'Electronics',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    interests: ['IoT', 'Embedded Systems', 'AI'],
    matchScore: 88,
    requestDate: '3 days ago',
  },
  {
    id: 3,
    name: 'Rahul Verma',
    university: 'IIT Ropar',
    year: '4th Year',
    branch: 'Computer Science',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    interests: ['Data Science', 'Python', 'Analytics'],
    matchScore: 92,
    requestDate: '5 days ago',
  },
];

const activeMentees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    program: 'B.Tech CSE',
    year: '3rd Year',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastInteraction: '2 days ago',
    progress: 75,
    sessionsCompleted: 8,
  },
  {
    id: 2,
    name: 'Michael Chen',
    program: 'B.Tech ECE',
    year: '2nd Year',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastInteraction: '1 week ago',
    progress: 60,
    sessionsCompleted: 5,
  },
  {
    id: 3,
    name: 'Emily Brown',
    program: 'B.Tech CSE',
    year: '4th Year',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    lastInteraction: '3 days ago',
    progress: 85,
    sessionsCompleted: 12,
  },
  {
    id: 4,
    name: 'David Kim',
    program: 'B.Tech ME',
    year: '3rd Year',
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    lastInteraction: '5 days ago',
    progress: 45,
    sessionsCompleted: 4,
  },
];

const upcomingSessions = [
  {
    id: 1,
    student: 'Sarah Johnson',
    date: 'Nov 10, 2025',
    time: '2:00 PM',
    type: 'Video Call',
    topic: 'Career Guidance',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    student: 'Michael Chen',
    date: 'Nov 12, 2025',
    time: '4:30 PM',
    type: 'Chat',
    topic: 'Resume Review',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 3,
    student: 'Emily Brown',
    date: 'Nov 15, 2025',
    time: '11:00 AM',
    type: 'In-person',
    topic: 'Interview Prep',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
];

const myEvents = [
  {
    id: 1,
    title: 'Web Development Workshop',
    date: 'Nov 20, 2025',
    registrations: 45,
    capacity: 50,
    status: 'Active',
  },
  {
    id: 2,
    title: 'Career in Tech - Panel Discussion',
    date: 'Dec 5, 2025',
    registrations: 120,
    capacity: 150,
    status: 'Active',
  },
  {
    id: 3,
    title: 'Mock Interview Session',
    date: 'Nov 25, 2025',
    registrations: 30,
    capacity: 30,
    status: 'Full',
  },
];

const postedOpportunities = [
  {
    id: 1,
    title: 'Software Engineer Intern',
    company: 'Google',
    applications: 24,
    status: 'Active',
    postedDate: '1 week ago',
  },
  {
    id: 2,
    title: 'Product Manager Intern',
    company: 'Microsoft',
    applications: 18,
    status: 'Active',
    postedDate: '3 days ago',
  },
  {
    id: 3,
    title: 'Data Analyst',
    company: 'Amazon',
    applications: 32,
    status: 'Closed',
    postedDate: '2 weeks ago',
  },
];

const recentMessages = [
  {
    id: 1,
    name: 'Sarah Johnson',
    message: 'Thank you for the session! The tips were really helpful.',
    time: '10m ago',
    unread: true,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    name: 'Michael Chen',
    message: 'Can we reschedule our meeting to next week?',
    time: '1h ago',
    unread: true,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 3,
    name: 'Emily Brown',
    message: 'I got the internship! Thank you so much!',
    time: '3h ago',
    unread: false,
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
  {
    id: 4,
    name: 'David Kim',
    message: 'Looking forward to our session tomorrow',
    time: '1d ago',
    unread: false,
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
  },
];

export const AlumniDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const impactStats = [
    { label: 'Students Mentored', value: '24', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Sessions Completed', value: '156', icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Events Hosted', value: '8', icon: Calendar, color: 'from-purple-500 to-pink-500' },
    { label: 'Average Rating', value: '4.9', icon: Star, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 md:p-8 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl -z-10" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Dr. Sarah! 👋</h1>
                    <p className="text-muted-foreground">You've helped <span className="text-primary font-semibold">12 students</span> this month</p>
                  </div>
                  
                  {/* Availability Toggle */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Status:</span>
                    <button
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        isAvailable ? 'bg-green-500' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          isAvailable ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`text-sm font-medium ${isAvailable ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {isAvailable ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Event
                  </button>
                  <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Post Opportunity
                  </button>
                  <button className="px-4 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-all flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Manage Schedule
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Impact Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {impactStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-6 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Mentorship Requests Queue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">Mentorship Requests</h2>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {pendingRequests.length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="glass p-6 rounded-xl hover:shadow-xl transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={request.avatar}
                        alt={request.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold">{request.name}</h3>
                          <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-bold">
                            {request.matchScore}% Match
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.university}</p>
                        <p className="text-sm text-muted-foreground">{request.year} • {request.branch}</p>
                        <p className="text-xs text-muted-foreground mt-1">Requested {request.requestDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {request.interests.map((interest) => (
                        <span key={interest} className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 px-4 border border-border rounded-lg hover:bg-foreground/5 transition-all flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                      <button className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                      <button className="py-2 px-4 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Active Mentees */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Active Mentees</h2>
                <span className="text-sm text-muted-foreground">{activeMentees.length} students</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeMentees.map((mentee) => (
                  <div key={mentee.id} className="glass p-6 rounded-xl hover:shadow-xl transition-all">
                    <div className="flex flex-col items-center text-center mb-4">
                      <img
                        src={mentee.avatar}
                        alt={mentee.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 mb-3"
                      />
                      <h3 className="font-semibold mb-1">{mentee.name}</h3>
                      <p className="text-sm text-muted-foreground">{mentee.program}</p>
                      <p className="text-xs text-muted-foreground">{mentee.year}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-semibold text-primary">{mentee.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${mentee.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{mentee.sessionsCompleted} sessions completed</p>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">Last interaction: {mentee.lastInteraction}</p>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 px-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-sm flex items-center justify-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        Message
                      </button>
                      <button className="flex-1 py-2 px-3 border border-border rounded-lg hover:bg-foreground/5 transition-all text-sm flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upcoming Sessions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Upcoming Sessions</h2>
                    <button className="text-sm text-primary hover:underline">View Calendar</button>
                  </div>
                  <div className="space-y-3">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-foreground/5 transition-all">
                        <img
                          src={session.avatar}
                          alt={session.student}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{session.student}</h4>
                          <p className="text-sm text-muted-foreground">{session.topic}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {session.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {session.time}
                            </span>
                            <span className="flex items-center gap-1">
                              {session.type === 'Video Call' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                              {session.type}
                            </span>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all text-sm">
                          {session.type === 'Video Call' ? 'Join' : 'Details'}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* My Events */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">My Events</h2>
                    <button className="text-sm px-3 py-1 bg-primary text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-1">
                      <Plus className="w-4 h-4" />
                      Create Event
                    </button>
                  </div>
                  <div className="space-y-3">
                    {myEvents.map((event) => (
                      <div key={event.id} className="p-4 border border-border rounded-lg hover:bg-foreground/5 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{event.title}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {event.date}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-muted-foreground">
                            {event.registrations}/{event.capacity} registered
                          </span>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 border border-border rounded-lg hover:bg-foreground/5 transition-all text-sm flex items-center gap-1">
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                            <button className="px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-sm flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                {/* Posted Opportunities */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="glass p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Posted Opportunities</h2>
                    <button className="text-xs px-2 py-1 bg-secondary text-white rounded-lg hover:opacity-90 transition-all">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {postedOpportunities.map((opp) => (
                      <div key={opp.id} className="p-3 border border-border rounded-lg hover:bg-foreground/5 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{opp.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            opp.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                          }`}>
                            {opp.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{opp.company}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{opp.applications} applications</span>
                          <button className="text-xs text-primary hover:underline flex items-center gap-1">
                            <Edit className="w-3 h-3" />
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Messages */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="glass p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Recent Messages</h2>
                    <button className="text-xs text-primary hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    {recentMessages.map((msg) => (
                      <div key={msg.id} className={`p-3 rounded-lg hover:bg-foreground/5 transition-all cursor-pointer ${
                        msg.unread ? 'bg-primary/5' : ''
                      }`}>
                        <div className="flex items-start gap-3">
                          <img
                            src={msg.avatar}
                            alt={msg.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm">{msg.name}</h4>
                              {msg.unread && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
