import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';

import * as gtag from '@lib/gtag';
import { AppProvider } from '@hooks/useApp';
import { CameraProvider } from '@hooks/useCamera';
import { DEFAULT_EVENT_ID } from '@data/events';

import '@styles/globals.scss';

// Analyics via https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/lib/gtag.js

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  // Event ID is made available as a page prop from
  // `src/pages/[eventId].js` to allow URL based
  // ID configuration

  const { eventId } = pageProps;

  let activeEventId = eventId;

  if (pathname === '/') {
    activeEventId = DEFAULT_EVENT_ID;
  }

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <AppProvider eventId={activeEventId}>
        <CameraProvider>
          <Component {...pageProps} />
        </CameraProvider>
      </AppProvider>
    </>
  );
}

export default MyApp;
