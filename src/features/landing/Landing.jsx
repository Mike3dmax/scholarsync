import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { GraduationCap, Check, ArrowRight, Star, BookOpen, Calendar, BarChart3, Timer, Layout, Sparkles, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';

const features = [
  { icon: Layout, title: 'Kanban Board', desc: 'Drag and drop tasks across customizable workflows — To Do, In Progress, Review, Done.' },
  { icon: Calendar, title: 'Smart Calendar', desc: 'Monthly, weekly, and daily views with class schedules, deadlines, and events synced.' },
  { icon: Timer, title: 'Pomodoro Timer', desc: 'Stay focused with customizable sessions linked to your subjects and tasks.' },
  { icon: BarChart3, title: 'Deep Analytics', desc: 'Track completion rates, focus hours, and subject distribution with interactive charts.' },
];

const plans = [
  { name: 'Student', price: 'Free', features: ['Kanban board', 'Basic calendar', 'Pomodoro timer', 'Community access'] },
  { name: 'Scholar', price: '$6.99', period: '/mo', featured: true, features: ['Unlimited tasks & events', 'Full analytics suite', 'Data export (JSON)', 'Drag & drop workflows', 'Priority support'] },
  { name: 'Academy', price: '$14.99', period: '/mo', features: ['Everything in Scholar', 'AI study recommendations', 'Team collaboration', 'Custom integrations', 'Dedicated success coach'] },
];

const floatDuration = 6;

function FloatingShape({ className, delay = 0, size = 60 }) {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 pointer-events-none ${className}`}
      initial={{ y: 0 }}
      animate={{ y: [-20, 20, -20], rotate: [0, 10, -5, 0] }}
      transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ width: size, height: size }}
    />
  );
}

function AnimatedCounter({ to, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(to / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [to]);
  return <>{count}{suffix}</>;
}

function NavItem({ children, href }) {
  return (
    <motion.a href={href} className="relative text-sm text-scholar-muted hover:text-scholar-accent transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      {children}
    </motion.a>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
  hover: { y: -6, boxShadow: '0 20px 40px -12px rgba(16, 185, 129, 0.2)', transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 50]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCta = () => navigate(isAuthenticated ? '/dashboard' : '/auth/signup');

  function TiltCard({ children, className }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });
    function handleMouse(e) {
      const rect = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    }
    function handleLeave() { x.set(0); y.set(0); }
    return (
      <motion.div onMouseMove={handleMouse} onMouseLeave={handleLeave} style={{ rotateX, rotateY, perspective: 800 }} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-scholar-bg dark:bg-scholar-bg-dark overflow-x-hidden">
      {/* Nav */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm' : 'bg-transparent'}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/" className="flex items-center gap-2.5">
              <motion.div
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-scholar-accent to-scholar-secondary flex items-center justify-center"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <GraduationCap size={16} className="text-white" />
              </motion.div>
              <span className="font-display font-bold text-lg">Scholar<span className="text-scholar-accent">Sync</span></span>
            </Link>
          </motion.div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-scholar-muted">
            <NavItem href="#features">Features</NavItem>
            <NavItem href="#pricing">Pricing</NavItem>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/auth/login" className="hover:text-scholar-accent transition-colors">Sign In</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" onClick={() => navigate('/auth/signup')}>Get Started</Button>
            </motion.div>
          </nav>
          <div className="md:hidden flex items-center gap-3">
            <Link to="/auth/login" className="text-sm text-scholar-muted hover:text-scholar-accent">Sign In</Link>
            <Button size="sm" onClick={() => navigate('/auth/signup')}>Start</Button>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-16">
        {/* Animated background shapes */}
        <FloatingShape className="bg-scholar-accent top-20 left-[10%]" delay={0} size={80} />
        <FloatingShape className="bg-scholar-secondary top-40 right-[15%]" delay={1.5} size={60} />
        <FloatingShape className="bg-emerald-300 bottom-32 left-[20%]" delay={3} size={50} />
        <FloatingShape className="bg-blue-300 bottom-20 right-[10%]" delay={4.5} size={70} />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-scholar-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-scholar-secondary/5 rounded-full blur-3xl" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
                <motion.span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-scholar-accent/10 text-scholar-accent text-xs font-semibold border border-scholar-accent/20"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star size={12} /> Your academic journey starts here
                </motion.span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                Study Smarter.<br/>
                <motion.span
                  className="bg-gradient-to-r from-scholar-accent to-scholar-secondary bg-clip-text text-transparent inline-block"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Achieve More.
                </motion.span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg md:text-xl text-scholar-muted mt-6 max-w-xl leading-relaxed">
                The premium student planner that combines Kanban task management, a smart calendar, Pomodoro focus sessions, and deep analytics — all in one beautiful dashboard.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-8">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button size="xl" onClick={handleCta}>
                    Start Free <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowRight size={18} /></motion.span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button size="xl" variant="secondary" onClick={() => navigate('/auth/login')}>
                    Sign In
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-6 mt-8 text-sm text-scholar-muted flex-wrap">
                {['No credit card', 'Cancel anytime', 'Free forever tier'].map((text, i) => (
                  <motion.span
                    key={text}
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.15 }}
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + i * 0.15, type: 'spring', stiffness: 300 }}
                    >
                      <Check size={14} className="text-scholar-accent" />
                    </motion.span>
                    {text}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1.5, y: { duration: 2, repeat: Infinity }, opacity: { duration: 0.5 } }}
        >
          <ChevronDown size={20} className="text-scholar-muted" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-scholar-accent/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-10 h-10 rounded-2xl bg-scholar-accent/10 flex items-center justify-center mx-auto mb-4"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <Sparkles size={20} className="text-scholar-accent" />
            </motion.div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Everything you need</h2>
            <p className="text-scholar-muted mt-3 max-w-lg mx-auto">Built for students who demand more from their productivity tools.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="card-hover p-6 cursor-default relative overflow-hidden group"
                custom={i}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: '-50px' }}
                variants={cardVariants}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-scholar-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
                <div className="relative z-10">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-scholar-accent/10 flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(16,185,129,0.2)' }}
                  >
                    <f.icon size={22} className="text-scholar-accent" />
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-scholar-muted leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="card p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-scholar-accent/5 to-transparent pointer-events-none" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
              {[
                { value: 25000, label: 'Active Students', suffix: '+' },
                { value: 100000, label: 'Tasks Completed', suffix: '+' },
                { value: 49, label: 'App Rating', suffix: '' },
                { value: 999, label: 'Uptime', suffix: '%' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                >
                  <motion.p
                    className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-scholar-accent to-scholar-secondary bg-clip-text text-transparent"
                    whileHover={{ scale: 1.1 }}
                  >
                    <AnimatedCounter to={s.value} suffix={s.suffix} />
                  </motion.p>
                  <p className="text-sm text-scholar-muted mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold">Simple pricing</h2>
            <p className="text-scholar-muted mt-3">Start free, upgrade when you need more.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <TiltCard key={plan.name}>
                <motion.div
                  className={`card p-8 relative ${plan.featured ? 'border-scholar-accent/40 scale-105 md:scale-110 shadow-glow-green' : ''}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                >
                  {plan.featured && (
                    <motion.span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-scholar-accent text-white text-[11px] font-bold uppercase tracking-wider"
                      initial={{ y: -10, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, type: 'spring' }}
                    >
                      Most Popular
                    </motion.span>
                  )}
                  <h3 className="font-bold text-xl">{plan.name}</h3>
                  <div className="mt-3 mb-6">
                    <motion.span
                      className="font-display text-4xl font-bold inline-block"
                      whileHover={{ scale: 1.08 }}
                    >
                      {plan.price}
                    </motion.span>
                    {plan.period && <span className="text-scholar-muted text-sm">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map(f => (
                      <motion.li
                        key={f}
                        className="flex items-start gap-2 text-sm text-scholar-muted"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.1 }}
                      >
                        <motion.span
                          whileHover={{ scale: 1.3, rotate: 10 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Check size={16} className="text-scholar-accent mt-0.5 flex-shrink-0" />
                        </motion.span>
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div className="w-full mt-8" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant={plan.featured ? 'primary' : 'secondary'} className="w-full" onClick={handleCta}>
                      {plan.name === 'Student' ? 'Get Started Free' : 'Subscribe'}
                    </Button>
                  </motion.div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-scholar-accent/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-scholar-accent to-scholar-secondary flex items-center justify-center mx-auto mb-6"
              animate={{ scale: [1, 1.05, 1], rotate: [0, -3, 3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <GraduationCap size={24} className="text-white" />
            </motion.div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Ready to ace your semester?</h2>
            <p className="text-scholar-muted mt-3 mb-8">Join thousands of students who trust ScholarSync to organize their academic life.</p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button size="xl" onClick={handleCta}>
                Start Your Journey <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowRight size={18} /></motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="border-t border-scholar-border dark:border-scholar-border-dark py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-scholar-muted">
            <motion.div
              className="w-6 h-6 rounded-lg bg-gradient-to-br from-scholar-accent to-scholar-secondary flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <GraduationCap size={12} className="text-white" />
            </motion.div>
            <span>&copy; 2026 ScholarSync. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-scholar-muted">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <motion.a key={item} href="#" className="hover:text-scholar-accent transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
