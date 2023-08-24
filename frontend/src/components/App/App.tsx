import { useEffect, useRef } from 'react';
import { ToastProvider } from '@agney/ir-toast';
import { IonApp, setupIonicReact } from '@ionic/react';
import { CSSTransition } from 'react-transition-group';

import LoadingBar from '~/components/LoadingBar';
import WaitingServerConnection from '~/pages/WaitingServerConnection';
import { useAppDispatch } from '~/redux/hooks';
import { loadUser, useUser } from '~/redux/userSlice';
import Router from '~/router/Router';

import '~/theme/index.scss';

import Info from '~/components/Info';
import { usePWAContext } from '~/contexts/PWAContext';
import useNetwork from '~/hooks/useNetwork';
import { useBannerStore } from '~/store/bannerStore';
import classes from './App.module.scss';

setupIonicReact();

const App: React.FC = () => {
  const { showUpdateAvailable } = usePWAContext();
  const asyncUser = useUser();
  const dispatch = useAppDispatch();
  const { getBanner, addOfflineBanner, addUpdateAvailableBanner, removeOfflineBanner, removeUpdateAvailableBanner } =
    useBannerStore();
  const banner = getBanner();
  const network = useNetwork();
  const nodeRef = useRef();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (network.offline) {
      addOfflineBanner();
    } else {
      removeOfflineBanner();
    }
  }, [dispatch, network.offline]);

  useEffect(() => {
    if (showUpdateAvailable) {
      addUpdateAvailableBanner();
    } else {
      removeUpdateAvailableBanner();
    }
  }, [dispatch, showUpdateAvailable]);

  return (
    <>
      <LoadingBar show={asyncUser.isLoading} />
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
          {asyncUser.isLoading ? <WaitingServerConnection /> : <Router />}
        </ToastProvider>
      </IonApp>
    </>
  );
};

export default App;
