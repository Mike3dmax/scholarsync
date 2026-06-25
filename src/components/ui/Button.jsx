import PropTypes from 'prop-types';

const variants = {
  primary: 'bg-scholar-accent text-white hover:bg-scholar-accent-hover active:scale-[0.97] shadow-glow-green',
  secondary: 'bg-scholar-surface dark:bg-scholar-surface-dark text-scholar-text dark:text-scholar-text-dark border hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.97]',
  ghost: 'text-scholar-muted dark:text-scholar-muted-dark hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.97]',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 active:scale-[0.97]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
  xl: 'px-6 py-3 text-base',
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-scholar-accent/40 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  children: PropTypes.node,
};
