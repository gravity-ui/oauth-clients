import {WindowFeatures} from '../../types/dom';

export function getWindowFeatures(features: WindowFeatures) {
    const centeredWindow = {
        ...features,
    };

    if (features.width && features.left === undefined) {
        centeredWindow.left = Math.ceil((window.screen.width - features.width) / 2);
    }

    if (features.height && features.top === undefined) {
        centeredWindow.top = Math.ceil((window.screen.height - features.height) / 2);
    }

    return Object.entries(centeredWindow).reduce((windowFeatures, [key, value], i) => {
        const separator = i > 0 ? ',' : '';

        if (['width', 'innerWidth', 'height', 'innerHeight'].includes(key) && value < 100) {
            throw new RangeError(`${key} should be more or equal 100`);
        }

        return `${windowFeatures}${separator}${key}=${value}`;
    }, '');
}
