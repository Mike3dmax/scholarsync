import PropTypes from 'prop-types';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-scholar-text dark:text-scholar-text-dark">{label}</label>}
      <input className={`input-field ${error ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''} ${className}`} {...props} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};
