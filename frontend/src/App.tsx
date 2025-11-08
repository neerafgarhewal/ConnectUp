import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, Suspense, lazy } from 'react';
import './index.css';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';
import { FullPageLoader } from './components/LoadingSpinner';

// Public Pages (eager load)
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';
import { StudentRegistration } from './pages/auth/StudentRegistration';
import { AlumniRegistration } from './pages/auth/AlumniRegistration';
import { AboutPage } from './pages/AboutPage';
import { PricingPage } from './pages/PricingPage';

// Dashboard Pages (lazy load for better performance)
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));
const AlumniDashboard = lazy(() => import('./pages/dashboard/AlumniDashboard').then(m => ({ default: m.AlumniDashboard })));
const FindMentorsPage = lazy(() => import('./pages/dashboard/FindMentorsPage').then(m => ({ default: m.FindMentorsPage })));
const MessagesPage = lazy(() => import('./pages/dashboard/MessagesPage').then(m => ({ default: m.MessagesPage })));
const ForumPage = lazy(() => import('./pages/dashboard/ForumPage').then(m => ({ default: m.ForumPage })));
const EventsPage = lazy(() => import('./pages/dashboard/EventsPage').then(m => ({ default: m.EventsPage })));
const StudentProfile = lazy(() => import('./pages/dashboard/StudentProfile').then(m => ({ default: m.StudentProfile })));
const MyProfile = lazy(() => import('./pages/dashboard/MyProfile').then(m => ({ default: m.MyProfile })));
const BrowseProfiles = lazy(() => import('./pages/dashboard/BrowseProfiles').then(m => ({ default: m.BrowseProfiles })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));



// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Create a client
// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RoleSelectionPage />} />
            <Route path="/register/student" element={<StudentRegistration />} />
            <Route path="/register/alumni" element={<AlumniRegistration />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardHome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <DashboardHome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/alumni-dashboard" 
              element={
                <ProtectedRoute>
                  <AlumniDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/alumni-dashboard/*" 
              element={
                <ProtectedRoute>
                  <AlumniDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/find-mentors" 
              element={
                <ProtectedRoute>
                  <FindMentorsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/messages" 
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/forum" 
              element={
                <ProtectedRoute>
                  <ForumPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/events" 
              element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/opportunities" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex items-center justify-center bg-background">
                    <h1 className="text-2xl font-bold">Opportunities Page - Coming Soon</h1>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/profile" 
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/profile/:id" 
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/my-profile" 
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/browse-profiles" 
              element={
                <ProtectedRoute>
                  <BrowseProfiles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all 404 route */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                    <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                    <a href="/" className="text-blue-600 hover:underline">Go back home</a>
                  </div>
                </div>
              } 
            />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
