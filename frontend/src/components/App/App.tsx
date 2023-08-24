import { useEffect, useRef } from 'react';
import { ToastProvider } from '@agney/ir-toast';
import { IonApp, setupIonicReact } from '@ionic/react';
import { CSSTransition } from 'react-transition-group';

import LoadingBar from '~/components/LoadingBar';
import WaitingServerConnection from '~/pages/WaitingServerConnection';
import {
  addOfflineBanner,
  addUpdateAvailableBanner,
  getBannerColor,
  removeOfflineBanner,
  removeUpdateAvailableBanner,
  useBanner,
} from '~/redux/bannerSlice';
import { useAppDispatch } from '~/redux/hooks';
import { loadUser, useUser } from '~/redux/userSlice';
import Router from '~/router/Router';

import '~/theme/index.scss';

import Info from '~/components/Info';
import { usePWAContext } from '~/contexts/PWAContext';
import useNetwork from '~/hooks/useNetwork';
import classes from './App.module.scss';

setupIonicReact();

const App: React.FC = () => {
  const { showUpdateAvailable } = usePWAContext();
  const asyncUser = useUser();
  const dispatch = useAppDispatch();
  const banner = useBanner();
  const network = useNetwork();
  const nodeRef = useRef();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (network.offline) {
      dispatch(addOfflineBanner());
    } else {
      dispatch(removeOfflineBanner());
    }
  }, [dispatch, network.offline]);

  useEffect(() => {
    if (showUpdateAvailable) {
      dispatch(addUpdateAvailableBanner());
    } else {
      dispatch(removeUpdateAvailableBanner());
    }
  }, [dispatch, showUpdateAvailable]);

  return (
    <>
      <LoadingBar show={asyncUser.isLoading} />
      <CSSTransition nodeRef={nodeRef} mountOnEnter={true} unmountOnExit={true} in={banner.length > 0} timeout={200}>
        <div
          className={classes.banner}
          title={banner.length > 0 ? banner[0].explanation : undefined}
          style={{
            background: `var(${getBannerColor(banner)})`,
          }}
        >
          <Info infos={banner.length > 0 ? banner[0].explanation : undefined}>
            {banner.length > 0 ? banner.length > 0 && banner[0].message : undefined}
          </Info>
        </div>
      </CSSTransition>
      <IonApp className={classes.ion_app} style={{ top: banner.length > 0 ? '1.5rem' : '0' }}>
        <ToastProvider value={{ duration: 2000 }}>
          {asyncUser.isLoading ? <WaitingServerConnection /> : <Router />}
        </ToastProvider>
      </IonApp>
    </>
  );
};

export default App;
