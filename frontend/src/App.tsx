import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import './index.css';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { AlumniDashboard } from './pages/dashboard/AlumniDashboard';
import { FindMentorsPage } from './pages/dashboard/FindMentorsPage';
import { MessagesPage } from './pages/dashboard/MessagesPage';
import { ForumPage } from './pages/dashboard/ForumPage';
import { EventsPage } from './pages/dashboard/EventsPage';
import { StudentProfile } from './pages/dashboard/StudentProfile';
import { MyProfile } from './pages/dashboard/MyProfile';
import { BrowseProfiles } from './pages/dashboard/BrowseProfiles';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentRegistration } from './pages/auth/StudentRegistration';
import { AlumniRegistration } from './pages/auth/AlumniRegistration';
import { AboutPage } from './pages/AboutPage';
import { PricingPage } from './pages/PricingPage';



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
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RoleSelectionPage />} />
          <Route path="/register/student" element={<StudentRegistration />} />
          <Route path="/register/alumni" element={<AlumniRegistration />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/*" element={<DashboardHome />} />
          <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
          <Route path="/alumni-dashboard/*" element={<AlumniDashboard />} />
          <Route path="/dashboard/find-mentors" element={<FindMentorsPage />} />
          <Route path="/dashboard/messages" element={<MessagesPage />} />
          <Route path="/dashboard/forum" element={<ForumPage />} />
          <Route path="/dashboard/events" element={<EventsPage />} />
          <Route path="/dashboard/opportunities" element={<div className="min-h-screen flex items-center justify-center bg-background"><h1 className="text-2xl font-bold">Opportunities Page - Coming Soon</h1></div>} />
          <Route path="/dashboard/profile" element={<StudentProfile />} />
          <Route path="/dashboard/profile/:id" element={<StudentProfile />} />
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/browse-profiles" element={<BrowseProfiles />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/about" element={<div className="min-h-screen flex items-center justify-center bg-background"><h1 className="text-4xl font-bold">About Page - Coming Soon</h1></div>} />
          <Route path="/pricing" element={<div className="min-h-screen flex items-center justify-center bg-background"><h1 className="text-4xl font-bold">Pricing Page - Coming Soon</h1></div>} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
