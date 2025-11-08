import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Software Engineer at Google',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: 'ConnectUp connected me with an amazing mentor who guided me through my job search. I landed my dream job at Google thanks to their advice and support!',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager at Microsoft',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'As an alumnus, I love giving back to my alma mater. The platform makes it so easy to connect with students and share my experiences.',
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Research Scientist at Stanford',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    content: 'I found my research mentor through ConnectUp during my junior year. Their guidance was instrumental in my journey to graduate school.',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Startup Founder',
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    content: 'The connections I made through ConnectUp were invaluable when I was starting my own company. The alumni network is truly supportive!',
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [direction, setDirection] = useState(0);
  
  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, []);
  
  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, []);
  
  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    
    return () => clearInterval(timer);
  }, [isAutoPlay, nextSlide]);
  
  return (
    
    <section className="py-20 bg-gradient-to-b from-background to-background/90 relative overflow-hidden">
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
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from students and alumni who have transformed their careers through meaningful connections.
          </p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto">
          <div 
            className="relative h-96 overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                className="absolute inset-0 glass p-8 md:p-12 rounded-2xl flex flex-col items-center text-center"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Quote className="w-8 h-8 text-primary mb-6 opacity-20" />
                <p className="text-lg md:text-xl mb-8 max-w-2xl">"{testimonials[currentIndex].content}"</p>
                
                <div className="mt-auto flex flex-col items-center">
                  <img 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full border-2 border-primary/20 mb-4"
                    loading="lazy"
                    width="64"
                    height="64"
                  />
                  <h4 className="font-semibold text-lg">{testimonials[currentIndex].name}</h4>
                  <p className="text-muted-foreground text-sm">{testimonials[currentIndex].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary/10 transition-colors z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary/10 transition-colors z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
