export class TimeoutError extends Error {
    constructor(message: string, timeout?: number) {
        super(message);

        this.name = 'TimeoutError';
        if (typeof timeout === 'number') {
            this.message = `${this.message} (waited ${timeout}ms)`;
        }

        //https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, TimeoutError.prototype);

        Error.captureStackTrace?.(this, this.constructor);
    }
}
