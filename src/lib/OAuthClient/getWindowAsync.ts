import {AbortError} from '../AbortError/AbortError';

import {getWindow} from './getWindow';

type GetWindowParameters = Parameters<typeof getWindow>;

export function getWindowAsync(
    url: GetWindowParameters[0],
    name: GetWindowParameters[1],
    size: GetWindowParameters[2],
    signal?: AbortSignal,
) {
    let timeoutId: number | undefined;

    return new Promise<Window>((resolve, reject) => {
        function cancel() {
            clearTimeout(timeoutId);
            reject(new AbortError('getWindowAsync: cancelled'));
        }

        timeoutId = window.setTimeout(() => {
            const window = getWindow(url, name, size);

            if (!window) {
                return reject(new Error('Failed to open window'));
            }

            resolve(window);
        }, 0);

        signal?.addEventListener('abort', cancel);
    });
}
