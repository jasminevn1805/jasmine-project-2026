import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'react-feather';
import styles from './Button.module.css';

export type ButtonSize = 'S' | 'M' | 'L';
export type ButtonType =
  | 'Primary'
  | 'Secondary'
  | 'Tertiary'
  | 'Tertiary Mono'
  | 'Inverse'
  | 'Mono'
  | 'Outline'
  | 'Outline Mono'
  | 'Text'
  | 'Text Mono'
  | 'Negative Primary'
  | 'Negative Outline'
  | 'Negative Text';

export interface ButtonProps {
  /** Button content (text, icons, or any JSX) */
  children: React.ReactNode;
  /** Button size variant */
  size?: ButtonSize;
  /** Button type/variant */
  type?: ButtonType;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Button HTML type */
  htmlType?: 'button' | 'submit' | 'reset';
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Button component from Jasmine Design System v1.0
 * 
 * A comprehensive button component with multiple variants, sizes, and states.
 * Supports loading states and full accessibility.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  size = 'M',
  type = 'Primary',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  htmlType = 'button',
  ariaLabel,
}) => {
  // Convert type to camelCase for CSS module class name
  // "Negative Primary" -> "negativePrimary"
  const typeClassName = type
    .split(' ')
    .map((word, index) => {
      const lowerWord = word.toLowerCase();
      return index === 0 ? lowerWord : lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join('');
  
  // Generate CSS class names based on props
  const buttonClasses = [
    styles.button,
    styles[size.toLowerCase()],
    styles[typeClassName],
    loading && styles.loading,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'L' ? 24 : size === 'M' ? 20 : 16;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type={htmlType}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={disabled}
    >
      <div className={styles.button__content}>
        {loading && (
          <span className={styles.button__loader} aria-label="Loading">
            <Loader size={iconSize} className={styles.button__spinner} />
          </span>
        )}

        {!loading && <span className={styles.button__label}>{children}</span>}
      </div>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['S', 'M', 'L']),
  type: PropTypes.oneOf([
    'Primary',
    'Secondary',
    'Tertiary',
    'Tertiary Mono',
    'Inverse',
    'Mono',
    'Outline',
    'Outline Mono',
    'Text',
    'Text Mono',
    'Negative Primary',
    'Negative Outline',
    'Negative Text',
  ]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']),
  ariaLabel: PropTypes.string,
};

export default Button;
