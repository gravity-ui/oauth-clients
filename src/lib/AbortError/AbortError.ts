export class AbortError extends Error {
    constructor(message: string) {
        super(message);

        this.name = 'AbortError';

        //https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, AbortError.prototype);

        Error.captureStackTrace?.(this, this.constructor);
    }
}
