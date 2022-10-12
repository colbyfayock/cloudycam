import styles from './SidebarTitle.module.scss';

const SidebarTitle = ({ children, className, ...props }) => {
  let componentClassName = styles.sidebarTitle;

  if (className) {
    componentClassName = `${componentClassName} ${className}`;
  }

  return (
    <h2 className={componentClassName} {...props}>
      {children}
    </h2>
  );
};

export default SidebarTitle;
