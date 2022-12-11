export interface Environment {
  API_URL: string;
  QR_CODE_URL: string;
  VERSION_NUMBER: string;
  VERSION_GIT_SHA: string;
  APP_SHORT_NAME?: string;
  APP_NAME: string;
}

const VITE_APP_API_URL = (): string => {
  if (import.meta.env.VITE_APP_API_URL === undefined) {
    throw Error('environment variable "VITE_APP_API_URL" must be set');
  }
  return import.meta.env.VITE_APP_API_URL;
};

const VITE_APP_QR_CODE_URL = (): string => {
  if (import.meta.env.VITE_APP_QR_CODE_URL === undefined) {
    throw Error('environment variable "VITE_APP_QR_CODE_URL" must be set');
  }
  return import.meta.env.VITE_APP_QR_CODE_URL;
};

const VITE_APP_VERSION_NUMBER = (): string => import.meta.env.VITE_APP_VERSION || '0.0.0';

const VITE_VERCEL_GIT_COMMIT_SHA = (): string => import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA || '-';

const VITE_APP_SHORT_NAME = (): string | undefined => import.meta.env.VITE_APP_SHORT_NAME;

const VITE_APP_NAME = (): string => import.meta.env.VITE_APP_NAME || 'My App';

const environment: Environment = {
  API_URL: VITE_APP_API_URL(),
  QR_CODE_URL: VITE_APP_QR_CODE_URL(),
  VERSION_NUMBER: VITE_APP_VERSION_NUMBER(),
  VERSION_GIT_SHA: VITE_VERCEL_GIT_COMMIT_SHA(),
  APP_SHORT_NAME: VITE_APP_SHORT_NAME(),
  APP_NAME: VITE_APP_NAME(),
};

export default environment;
