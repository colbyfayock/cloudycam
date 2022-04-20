import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';

import { useApp } from '@hooks/useApp';

import { DEFAULT_EVENT_ID } from '@data/events';

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
            <Link href="/camera" passHref={true}>
              <Button>Try the Camera</Button>
            </Link>
          </p>
        </Container>
      </Section>
    </Layout>
  );
}
