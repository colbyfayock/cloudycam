import Link from 'next/link';

import Container from '@components/Container';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            <a>Cloudinary Camera Filters</a>
          </Link>
        </p>
        <ul className={styles.headerLinks}>
          <li>
            <a href="https://github.com/colbyfayock/cloudinary-camera-filters">
              Inspect on GitHub
            </a>
          </li>
        </ul>
      </Container>
    </header>
  )
}

export default Header;