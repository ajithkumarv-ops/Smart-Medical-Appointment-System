import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Calendar, Clock, Users, Shield, Smartphone, BarChart3,
  ChevronRight, Star, ArrowRight, Hospital, Activity,
  Stethoscope, Zap, Globe, Award
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
  }),
};

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Public Navbar ──────────────────────────────────────────────────────────
function PublicNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
          <Hospital size={18} className="text-white" />
        </div>
        <span className="font-display text-xl font-bold text-brand-900">
          Medi<span className="text-brand-500">Queue</span>
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {['Features', 'How It Works', 'Pricing', 'About'].map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
            className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
            {l}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login">
          <Button variant="ghost" size="sm">Sign In</Button>
        </Link>
        <Link to="/register">
          <Button size="sm">Get Started</Button>
        </Link>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-gradient-hero">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-300/15 rounded-full blur-3xl"
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container-xl relative z-10 px-6 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-200 text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Now serving 50,000+ patients daily
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6 text-balance"
        >
          Smart Medical
          <br />
          <span className="gradient-text">Appointment</span>
          <br />
          <span className="text-white">& Queue System</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Revolutionize patient care with intelligent appointment scheduling, real-time queue management, and data-driven insights for modern hospitals.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link to="/register">
            <button className="btn-primary text-base px-8 py-4 rounded-xl">
              <span>Start Free Trial</span>
              <ArrowRight size={18} />
            </button>
          </Link>
          <Link to="/login">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-300">
              <span>Sign In</span>
              <ChevronRight size={18} />
            </button>
          </Link>
        </motion.div>

        {/* Floating stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap justify-center gap-4 mt-16"
        >
          {[
            { value: '50K+', label: 'Active Patients', icon: Users },
            { value: '200+', label: 'Healthcare Providers', icon: Stethoscope },
            { value: '<5min', label: 'Avg Wait Time', icon: Clock },
            { value: '99.9%', label: 'System Uptime', icon: Activity },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="glass rounded-2xl px-6 py-4 text-center min-w-[120px]">
              <div className="flex items-center justify-center mb-2 text-blue-300">
                <Icon size={18} />
              </div>
              <p className="font-display text-2xl font-bold text-white">{value}</p>
              <p className="text-blue-300 text-xs mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────
const features = [
  { icon: Calendar, title: 'Smart Scheduling',  color: 'from-blue-500 to-blue-600',    desc: 'AI-powered appointment booking with real-time availability and conflict prevention.' },
  { icon: Clock,    title: 'Queue Management',   color: 'from-teal-500 to-teal-600',    desc: 'Live queue monitoring with estimated wait times and instant patient notifications.' },
  { icon: BarChart3,title: 'Analytics & Insights',color:'from-purple-500 to-purple-600',desc: 'Comprehensive dashboards with actionable insights to optimize hospital operations.' },
  { icon: Shield,   title: 'HIPAA Compliant',    color: 'from-green-500 to-green-600',  desc: 'Bank-grade encryption and full compliance with healthcare data regulations.' },
  { icon: Smartphone,title: 'Mobile First',      color: 'from-orange-500 to-orange-600',desc: 'Responsive PWA design that works seamlessly on any device, anywhere.' },
  { icon: Users,    title: 'Multi-Role Access',  color: 'from-rose-500 to-rose-600',    desc: 'Granular role-based access for admins, doctors, receptionists, and patients.' },
];

function Features() {
  return (
    <section id="features" className="section bg-gray-50/50">
      <div className="container-xl">
        <AnimatedSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-brand-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Why MediQueue?
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl lg:text-5xl font-bold text-brand-900 mb-4 text-balance">
            Everything Your Hospital Needs
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg max-w-2xl mx-auto">
            Powerful features designed to modernize healthcare operations and improve patient outcomes.
          </motion.p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, color, desc }, i) => (
            <AnimatedSection key={title}>
              <motion.div
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4 }}
                className="card p-8 group cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ────────────────────────────────────────────────────────────
const steps = [
  { step: '01', title: 'Book Appointment',  desc: 'Patients book appointments online, selecting their preferred doctor and time slot.', color: 'text-blue-500' },
  { step: '02', title: 'Get Confirmation',  desc: 'Instant email and SMS confirmation with appointment details and queue number.', color: 'text-teal-500' },
  { step: '03', title: 'Track Queue',       desc: 'Real-time queue updates on patient\'s phone so they know exactly when to arrive.', color: 'text-purple-500' },
  { step: '04', title: 'Seamless Consult',  desc: 'Doctor reviews patient history, completes consultation, and updates records instantly.', color: 'text-green-500' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="section bg-white">
      <div className="container-xl">
        <AnimatedSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-brand-500 font-semibold text-sm uppercase tracking-wider mb-3">Process</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl lg:text-5xl font-bold text-brand-900 mb-4">
            How It Works
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-gray-500 text-lg max-w-xl mx-auto">
            Four simple steps to transform your healthcare experience.
          </motion.p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-teal-200 to-green-200 z-0" />

          {steps.map(({ step, title, desc, color }, i) => (
            <AnimatedSection key={step}>
              <motion.div variants={fadeUp} custom={i} className="text-center relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-100 shadow-card flex items-center justify-center mx-auto mb-6">
                  <span className={`font-display font-bold text-sm ${color}`}>{step}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
const testimonials = [
  { name: 'Dr. Sarah Chen',   role: 'Chief of Medicine, Metro Hospital',    rating: 5, text: 'MediQueue transformed our outpatient department. Wait times dropped by 60% in the first month and patient satisfaction scores have never been higher.' },
  { name: 'James Rodriguez',  role: 'Hospital Administrator, City Medical', rating: 5, text: 'The analytics dashboard gives us real-time insights we never had before. We can now proactively manage capacity and staff resources.' },
  { name: 'Emily Watson',     role: 'Patient',                              rating: 5, text: 'I used to dread hospital visits, but now I can track my queue position from home and arrive just in time. Game changer!' },
];

function Testimonials() {
  return (
    <section className="section bg-gradient-hero">
      <div className="container-xl">
        <AnimatedSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-3">Testimonials</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Healthcare Leaders
          </motion.h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name}>
              <motion.div variants={fadeUp} custom={i} className="glass rounded-3xl p-8">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="section bg-white">
      <div className="container-xl">
        <AnimatedSection>
          <motion.div
            variants={fadeUp}
            className="relative rounded-3xl overflow-hidden p-12 lg:p-16 text-center bg-gradient-brand"
          >
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />

            <div className="relative z-10">
              <div className="flex justify-center gap-3 mb-6">
                {[Award, Globe, Zap].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                ))}
              </div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
                Ready to Transform Your Hospital?
              </h2>
              <p className="text-blue-200 text-lg max-w-xl mx-auto mb-10">
                Join 500+ healthcare facilities worldwide. Start your free 30-day trial today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register">
                  <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-brand-700 bg-white hover:bg-blue-50 transition-all duration-300 shadow-glass">
                    Start Free Trial <ArrowRight size={18} />
                  </button>
                </Link>
                <a href="mailto:contact@mediqueue.com">
                  <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-300">
                    Talk to Sales
                  </button>
                </a>
              </div>
              <p className="text-blue-300 text-sm mt-6">No credit card required · Free onboarding support</p>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <>
      <PublicNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
