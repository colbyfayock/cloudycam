import styles from './Sidebar.module.scss';

const Sidebar = ({ children, ...props }) => {
  return (
    <div className={styles.sidebar} {...props}>
      {children}
    </div>
  );
};

export default Sidebar;
