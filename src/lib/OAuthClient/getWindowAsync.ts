import {getWindow} from './getWindow';

type GetWindowParameters = Parameters<typeof getWindow>;

export function getWindowAsync(...args: GetWindowParameters) {
    return new Promise<Window>((resolve, reject) => {
        window.setTimeout(() => {
            const window = getWindow(...args);

            if (!window) {
                return reject(new Error('Failed to open window'));
            }

            resolve(window);
        }, 0);
    });
}
