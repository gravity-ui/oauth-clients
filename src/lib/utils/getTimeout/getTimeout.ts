import {AbortError} from '../../AbortError/AbortError';

/**
 * Returns promise, that would be resolved in given ms
 * Optionally could be canceled via second argument
 */
export function getTimeout(ms: number, signal?: AbortSignal) {
    let timeoutId: ReturnType<typeof setTimeout>;

    return new Promise<void>((resolve, reject) => {
        function cancel() {
            clearTimeout(timeoutId);
            reject(new AbortError('getTimeout: cancelled'));
        }

        timeoutId = setTimeout(() => {
            signal?.removeEventListener('abort', cancel);

            resolve();
        }, ms);

        signal?.addEventListener('abort', cancel);
    });
}
