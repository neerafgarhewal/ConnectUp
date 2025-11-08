import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Users,
    title: 'Create Profile',
    description: 'Sign up and complete your profile with your interests, goals, and background. Takes less than 2 minutes!',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Get Matched',
    description: 'Our AI algorithm matches you with relevant alumni mentors based on your career goals and interests.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Start Connecting',
    description: 'Chat, schedule video calls, and grow your professional network with meaningful connections.',
    color: 'from-green-500 to-emerald-500',
  },
];

export const HowItWorksSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-background to-background/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="gradient-text">ConnectUp</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps and unlock your career potential
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-24 left-[16.666%] right-[16.666%] h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-20"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="glass p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 group h-full">
                {/* Number Badge */}
                <div className="absolute -top-6 left-8 w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 mt-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 -right-8 text-primary/30">
                    <ArrowRight className="w-16 h-16" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Free forever • 2 minute setup
          </p>
        </motion.div>
      </div>
    </section>
  );
};
