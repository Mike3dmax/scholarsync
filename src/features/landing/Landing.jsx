import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import { motion } from 'framer-motion';
import { GraduationCap, Check, ArrowRight, Star, BookOpen, Calendar, BarChart3, Timer, Layout } from 'lucide-react';
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

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  const handleCta = () => {
    navigate(isAuthenticated ? '/dashboard' : '/auth/signup');
  };

  return (
    <div className="min-h-screen bg-scholar-bg dark:bg-scholar-bg-dark">
      {/* Nav */}
      <motion.header className="fixed top-0 left-0 right-0 z-50" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-scholar-accent to-scholar-secondary flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg">Scholar<span className="text-scholar-accent">Sync</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-scholar-muted">
            <a href="#features" className="hover:text-scholar-accent transition-colors">Features</a>
            <a href="#pricing" className="hover:text-scholar-accent transition-colors">Pricing</a>
            <Link to="/auth/login" className="hover:text-scholar-accent transition-colors">Sign In</Link>
            <Button size="sm" onClick={() => navigate('/auth/signup')}>Get Started</Button>
          </nav>
          <div className="md:hidden flex items-center gap-3">
            <Link to="/auth/login" className="text-sm text-scholar-muted hover:text-scholar-accent">Sign In</Link>
            <Button size="sm" onClick={() => navigate('/auth/signup')}>Start</Button>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-scholar-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-scholar-accent/10 text-scholar-accent text-xs font-semibold border border-scholar-accent/20 mb-6">
                <Star size={12} /> Your academic journey starts here
              </span>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                Study Smarter.<br/>
                <span className="bg-gradient-to-r from-scholar-accent to-scholar-secondary bg-clip-text text-transparent">Achieve More.</span>
              </h1>
              <p className="text-lg md:text-xl text-scholar-muted mt-6 max-w-xl leading-relaxed">
                The premium student planner that combines Kanban task management, a smart calendar, Pomodoro focus sessions, and deep analytics — all in one beautiful dashboard.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button size="xl" onClick={handleCta}>
                  Start Free <ArrowRight size={18} />
                </Button>
                <Button size="xl" variant="secondary" onClick={() => navigate('/auth/login')}>
                  Sign In
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-scholar-muted">
                <span className="flex items-center gap-1.5"><Check size={14} className="text-scholar-accent" /> No credit card</span>
                <span className="flex items-center gap-1.5"><Check size={14} className="text-scholar-accent" /> Cancel anytime</span>
                <span className="flex items-center gap-1.5"><Check size={14} className="text-scholar-accent" /> Free forever tier</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Everything you need</h2>
            <p className="text-scholar-muted mt-3 max-w-lg mx-auto">Built for students who demand more from their productivity tools.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} className="card-hover p-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="w-12 h-12 rounded-xl bg-scholar-accent/10 flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-scholar-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-scholar-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="card p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '25K+', label: 'Active Students' },
                { value: '100K+', label: 'Tasks Completed' },
                { value: '4.9', label: 'App Rating' },
                { value: '99.9%', label: 'Uptime' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <p className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-scholar-accent to-scholar-secondary bg-clip-text text-transparent">{s.value}</p>
                  <p className="text-sm text-scholar-muted mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Simple pricing</h2>
            <p className="text-scholar-muted mt-3">Start free, upgrade when you need more.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`card p-8 relative ${plan.featured ? 'border-scholar-accent/40 scale-105 md:scale-110' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-scholar-accent text-white text-[11px] font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <h3 className="font-bold text-xl">{plan.name}</h3>
                <div className="mt-3 mb-6">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-scholar-muted text-sm">{plan.period}</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-scholar-muted">
                      <Check size={16} className="text-scholar-accent mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.featured ? 'primary' : 'secondary'} className="w-full mt-8" onClick={handleCta}>
                  {plan.name === 'Student' ? 'Get Started Free' : 'Subscribe'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Ready to ace your semester?</h2>
            <p className="text-scholar-muted mt-3 mb-8">Join thousands of students who trust ScholarSync to organize their academic life.</p>
            <Button size="xl" onClick={handleCta}>
              Start Your Journey <ArrowRight size={18} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-scholar-border dark:border-scholar-border-dark py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-scholar-muted">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-scholar-accent to-scholar-secondary flex items-center justify-center">
              <GraduationCap size={12} className="text-white" />
            </div>
            <span>&copy; 2026 ScholarSync. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-scholar-muted">
            <a href="#" className="hover:text-scholar-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-scholar-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-scholar-accent transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
