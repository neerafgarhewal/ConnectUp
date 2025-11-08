import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MapPin,
  Linkedin,
  Github,
  Globe,
  MessageCircle,
  MoreVertical,
  TrendingUp,
  Users,
  Calendar,
  Star,
  CheckCircle,
  GraduationCap,
  Target,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { studentAPI, alumniAPI } from '../../services/api';


export const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log('Fetching profile for ID:', id);
        
        // Try student API first
        try {
          const response = await studentAPI.getProfile(id!);
          console.log('Student profile data received:', response.data);
          setProfile({ ...response.data.student, userType: 'student' });
          return;
        } catch (studentError: any) {
          console.log('Not a student, trying alumni API...');
          
          // If student fails, try alumni API
          try {
            const response = await alumniAPI.getProfile(id!);
            console.log('Alumni profile data received:', response.data);
            setProfile({ ...response.data.alumni, userType: 'alumni' });
            return;
          } catch (alumniError: any) {
            console.error('Profile not found in either API:', { studentError, alumniError });
            toast.error('Profile not found');
            setProfile(null);
          }
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      // Reset profile when ID changes
      setProfile(null);
      fetchProfile();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Found</h3>
              <p className="text-gray-600 mb-6">This profile doesn't exist or has been removed.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                  src={profile.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200'}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Profile Info */}
              <div className="px-4 md:px-8">
                <div className="relative -mt-20 mb-4">
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background bg-gradient-to-br from-primary to-secondary overflow-hidden flex items-center justify-center text-white text-4xl font-bold">
                        {profile.profilePhoto ? (
                          <img
                            src={profile.profilePhoto}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{profile.firstName?.[0]}{profile.lastName?.[0]}</span>
                        )}
                      </div>
                      {profile.online && (
                        <span className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-background rounded-full"></span>
                      )}
                    </div>

                    {/* Name & Actions */}
                    <div className="flex-1 pb-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold">
                              {profile.firstName} {profile.lastName}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              profile.userType === 'student' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {profile.userType === 'student' ? '🎓 Student' : '👔 Alumni'}
                            </span>
                            {profile.verified && (
                              <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-500" />
                            )}
                          </div>
                          <p className="text-lg text-muted-foreground mb-2">
                            {profile.userType === 'student' 
                              ? `${profile.degree || 'Undergraduate'} ${profile.branch ? `in ${profile.branch}` : ''}`
                              : `${profile.currentPosition || 'Professional'} ${profile.currentCompany ? `at ${profile.currentCompany}` : ''}`
                            }
                          </p>
                          {profile.university && (
                            <p className="text-md text-muted-foreground flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" />
                              {profile.university}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {profile.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {profile.location}
                              </span>
                            )}
                            {profile.socialLinks && (
                              <div className="flex items-center gap-2">
                              {profile.socialLinks?.linkedin && (
                                <a
                                  href={profile.socialLinks.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
                                >
                                  <Linkedin className="w-4 h-4" />
                                </a>
                              )}
                              {profile.socialLinks.github && (
                                <a
                                  href={profile.socialLinks.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
                                >
                                  <Github className="w-4 h-4" />
                                </a>
                              )}
                              {profile.socialLinks.portfolio && (
                                <a
                                  href={profile.socialLinks.portfolio}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 hover:bg-foreground/5 rounded-lg transition-all"
                                >
                                  <Globe className="w-4 h-4" />
                                </a>
                              )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/messages?userId=${id}`)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Message
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
                    { label: 'Connections', value: profile.stats?.connections || 0, icon: Users },
                    { label: 'Mentorships', value: profile.stats?.mentorships || 0, icon: TrendingUp },
                    { label: 'Posts', value: profile.stats?.posts || 0, icon: MessageCircle },
                    { label: 'Events', value: profile.stats?.events || 0, icon: Calendar },
                  ].map((stat: any) => {
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
                  <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
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
                    {profile.skills?.map((skill: any) => (
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
                    {profile.achievements?.map((achievement: any, index: number) => {
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
                      <span className="text-sm text-muted-foreground">({profile.reviews?.length || 0})</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {profile.reviews?.map((review: any, index: number) => (
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
                      <p className="font-medium">{profile.academic?.university || profile.university || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Degree</span>
                      <p className="font-medium">{profile.academic?.degree || profile.degree || 'Not specified'} {profile.academic?.branch || profile.branch ? `in ${profile.academic?.branch || profile.branch}` : ''}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Year</span>
                      <p className="font-medium">{profile.academic?.year || profile.year || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Graduation</span>
                      <p className="font-medium">{profile.academic?.graduation || profile.graduationYear || 'Not specified'}</p>
                    </div>
                    {(profile.academic?.cgpa || profile.cgpa) && (
                      <div>
                        <span className="text-muted-foreground">CGPA</span>
                        <p className="font-medium">{profile.academic?.cgpa || profile.cgpa}/10.0</p>
                      </div>
                    )}
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
                        {profile.interests?.career?.map((interest: any) => (
                          <span key={interest} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Target Companies</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests?.companies?.map((company: any) => (
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
