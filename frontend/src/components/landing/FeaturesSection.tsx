import { motion } from 'framer-motion';
import { Brain, MessageCircle, Rocket, Users, Briefcase, BookOpen } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Smart Matching",
    description: "Our AI-powered algorithm connects you with the most relevant alumni mentors based on your academic and career goals.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Real-time Chat",
    description: "Seamlessly communicate with mentors through our secure, built-in messaging platform.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Career Growth",
    description: "Access exclusive job opportunities, internships, and career advice from successful alumni.",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community",
    description: "Join a thriving network of students and alumni who are passionate about helping each other succeed.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Mentorship Programs",
    description: "Structured mentorship programs designed to provide guidance at every stage of your academic and professional journey.",
    color: "from-rose-500 to-pink-500"
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Learning Resources",
    description: "Access a curated library of resources, study materials, and career development content.",
    color: "from-indigo-500 to-purple-500"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ConnectUp provides a comprehensive platform to bridge the gap between students and alumni, fostering meaningful connections and opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${feature.color} text-white`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
