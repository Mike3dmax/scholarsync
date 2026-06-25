import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import { UserPlus, GraduationCap, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion } from 'framer-motion';

export default function Signup() {
  const { signup } = useUserStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  function handleChange(f) {
    return (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required.';
    if (!form.email) e.email = 'Email required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email.';
    if (!form.password) e.password = 'Password required.';
    else if (form.password.length < 6) e.password = 'At least 6 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    signup(form.name, form.email);
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-scholar-bg dark:bg-scholar-bg-dark relative">
      <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-4">
          <Button variant="secondary" size="sm" onClick={() => navigate('/')} className="border-scholar-accent"><ArrowLeft size={14} /> Back</Button>
        </div>
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-scholar-accent to-scholar-secondary flex items-center justify-center mx-auto mb-3"><GraduationCap size={22} className="text-white" /></div>
          <h1 className="font-display text-2xl font-bold">Create account</h1>
          <p className="text-sm text-scholar-muted dark:text-scholar-muted-dark mt-1">Start your academic journey.</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <Input label="Full Name" value={form.name} onChange={handleChange('name')} placeholder="Emma Chen" error={errors.name} />
          <Input label="Email" type="email" value={form.email} onChange={handleChange('email')} placeholder="emma@scholarsync.app" error={errors.email} />
          <Input label="Password" type="password" value={form.password} onChange={handleChange('password')} placeholder="••••••••" error={errors.password} />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="••••••••" error={errors.confirmPassword} />
          <Button type="submit" size="lg" className="w-full"><UserPlus size={16} /> Create Account</Button>
          <p className="text-center text-xs text-scholar-muted">Already have an account? <Link to="/auth/login" className="text-scholar-accent hover:underline font-medium">Sign in</Link></p>
        </form>
      </motion.div>
    </div>
  );
}
