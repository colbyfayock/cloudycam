import Head from 'next/head';
import Link from 'next/link';
import { FaCamera } from 'react-icons/fa';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>CloudyCam</title>
        <meta name="description" content="From Cloudinary" />
      </Head>

      <Section>
        <Container className={styles.homeContainer}>
          <ul className={styles.imageGrid}>
            <li>
              <img src="/images/cloudycam-example-dali.jpg" alt="Is it a money heist?" />
            </li>
            <li>
              <img src="/images/cloudycam-example-unicorn.jpg" alt="Prized Unicorn from CloudyCam" />
            </li>
            <li>
              <img src="/images/cloudycam-example-dog.jpg" alt="Deal with it, dog" />
            </li>
            <li>
              <img src="/images/cloudycam-example-cityjsbrazil.jpg" alt="Darth Vader in CityJS Brazil" />
            </li>
          </ul>
          <p className={styles.try}>
            <Link href="/camera" passHref={true}>
              <Button className={styles.tryButton} shape="capsule" iconPosition="left">
                <FaCamera />
                Snap a Photo
              </Button>
            </Link>
          </p>
          <p className={styles.instructions}>
            Take a selfie, add some effects using{' '}
            <a href="https://cloudinary.com/documentation/image_transformations" rel="noreferrer" target="_blank">
              Cloudinary transformations
            </a>
            , and share on Twitter!
          </p>
        </Container>
      </Section>
    </Layout>
  );
}
