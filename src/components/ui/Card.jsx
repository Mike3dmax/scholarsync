import PropTypes from 'prop-types';

export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div className={`${hover ? 'card-hover' : 'card'} ${className}`} {...props}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
};
