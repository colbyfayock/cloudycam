import { AppProvider } from '@hooks/useApp';
import { CameraProvider } from '@hooks/useCamera';

import '@styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <CameraProvider>
        <Component {...pageProps} />
      </CameraProvider>
    </AppProvider>
  );
}

export default MyApp;
