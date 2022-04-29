import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';

import { useApp } from '@hooks/useApp';

import { DEFAULT_EVENT_ID } from '@data/events';

import styles from '@styles/Home.module.scss';

export default function Home({ eventId = DEFAULT_EVENT_ID }) {
  const { setEventId } = useApp();

  useEffect(() => setEventId(eventId), [eventId]);

  return (
    <Layout>
      <Head>
        <title>CloudyCam</title>
        <meta name="description" content="From Cloudinary" />
      </Head>

      <Section>
        <Container>
          <p>
            <img
              src="https://res.cloudinary.com/colbycloud-cloudycam/image/upload/$imgWidth_720/$imgHeight_720/w_$imgWidth,h_$imgHeight/f_auto/q_auto/l_cloudycam-assets:default-photo-transparent,w_$imgWidth,h_$imgHeight/l_cloudycam-assets:deal-with-it,g_faces,w_0.7,y_-0.05,fl_region_relative/u_cloudycam-assets:this_is_fine,c_fill,w_1.0,h_1.0,fl_relative/l_cloudycam-assets:cloudinary_white,h_20,o_40,g_south_east,x_10,y_10/v1/cloudycam-assets/transparent-1x1?_a=ATAJZAA0"
              alt="Keanu Reeves - This is Fine"
            />
          </p>
          <p className={styles.try}>
            <Link href="/camera" passHref={true}>
              <Button>Try the Camera</Button>
            </Link>
          </p>
        </Container>
      </Section>
    </Layout>
  );
}
