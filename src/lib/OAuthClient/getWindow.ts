import {getWindowFeatures} from './getWindowFeatures';

/**
 * Opens separate window in the center of the screen
 */
export function getWindow(url: string, name?: string, size?: {width?: number; height?: number}) {
    return window.open(url, name, size ? getWindowFeatures(size) : undefined);
}
