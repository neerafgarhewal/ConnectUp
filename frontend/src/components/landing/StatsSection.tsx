import { motion } from 'framer-motion';
import { Users, GraduationCap, Briefcase, Globe } from 'lucide-react';

const stats = [
  {
    icon: <Users className="w-8 h-8" />,
    value: "1000+",
    label: "Active Students",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    value: "500+",
    label: "Alumni Mentors",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    value: "2000+",
    label: "Connections Made",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    value: "150+",
    label: "Companies",
    color: "from-emerald-500 to-teal-500"
  }
];

export const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background/80 to-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="glass p-8 rounded-2xl text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
            >
              <div className={`w-16 h-16 rounded-2xl mb-4 mx-auto flex items-center justify-center bg-gradient-to-br ${stat.color} text-white`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2 gradient-text">{stat.value}</div>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
