import { FaGithub } from 'react-icons/fa';

import Container from '@components/Container';

import styles from './Footer.module.scss';

const Footer = ({ ...rest }) => {
  return (
    <footer className={styles.footer} {...rest}>
      <Container className={styles.footerContainer}>
        <ul className={styles.footerLinks}>
          <li>
            <a href="https://github.com/colbyfayock/cloudycam">
              <FaGithub /> CloudyCam on GitHub
            </a>
          </li>
        </ul>
      </Container>
      <Container className={`${styles.footerContainer} ${styles.footerLegal}`}>
        <p>
          &copy; <a href="https://spacejelly.dev">Space Jelly</a>, {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
