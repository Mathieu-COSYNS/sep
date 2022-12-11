import { isRequestStatusError } from '@/types/RequestStatusError';

export const serializeError = (e: unknown): string => {
  if (isRequestStatusError(e)) {
    return e.message;
  } else if (e instanceof Error) {
    return e.toString();
  } else {
    return JSON.stringify(e);
  }
};
