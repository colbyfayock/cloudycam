import Head from 'next/head';

import { useApp } from '@hooks/useApp';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';

export default function Home() {
  const { setMode, mode } = useApp();
  return (
    <Layout>
      <Head>
        <title>CloudyCam</title>
        <meta name="description" content="From Cloudinary" />
      </Head>

      <Section>
        <Container>
          <p>Mode: {mode}</p>
          <p>
            {mode !== 'user' && <Button onClick={() => setMode('user')}>Set User Mode</Button>}
            {mode !== 'photobooth' && <Button onClick={() => setMode('photobooth')}>Set Photobooth Mode</Button>}
          </p>
        </Container>
      </Section>
    </Layout>
  );
}
