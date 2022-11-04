import { isPromise } from 'util/types';

function handleError(error: unknown) {
  if (window.notify) {
    window.notify(
      `Sorry, got an error: ${(error as any).message || String(error)}`,
      {
        variant: 'error',
      }
    );
  } else {
    console.error('catch:', error);
  }
}
export function catchable<T extends Function>(func: T): T {
  return function (...args: any[]) {
    try {
      const res = func(...args);
      if (isPromise(res)) {
        return Promise.resolve()
          .then(res as any)
          .catch(handleError);
      } else {
        return res;
      }
    } catch (error) {
      handleError(error);
    }
  } as any;
}
