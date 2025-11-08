import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, X, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Perfect for students just starting their mentorship journey',
    features: [
      { text: 'Connect with up to 3 mentors', included: true },
      { text: 'Basic profile customization', included: true },
      { text: 'Access to community forum', included: true },
      { text: 'Attend public events', included: true },
      { text: 'Limited messaging (50/month)', included: true },
      { text: 'Priority mentor matching', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'Private events access', included: false },
    ],
    cta: 'Get Started',
    popular: false,
    link: '/register',
  },
  {
    name: 'Pro',
    price: '9.99',
    period: 'per month',
    description: 'For serious students ready to accelerate their growth',
    features: [
      { text: 'Unlimited mentor connections', included: true },
      { text: 'Advanced profile customization', included: true },
      { text: 'Priority mentor matching', included: true },
      { text: 'Unlimited messaging', included: true },
      { text: 'Access to all events', included: true },
      { text: 'Career resources library', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: '1-on-1 session scheduling', included: true },
      { text: 'Resume review credits', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Start Free Trial',
    popular: true,
    link: '/register',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For universities and organizations',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom branding', included: true },
      { text: 'SSO integration', included: true },
      { text: 'Advanced reporting', included: true },
      { text: 'API access', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Training & onboarding', included: true },
      { text: 'SLA guarantee', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
    link: '/contact',
  },
];

const faqs = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Yes, we offer a 14-day free trial for the Pro plan. No credit card required to start.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and PayPal. Enterprise customers can also pay via invoice.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely! You can cancel your subscription at any time. Your access will continue until the end of your billing period.',
  },
  {
    question: 'Do you offer student discounts?',
    answer: 'Yes! Students with a valid .edu email address get 20% off Pro plans. Verify your student status during signup.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your data remains accessible for 30 days after cancellation. You can export your data anytime from your account settings.',
  },
];

export const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Simple, Transparent
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Choose the perfect plan for your mentorship journey. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 glass p-2 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`glass p-8 rounded-2xl relative ${
                  plan.popular ? 'ring-2 ring-primary scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="mb-2">
                    {plan.price === 'Custom' ? (
                      <span className="text-4xl font-bold">{plan.price}</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">${plan.price}</span>
                        {billingCycle === 'yearly' && plan.price !== '0' && (
                          <span className="text-4xl font-bold">
                            {(parseFloat(plan.price) * 12 * 0.8).toFixed(2)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {billingCycle === 'yearly' && plan.price !== '0' && plan.price !== 'Custom'
                      ? 'per year'
                      : plan.period}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included ? 'text-foreground' : 'text-muted-foreground'
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.link}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90'
                      : 'border border-border hover:bg-foreground/5'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">All Plans Include</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Core features available to everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              'Secure messaging platform',
              'Profile creation & customization',
              'Community forum access',
              'Event calendar',
              'Mobile app access',
              'Email notifications',
              'Search & discovery',
              'Connection management',
              '24/7 platform access',
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass p-4 rounded-lg flex items-center gap-3"
              >
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-foreground/5 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <HelpCircle
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-2xl text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students and alumni building meaningful connections
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 font-medium"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border border-border rounded-lg hover:bg-foreground/5 transition-all font-medium"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
