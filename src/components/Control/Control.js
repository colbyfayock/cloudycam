import styles from './Control.module.scss';

const Control = ({ children, className, ...props }) => {
  let componentClassName = styles.control;

  if (className) {
    componentClassName = `${componentClassName} ${className}`;
  }

  return (
    <li className={componentClassName} {...props}>
      {children}
    </li>
  );
};

export default Control;
