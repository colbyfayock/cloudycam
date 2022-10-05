import { forwardRef } from 'react';
import styles from './Button.module.scss';

const Button = (props, ref) => {
  const { children, href, className, color, shape, iconPosition, iconSize, ...rest } = props;

  let buttonClassName = styles.button;

  if (className) {
    buttonClassName = `${buttonClassName} ${className}`;
  }

  const buttonProps = {
    className: buttonClassName,
    'data-color': color,
    'data-shape': shape,
    'data-icon-position': iconPosition,
    'data-icon-size': iconSize,
    ...rest,
  };

  if (href) {
    return (
      <a ref={ref} href={href} {...buttonProps}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} {...buttonProps}>
      {children}
    </button>
  );
};

export default forwardRef(Button);
