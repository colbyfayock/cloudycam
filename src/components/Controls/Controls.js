import styles from './Controls.module.scss';

const Controls = ({ children, className, ...props }) => {
  let componentClassName = styles.controls;

  if (className) {
    componentClassName = `${componentClassName} ${className}`;
  }

  return (
    <ul className={componentClassName} {...props}>
      {children}
    </ul>
  );
};

export default Controls;
