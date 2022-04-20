import { useRouter } from 'next/router';
import Head from 'next/head';

import { useApp } from '@hooks/useApp';

import CldCamera from '@components/CldCamera';

export default function Camera() {
  const router = useRouter();

  const { eventId } = useApp();

  /**
   * handleOnShare
   */

  function handleOnShare({ publicId }) {
    router.push(`/share/${publicId}`);
  }

  return (
    <>
      <Head>
        <title>CloudyCam</title>
        <meta name="description" content="From Cloudinary" />
      </Head>

      <CldCamera
        onShare={handleOnShare}
        context={{
          eventId,
        }}
      />

      <style global jsx>{`
        html,
        body {
          width: 100vw;
          height: 100vh;
          max-height: -webkit-fill-available;
          overflow: hidden;
        }
        #__next {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
}
