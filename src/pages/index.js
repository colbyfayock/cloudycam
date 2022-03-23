import Head from 'next/head';
import Link from 'next/link';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>CloudyCam</title>
        <meta name="description" content="From Cloudinary" />
      </Head>

      <Container>
        <p>
          <Link href="/camera" passHref={true}>
            <Button>Try the Camera</Button>
          </Link>
        </p>
      </Container>
    </Layout>
  );
}
