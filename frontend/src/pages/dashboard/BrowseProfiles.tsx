import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { studentAPI, alumniAPI, authAPI } from '../../services/api';

export const BrowseProfiles = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'students' | 'alumni'>('all');

  useEffect(() => {
    loadProfiles();
  }, [filterType]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const currentUser = authAPI.getCurrentUser();
      
      let allProfiles: any[] = [];

      // Load students
      if (filterType === 'all' || filterType === 'students') {
        const studentsResponse = await studentAPI.getAllStudents();
        const students = studentsResponse.data.students.map((s: any) => ({
          ...s,
          type: 'student',
        }));
        allProfiles = [...allProfiles, ...students];
      }

      // Load alumni
      if (filterType === 'all' || filterType === 'alumni') {
        const alumniResponse = await alumniAPI.getAllAlumni();
        const alumni = alumniResponse.data.alumni.map((a: any) => ({
          ...a,
          type: 'alumni',
        }));
        allProfiles = [...allProfiles, ...alumni];
      }

      // Filter out current user
      const filteredProfiles = allProfiles.filter(p => p._id !== currentUser?._id);
      
      setProfiles(filteredProfiles);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profiles:', error);
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
    const university = profile.university?.toLowerCase() || '';
    const company = profile.currentCompany?.toLowerCase() || '';
    
    return fullName.includes(searchLower) || 
           university.includes(searchLower) || 
           company.includes(searchLower);
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Browse Profiles</h1>
              <p className="text-muted-foreground">
                Connect with students and alumni from your network
              </p>
            </div>

            {/* Search and Filter */}
            <div className="glass p-6 rounded-xl mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name, university, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      filterType === 'all'
                        ? 'bg-primary text-white'
                        : 'border border-border hover:bg-foreground/5'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('students')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      filterType === 'students'
                        ? 'bg-primary text-white'
                        : 'border border-border hover:bg-foreground/5'
                    }`}
                  >
                    Students
                  </button>
                  <button
                    onClick={() => setFilterType('alumni')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      filterType === 'alumni'
                        ? 'bg-primary text-white'
                        : 'border border-border hover:bg-foreground/5'
                    }`}
                  >
                    Alumni
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Found {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading profiles...</p>
                </div>
              </div>
            )}

            {/* Profiles Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile, index) => (
                  <motion.div
                    key={profile._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/dashboard/profile/${profile._id}`}
                      className="glass p-6 rounded-xl hover:scale-105 transition-all block"
                    >
                      {/* Profile Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={profile.profilePhoto || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&size=200&background=random`}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">
                            {profile.firstName} {profile.lastName}
                          </h3>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {profile.type === 'student' ? 'Student' : 'Alumni'}
                          </span>
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="space-y-2 mb-4">
                        {profile.type === 'student' ? (
                          <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <GraduationCap className="w-4 h-4" />
                              <span className="truncate">{profile.degree} in {profile.branch}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{profile.university}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Star className="w-4 h-4" />
                              <span>CGPA: {profile.cgpa}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Briefcase className="w-4 h-4" />
                              <span className="truncate">{profile.currentPosition}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{profile.currentCompany}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Star className="w-4 h-4" />
                              <span>Rating: {profile.rating?.toFixed(1) || '0.0'}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Interests/Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(profile.type === 'student' ? profile.careerInterests : profile.mentorshipAreas)
                          ?.slice(0, 3)
                          .map((interest: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary"
                            >
                              {interest}
                            </span>
                          ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{profile.type === 'student' ? profile.mentors?.length || 0 : profile.mentees?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4" />
                          <span>{profile.profileViews || 0} views</span>
                        </div>
                      </div>

                      {/* View Profile Button */}
                      <button className="w-full mt-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all font-medium">
                        View Profile
                      </button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProfiles.length === 0 && (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No profiles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
