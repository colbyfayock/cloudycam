import styles from './Button.module.scss';

const Button = ({ children, href, className, color, shape, iconPosition, ...rest }) => {
  let buttonClassName = styles.button;

  if ( className ) {
    buttonClassName = `${buttonClassName} ${className}`
  }

  const buttonProps = {
    className: buttonClassName,
    'data-color': color,
    'data-shape': shape,
    'data-icon-position': iconPosition,
    ...rest
  }

  if ( href ) {
    return (
      <a href={href} {...buttonProps}>
        { children }
      </a>
    )
  }

  return (
    <button {...buttonProps}>
      { children }
    </button>
  )
}

export default Button;