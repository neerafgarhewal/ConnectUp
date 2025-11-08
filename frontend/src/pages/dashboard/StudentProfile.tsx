import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Linkedin,
  Github,
  Globe,
  MessageCircle,
  MoreVertical,
  Edit,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Star,
  CheckCircle,
  GraduationCap,
  Target,
  Trophy,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';

// Mock profile data
const mockProfile = {
  coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  name: 'Alex Kumar',
  role: 'Student at IIT Ropar',
  location: 'Rupnagar, Punjab',
  online: true,
  verified: true,
  bio: 'Passionate computer science student interested in machine learning and web development. Looking to connect with industry professionals and learn from their experiences. Open to internship opportunities in tech.',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/alexkumar',
    github: 'https://github.com/alexkumar',
    portfolio: 'https://alexkumar.dev',
  },
  stats: {
    connections: 156,
    mentorships: 3,
    posts: 24,
    events: 8,
  },
  academic: {
    university: 'IIT Ropar',
    degree: 'B.Tech',
    branch: 'Computer Science',
    year: '3rd Year',
    graduation: '2026',
    cgpa: '8.5',
  },
  skills: [
    { name: 'Python', endorsements: 12, category: 'Programming' },
    { name: 'React', endorsements: 8, category: 'Frontend' },
    { name: 'Machine Learning', endorsements: 6, category: 'AI/ML' },
    { name: 'Node.js', endorsements: 5, category: 'Backend' },
    { name: 'SQL', endorsements: 7, category: 'Database' },
    { name: 'Git', endorsements: 10, category: 'Tools' },
  ],
  interests: {
    career: ['Software Development', 'Data Science', 'Product Management'],
    companies: ['Google', 'Microsoft', 'Amazon'],
    industries: ['Technology', 'FinTech', 'AI'],
  },
  achievements: [
    {
      title: 'Smart India Hackathon Winner',
      date: 'Aug 2024',
      description: 'Won 1st place in national hackathon with AI-based solution',
      icon: Trophy,
    },
    {
      title: 'AWS Certified Developer',
      date: 'Jun 2024',
      description: 'Achieved AWS Developer Associate certification',
      icon: Award,
    },
    {
      title: 'Google Code Jam Finalist',
      date: 'Apr 2024',
      description: 'Reached finals in competitive programming competition',
      icon: Trophy,
    },
  ],
  reviews: [
    {
      reviewer: {
        name: 'Dr. Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        role: 'Senior Engineer at Google',
      },
      rating: 5,
      comment: 'Alex is a dedicated student with great potential. Very eager to learn and apply new concepts.',
      date: '2 weeks ago',
    },
    {
      reviewer: {
        name: 'Michael Chen',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: 'Product Manager at Microsoft',
      },
      rating: 5,
      comment: 'Excellent communication skills and quick learner. Pleasure to mentor!',
      date: '1 month ago',
    },
  ],
};

export const StudentProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Programming: 'bg-blue-500/10 text-blue-500',
      Frontend: 'bg-purple-500/10 text-purple-500',
      Backend: 'bg-green-500/10 text-green-500',
      'AI/ML': 'bg-amber-500/10 text-amber-500',
      Database: 'bg-pink-500/10 text-pink-500',
      Tools: 'bg-cyan-500/10 text-cyan-500',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Cover & Profile Header */}
            <div className="relative">
              {/* Cover Image */}
              <div className="h-64 md:h-80 relative overflow-hidden">
                <img
                  src={mockProfile.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <button className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Change Cover
                  </button>
                )}
              </div>

              {/* Profile Info */}
              <div className="px-4 md:px-8">
                <div className="relative -mt-20 mb-4">
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background bg-background overflow-hidden">
                        <img
                          src={mockProfile.avatar}
                          alt={mockProfile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {mockProfile.online && (
                        <span className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-background rounded-full"></span>
                      )}
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:opacity-90">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Name & Actions */}
                    <div className="flex-1 pb-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl md:text-3xl font-bold">{mockProfile.name}</h1>
                            {mockProfile.verified && (
                              <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-500" />
                            )}
                          </div>
                          <p className="text-lg text-muted-foreground mb-2">{mockProfile.role}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {mockProfile.location}
                            </span>
                            <div className="flex items-center gap-2">
                              {mockProfile.socialLinks.linkedin && (
                                <a
                                  href={mockProfile.socialLinks.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
                                >
                                  <Linkedin className="w-4 h-4" />
                                </a>
                              )}
                              {mockProfile.socialLinks.github && (
                                <a
                                  href={mockProfile.socialLinks.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
                                >
                                  <Github className="w-4 h-4" />
                                </a>
                              )}
                              {mockProfile.socialLinks.portfolio && (
                                <a
                                  href={mockProfile.socialLinks.portfolio}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
                                >
                                  <Globe className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            {isEditing ? 'Save Profile' : 'Edit Profile'}
                          </button>
                          <button className="p-2 border border-border rounded-lg hover:bg-foreground/5 transition-all">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Connections', value: mockProfile.stats.connections, icon: Users },
                    { label: 'Mentorships', value: mockProfile.stats.mentorships, icon: TrendingUp },
                    { label: 'Posts', value: mockProfile.stats.posts, icon: MessageCircle },
                    { label: 'Events', value: mockProfile.stats.events, icon: Calendar },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="glass p-4 rounded-xl text-center">
                        <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-6 rounded-xl"
                >
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  <p className="text-muted-foreground leading-relaxed">{mockProfile.bio}</p>
                </motion.div>

                {/* Skills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass p-6 rounded-xl"
                >
                  <h2 className="text-xl font-bold mb-4">Skills & Expertise</h2>
                  <div className="flex flex-wrap gap-3">
                    {mockProfile.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className={`px-4 py-2 rounded-lg ${getCategoryColor(skill.category)} flex items-center gap-2`}
                      >
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-xs opacity-75">({skill.endorsements})</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Achievements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass p-6 rounded-xl"
                >
                  <h2 className="text-xl font-bold mb-4">Achievements</h2>
                  <div className="space-y-4">
                    {mockProfile.achievements.map((achievement, index) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={index} className="flex gap-4 p-4 border border-border rounded-lg">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                            <span className="text-xs text-muted-foreground">{achievement.date}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Reviews */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass p-6 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Reviews</h2>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <span className="font-semibold">5.0</span>
                      <span className="text-sm text-muted-foreground">({mockProfile.reviews.length})</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {mockProfile.reviews.map((review, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <img
                            src={review.reviewer.avatar}
                            alt={review.reviewer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{review.reviewer.name}</h4>
                            <p className="text-sm text-muted-foreground">{review.reviewer.role}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Academic Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-6 rounded-xl"
                >
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Academic Info
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">University</span>
                      <p className="font-medium">{mockProfile.academic.university}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Degree</span>
                      <p className="font-medium">{mockProfile.academic.degree} in {mockProfile.academic.branch}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Year</span>
                      <p className="font-medium">{mockProfile.academic.year}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Graduation</span>
                      <p className="font-medium">{mockProfile.academic.graduation}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CGPA</span>
                      <p className="font-medium">{mockProfile.academic.cgpa}/10.0</p>
                    </div>
                  </div>
                </motion.div>

                {/* Interests & Goals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass p-6 rounded-xl"
                >
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Interests & Goals
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Career Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {mockProfile.interests.career.map((interest) => (
                          <span key={interest} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Target Companies</h3>
                      <div className="flex flex-wrap gap-2">
                        {mockProfile.interests.companies.map((company) => (
                          <span key={company} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Profile Completion */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass p-6 rounded-xl"
                >
                  <h2 className="text-lg font-bold mb-4">Profile Strength</h2>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Completion</span>
                      <span className="text-sm font-semibold text-primary">85%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary w-[85%]"></div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add more skills and achievements to reach 100%
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
