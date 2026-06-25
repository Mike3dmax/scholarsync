import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import { LogIn, GraduationCap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useUserStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!email) e.email = 'Email required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email.';
    if (!password) e.password = 'Password required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    login(email, password);
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
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-scholar-muted dark:text-scholar-muted-dark mt-1">Sign in to ScholarSync.</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="emma@scholarsync.app" error={errors.email} />
          <div className="relative">
            <Input label="Password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" error={errors.password} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-scholar-muted hover:text-scholar-text dark:hover:text-scholar-text-dark">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          <Button type="submit" size="lg" className="w-full"><LogIn size={16} /> Sign In</Button>
          <p className="text-center text-xs text-scholar-muted">Don't have an account? <Link to="/auth/signup" className="text-scholar-accent hover:underline font-medium">Sign up</Link></p>
        </form>
      </motion.div>
    </div>
  );
}
