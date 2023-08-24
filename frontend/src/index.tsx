import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Provider } from 'react-redux';

import App from '~/components/App';
import { PWAContextProvider } from '~/contexts/PWAContext';
import { store } from '~/redux/store';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <PWAContextProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </PWAContextProvider>
    </StrictMode>,
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();
// DONE IN PWAContext
