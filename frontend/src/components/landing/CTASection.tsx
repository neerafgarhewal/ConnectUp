import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="glass p-8 md:p-12 rounded-3xl text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              whileInView={{ 
                scale: [0, 1.1, 0.9, 1],
                rotate: [0, 10, -10, 0]
              }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              <Rocket className="w-8 h-8" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your career?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join ConnectUp today and unlock a world of opportunities. Connect with mentors, find your dream job, and build your professional network.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register/student" 
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-full hover:opacity-90 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="/about" 
                className="px-8 py-4 bg-transparent border-2 border-primary/20 text-foreground font-medium rounded-full hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
              >
                Learn More
              </a>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary border-2 border-background"></div>
                  ))}
                </div>
                <span>Join 1,000+ students and alumni</span>
              </div>
              <span className="hidden sm:inline-block">•</span>
              <div className="flex items-center gap-2">
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
