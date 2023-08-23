export class RequestStatusError extends Error {
  status: number;
  statusMessage: string;
  message: string;

  constructor(status: number, statusMessage: string, message: string) {
    super(message);
    this.status = status;
    this.statusMessage = statusMessage;
    this.message = message;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRequestStatusError = (object: any): object is RequestStatusError => {
  return (
    !!object &&
    typeof object === 'object' &&
    'status' in object &&
    'statusMessage' in object &&
    'message' in object &&
    typeof object.status === 'number' &&
    typeof object.statusMessage === 'string' &&
    typeof object.message === 'string'
  );
};
