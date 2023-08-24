import { FC, ReactNode, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import * as serviceWorkerRegistration from '../serviceWorkerRegistration';
import { createCtx } from './utils';

interface PWAContext {
  showUpdateAvailable: boolean;
  reloadPageAndUpdatePWA: () => void;
}

const [usePWAContext, CtxProvider] = createCtx<PWAContext>();

const PWAContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const history = useHistory();
  const [showUpdateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setUpdateAvailable(true);
    setWaitingWorker(registration.waiting);
  };

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setUpdateAvailable(false);
    window.location.reload();
  };

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate });
  }, []);

  useEffect(() => {
    if (history) {
      return history.listen(() => {
        // check for sw updates on page change
        navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => reg.update()));
      });
    }
  }, [history]);

  const exposed = {
    showUpdateAvailable: showUpdateAvailable,
    reloadPageAndUpdatePWA: reloadPage,
  };

  return <CtxProvider value={exposed}>{children}</CtxProvider>;
};

export { usePWAContext, PWAContextProvider };
