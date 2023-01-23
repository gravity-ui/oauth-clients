import {getTimeout} from '../getTimeout';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('should resolve', async () => {
    const controller = new AbortController();
    const timeout = getTimeout(100, controller.signal);

    jest.advanceTimersByTime(100);

    await expect(timeout).resolves.toBe(undefined);
});

test('should cancel', async () => {
    const controller = new AbortController();
    const timeout = getTimeout(100, controller.signal);

    controller.abort();

    await expect(timeout).rejects.toThrowError('getTimeout: cancelled');
});
