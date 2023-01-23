// https://developer.mozilla.org/en-US/docs/Web/API/Window/open
export interface WindowFeatures {
    popup?: true | '' | 'yes' | '1';
    /** 100 or more */
    width?: number;
    /** 100 or more, alias for `width` */
    innerWidth?: number;
    /** 100 or more */
    height?: number;
    /** 100 or more, alias for `height` */
    innerHeight?: number;
    left?: number;
    /** alias for `left` */
    screenX?: number;
    top?: number;
    /** alias for `top` */
    screenY?: number;
    noopener?: '';
    noreferrer?: '';
}
