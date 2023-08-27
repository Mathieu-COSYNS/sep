import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import App from '~/components/App';
import { PWAContextProvider } from '~/contexts/PWAContext';

// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  root.render(
    <StrictMode>
      <PWAContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PWAContextProvider>
    </StrictMode>,
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();
// DONE IN PWAContext
