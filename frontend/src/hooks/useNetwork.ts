import { useEffect, useState } from 'react';

export interface NetworkState {
  since?: string;
  offline: boolean;
}

function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>(() => {
    return {
      since: undefined,
      offline: !navigator.onLine,
    };
  });

  useEffect(() => {
    const handleOnline = () => {
      setState((prevState) => ({
        ...prevState,
        offline: !navigator.onLine,
        since: new Date().toISOString(),
      }));
    };
    const handleOffline = () => {
      setState((prevState) => ({
        ...prevState,
        offline: !navigator.onLine,
        since: new Date().toISOString(),
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return state;
}
export default useNetwork;
