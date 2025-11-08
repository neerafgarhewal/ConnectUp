import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  List,
  MapPin,
  Clock,
  Users,
  Share2,
  Plus,
  Video,
  Check,
} from 'lucide-react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: 'Web Development Workshop',
    type: 'Workshop',
    host: {
      name: 'Dr. Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    date: new Date(2025, 10, 20),
    time: '2:00 PM - 5:00 PM',
    duration: '3 hours',
    location: 'Virtual',
    virtualLink: 'https://meet.google.com/abc-defg-hij',
    attendees: 45,
    maxAttendees: 50,
    description: 'Learn modern web development with React, Node.js, and deployment strategies. Hands-on workshop with real projects.',
    tags: ['React', 'Node.js', 'Web Development'],
    registered: false,
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
  },
  {
    id: 2,
    title: 'Career in Tech - Panel Discussion',
    type: 'Webinar',
    host: {
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    date: new Date(2025, 11, 5),
    time: '6:00 PM - 7:30 PM',
    duration: '1.5 hours',
    location: 'Virtual',
    virtualLink: 'https://zoom.us/j/123456789',
    attendees: 120,
    maxAttendees: 150,
    description: 'Join industry leaders discussing career paths in technology, skills needed, and how to break into tech.',
    tags: ['Career', 'Panel', 'Tech'],
    registered: true,
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  },
  {
    id: 3,
    title: 'Google Campus Visit',
    type: 'Company Visit',
    host: {
      name: 'Priya Patel',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    date: new Date(2025, 10, 25),
    time: '10:00 AM - 2:00 PM',
    duration: '4 hours',
    location: 'Google Office, Mountain View, CA',
    attendees: 25,
    maxAttendees: 30,
    description: 'Exclusive campus tour of Google headquarters with Q&A session with engineers and lunch included.',
    tags: ['Google', 'Campus Tour', 'Networking'],
    registered: false,
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
  },
  {
    id: 4,
    title: 'Alumni Networking Mixer',
    type: 'Networking',
    host: {
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    },
    date: new Date(2025, 10, 15),
    time: '7:00 PM - 9:00 PM',
    duration: '2 hours',
    location: 'IIT Ropar Campus, Auditorium',
    attendees: 80,
    maxAttendees: 100,
    description: 'Connect with alumni from various industries. Great opportunity for mentorship and career guidance.',
    tags: ['Networking', 'Alumni', 'Career'],
    registered: true,
    banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
  },
];

const eventTypes = ['All', 'Webinar', 'Workshop', 'Networking', 'Company Visit'];

const getEventTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    Webinar: 'bg-blue-500/10 text-blue-500',
    Workshop: 'bg-purple-500/10 text-purple-500',
    Networking: 'bg-green-500/10 text-green-500',
    'Company Visit': 'bg-amber-500/10 text-amber-500',
  };
  return colors[type] || 'bg-muted text-muted-foreground';
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const EventsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState<'all' | 'virtual' | 'in-person'>('all');
  const [events, setEvents] = useState(mockEvents);

  const handleRSVP = (eventId: number) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, registered: !event.registered } : event
      )
    );
  };

  const filteredEvents = events.filter((event) => {
    const matchesType = selectedType === 'All' || event.type === selectedType;
    const matchesLocation =
      selectedLocation === 'all' ||
      (selectedLocation === 'virtual' && event.location === 'Virtual') ||
      (selectedLocation === 'in-person' && event.location !== 'Virtual');
    return matchesType && matchesLocation;
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Events</h1>
                <p className="text-muted-foreground">
                  Discover and join events hosted by alumni and industry professionals
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                      viewMode === 'list' ? 'bg-background shadow-sm' : ''
                    }`}
                  >
                    <List className="w-4 h-4" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                      viewMode === 'calendar' ? 'bg-background shadow-sm' : ''
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Calendar
                  </button>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Event
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                {eventTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedType === type
                        ? 'bg-primary text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value="all">All Locations</option>
                <option value="virtual">Virtual Only</option>
                <option value="in-person">In-person Only</option>
              </select>
            </div>

            {/* List View */}
            {viewMode === 'list' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl overflow-hidden hover:shadow-xl transition-all group"
                  >
                    {/* Banner */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      {/* Host */}
                      <div className="flex items-center gap-2 mb-3">
                        <img
                          src={event.host.avatar}
                          alt={event.host.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm text-muted-foreground">by {event.host.name}</span>
                      </div>

                      {/* Date & Time */}
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {event.location === 'Virtual' ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                          {event.location}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-muted rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Attendees */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {event.attendees}/{event.maxAttendees} attending
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRSVP(event.id)}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                            event.registered
                              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                              : 'bg-primary text-white hover:opacity-90'
                          }`}
                        >
                          {event.registered ? (
                            <span className="flex items-center justify-center gap-2">
                              <Check className="w-4 h-4" />
                              Registered
                            </span>
                          ) : (
                            'RSVP'
                          )}
                        </button>
                        <button className="p-2 border border-border rounded-lg hover:bg-foreground/5 transition-all">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Calendar View - Placeholder */}
            {viewMode === 'calendar' && (
              <div className="glass p-8 rounded-xl text-center">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Full calendar implementation with event indicators coming soon
                </p>
              </div>
            )}

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or create a new event
                </p>
                <button className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-all">
                  Create Event
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
