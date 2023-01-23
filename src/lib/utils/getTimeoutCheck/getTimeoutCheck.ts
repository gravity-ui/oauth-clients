export function getTimeoutCheck(timeout: number) {
    if (timeout <= 0) {
        throw new RangeError('timeout should be greater than 0');
    }

    const startTime = Date.now();

    return function isExceed() {
        return Date.now() - startTime > timeout;
    };
}
