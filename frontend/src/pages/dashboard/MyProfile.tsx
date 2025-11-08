import { useState, useEffect } from 'react';
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
  Briefcase,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { authAPI, studentAPI, alumniAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const MyProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const user = authAPI.getCurrentUser();
      const userType = authAPI.getUserType();

      if (!user || !user._id) {
        console.error('No user found in localStorage');
        setLoading(false);
        return;
      }

      let profileData;
      if (userType === 'student') {
        const response = await studentAPI.getProfile(user._id);
        profileData = response.data.student;
      } else if (userType === 'alumni') {
        const response = await alumniAPI.getProfile(user._id);
        profileData = response.data.alumni;
      }

      setUserData(profileData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading profile...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-xl font-bold mb-2">No Profile Found</p>
                <p className="text-muted-foreground">Please complete your registration</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const userType = authAPI.getUserType();
  const isStudent = userType === 'student';

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          {/* Cover Image */}
          <div className="relative h-64 bg-gradient-to-r from-primary to-secondary">
            <img
              src={userData.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200'}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {/* Back to Dashboard Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="absolute top-4 left-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-all flex items-center gap-2 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            {/* Edit Cover Button */}
            <button className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-all">
              <Edit className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 -mt-20 relative z-10">
            {/* Profile Header */}
            <div className="glass rounded-2xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Photo */}
                <div className="relative">
                  <img
                    src={userData.profilePhoto || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&size=200&background=random`}
                    alt={userData.fullName || `${userData.firstName} ${userData.lastName}`}
                    className="w-32 h-32 rounded-full border-4 border-background object-cover"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full hover:opacity-90 transition-all">
                    <Edit className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {userData.firstName} {userData.lastName}
                      </h1>
                      {isStudent ? (
                        <p className="text-lg text-muted-foreground mb-2">
                          {userData.degree} in {userData.branch} • {userData.year}
                        </p>
                      ) : (
                        <p className="text-lg text-muted-foreground mb-2">
                          {userData.currentPosition} at {userData.currentCompany}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {userData.university}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {isStudent ? `Graduating ${userData.expectedGraduation}` : `Graduated ${userData.graduationYear}`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-all flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    {userData.linkedinUrl && (
                      <a
                        href={userData.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-border rounded-lg hover:bg-foreground/5 transition-all"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {userData.githubUrl && (
                      <a
                        href={userData.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-border rounded-lg hover:bg-foreground/5 transition-all"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {userData.portfolioUrl && (
                      <a
                        href={userData.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-border rounded-lg hover:bg-foreground/5 transition-all"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-4 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">{isStudent ? userData.mentors?.length || 0 : userData.mentees?.length || 0}</p>
                <p className="text-sm text-muted-foreground">{isStudent ? 'Mentors' : 'Mentees'}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-4 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-2xl font-bold">{userData.profileViews || 0}</p>
                <p className="text-sm text-muted-foreground">Profile Views</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-4 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-2xl font-bold">{isStudent ? userData.connections?.length || 0 : userData.completedSessions || 0}</p>
                <p className="text-sm text-muted-foreground">{isStudent ? 'Connections' : 'Sessions'}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-4 rounded-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-8 h-8 text-amber-500" />
                </div>
                <p className="text-2xl font-bold">{isStudent ? userData.cgpa || 'N/A' : userData.rating?.toFixed(1) || '0.0'}</p>
                <p className="text-sm text-muted-foreground">{isStudent ? 'CGPA' : 'Rating'}</p>
              </motion.div>
            </div>

            {/* About Section */}
            <div className="glass p-6 rounded-xl mb-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">{userData.bio}</p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Academic/Professional Info */}
              <div className="glass p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  {isStudent ? 'Academic Information' : 'Professional Information'}
                </h2>
                <div className="space-y-3">
                  {isStudent ? (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">University</p>
                        <p className="font-medium">{userData.university}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Degree & Branch</p>
                        <p className="font-medium">{userData.degree} in {userData.branch}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Year</p>
                        <p className="font-medium">{userData.year}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expected Graduation</p>
                        <p className="font-medium">{userData.expectedGraduation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">CGPA</p>
                        <p className="font-medium">{userData.cgpa}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Company</p>
                        <p className="font-medium">{userData.currentCompany}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Position</p>
                        <p className="font-medium">{userData.currentPosition}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="font-medium">{userData.yearsOfExperience} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Industry</p>
                        <p className="font-medium">{userData.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Availability</p>
                        <p className="font-medium">{userData.availability}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Interests/Skills */}
              <div className="glass p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  {isStudent ? 'Career Interests' : 'Mentorship Areas'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(isStudent ? userData.careerInterests : userData.mentorshipAreas)?.map((item: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {isStudent && userData.targetCompanies && userData.targetCompanies.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Target Companies</h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.targetCompanies.map((company: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Floating Dashboard Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:scale-110 transition-all z-50 flex items-center gap-2"
            title="Back to Dashboard"
          >
            <Home className="w-6 h-6" />
            <span className="hidden md:inline font-medium">Dashboard</span>
          </button>
        </main>
      </div>
    </div>
  );
};
