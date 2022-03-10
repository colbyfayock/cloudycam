import { CameraProvider } from '@hooks/useCamera';

import '@styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <CameraProvider>
      <Component {...pageProps} />
    </CameraProvider>
  );
}

export default MyApp
