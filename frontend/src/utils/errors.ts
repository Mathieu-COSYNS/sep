import { isRequestStatusError } from '~/types/RequestStatusError';

export const serializeError = (e: unknown): string => {
  if (isRequestStatusError(e)) {
    return e.message;
  } else if (!!e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') {
    return e.message;
  } else if (e instanceof Error) {
    return e.toString();
  } else if (typeof e === 'string') {
    return e;
  } else {
    return JSON.stringify(e);
  }
};
