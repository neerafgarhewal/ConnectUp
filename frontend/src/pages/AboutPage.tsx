import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target,
  Heart,
  Lightbulb,
  Shield,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const stats = [
  { value: '10,000+', label: 'Active Users' },
  { value: '5,000+', label: 'Mentorship Connections' },
  { value: '50+', label: 'Partner Universities' },
  { value: '95%', label: 'Success Rate' },
];

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'We believe in building strong, supportive communities that empower students and alumni.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Constantly evolving our platform to provide the best mentorship experience.',
  },
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'Your privacy and security are our top priorities in every interaction.',
  },
  {
    icon: Zap,
    title: 'Impact',
    description: 'Creating meaningful connections that transform careers and lives.',
  },
];

const team = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Co-Founder',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Former Google PM with 10+ years in tech',
  },
  {
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Ex-Microsoft engineer, Stanford CS grad',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Community',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    bio: 'Built communities at LinkedIn & Meta',
  },
  {
    name: 'David Kim',
    role: 'Head of Product',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: 'Product leader from Amazon & Uber',
  },
];

const timeline = [
  { year: '2020', title: 'Founded', description: 'ConnectUp was born from a vision to bridge the gap between students and alumni' },
  { year: '2021', title: 'First 1,000 Users', description: 'Reached our first milestone with 5 partner universities' },
  { year: '2022', title: 'Series A Funding', description: 'Raised $10M to expand our platform nationwide' },
  { year: '2023', title: 'Global Expansion', description: 'Launched in 10 countries with 50+ universities' },
  { year: '2024', title: '10,000+ Connections', description: 'Facilitated over 10,000 successful mentorship connections' },
];

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-background"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Empowering the Next Generation Through
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Mentorship</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              ConnectUp bridges the gap between ambitious students and experienced alumni,
              creating meaningful connections that transform careers and lives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-10 h-10 text-primary" />
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                At ConnectUp, we believe that every student deserves access to guidance from those who've walked the path before them. Our mission is to democratize mentorship and create a world where knowledge, experience, and opportunities are shared freely.
              </p>
              <p className="text-lg text-muted-foreground">
                We're building more than just a platform – we're cultivating a global community of learners, mentors, and changemakers who support each other's growth and success.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden glass">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at ConnectUp
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-xl"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From a small idea to a global movement
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-2xl font-bold text-primary">{item.year}</span>
                </div>
                <div className="relative flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  {index !== timeline.length - 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals dedicated to transforming mentorship
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-xl text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-2xl text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're a student seeking guidance or an alumni ready to give back,
              there's a place for you at ConnectUp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 font-medium"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border border-border rounded-lg hover:bg-foreground/5 transition-all font-medium"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
