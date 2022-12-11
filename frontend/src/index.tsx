import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/components/App';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { PWAContextProvider } from '@/contexts/PWAContext';

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
    </StrictMode>
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();
// DONE IN PWAContext

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
