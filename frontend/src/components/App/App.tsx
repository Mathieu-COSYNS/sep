import { lazy, Suspense, useEffect, useRef } from 'react';
import { ToastProvider } from '@agney/ir-toast';
import { IonApp, setupIonicReact } from '@ionic/react';
import { CSSTransition } from 'react-transition-group';

import LoadingBar from '~/components/LoadingBar';
import ServerConnection from '~/pages/ServerConnection';

import '~/theme/index.scss';

import Info from '~/components/Info';
import { usePWAContext } from '~/contexts/PWAContext';
import { useAuth } from '~/hooks/useAuth';
import useNetwork from '~/hooks/useNetwork';
import { useBannerStore } from '~/store/bannerStore';
import classes from './App.module.scss';

setupIonicReact();

const Router = lazy(() => import('~/router/Router'));

const App: React.FC = () => {
  const { showUpdateAvailable } = usePWAContext();
  const { isLoading, error } = useAuth();
  const { getBanner, addOfflineBanner, addUpdateAvailableBanner, removeOfflineBanner, removeUpdateAvailableBanner } =
    useBannerStore();
  const banner = getBanner();
  const network = useNetwork();
  const nodeRef = useRef();

  useEffect(() => {
    if (network.offline) {
      addOfflineBanner();
    } else {
      removeOfflineBanner();
    }
  }, [addOfflineBanner, network.offline, removeOfflineBanner]);

  useEffect(() => {
    if (showUpdateAvailable) {
      addUpdateAvailableBanner();
    } else {
      removeUpdateAvailableBanner();
    }
  }, [addUpdateAvailableBanner, removeUpdateAvailableBanner, showUpdateAvailable]);

  console.log({ error });

  return (
    <>
      <LoadingBar show={isLoading} />
      <CSSTransition nodeRef={nodeRef} mountOnEnter={true} unmountOnExit={true} in={!!banner} timeout={200}>
        <div
          className={classes.banner}
          title={banner?.explanation}
          style={{
            backgroundColor: banner?.backgroundColor,
          }}
        >
          <Info infos={banner?.explanation}>{banner?.message}</Info>
        </div>
      </CSSTransition>
      <IonApp className={classes.ion_app} style={{ top: banner ? '1.5rem' : '0' }}>
        <ToastProvider value={{ duration: 2000 }}>
          <Suspense fallback={<ServerConnection />}>
            {isLoading || error ? <ServerConnection status={error ? 'failed' : 'waiting'} /> : <Router />}
          </Suspense>
        </ToastProvider>
      </IonApp>
    </>
  );
};

export default App;
