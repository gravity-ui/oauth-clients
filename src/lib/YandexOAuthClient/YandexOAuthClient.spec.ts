import {YandexOAuthClient} from './YandexOAuthClient';

const ogWindow = window.open;
const windowOpenMock = {
    install() {
        window.open = jest.fn();

        return window.open as jest.Mock;
    },

    uninstall() {
        window.open = ogWindow;
    },
};

const oAuthRandomString = '345';
jest.mock('nanoid', () => {
    const oAuthRandomString = '345';
    const nanoid = jest.requireActual('nanoid');

    return {
        __esModule: true,
        ...nanoid,
        nanoid: jest.fn().mockReturnValue(oAuthRandomString),
    };
});

test('should throw w/out `clientId`', () => {
    expect(() => new YandexOAuthClient({clientId: ''})).toThrow();
});

test('should handle window.open failure', () => {
    const windowOpen = windowOpenMock.install();
    windowOpen.mockReturnValue(null);

    const client = new YandexOAuthClient({
        clientId: '123',
    });

    expect(() => client.authorize()).toThrowError('OAuthClient: failed to open window');

    client.destroy();
});

test('should call destroy on completed authorization', async () => {
    const windowOpen = windowOpenMock.install();
    const windowCloseMock = jest.fn();
    windowOpen.mockReturnValue({
        location: {href: `http://localhost/?code=100500&state=${oAuthRandomString}`},
        close: windowCloseMock,
    });

    const client = new YandexOAuthClient({
        clientId: '123',
    });

    const authorization = client.authorize();

    await expect(authorization).resolves.toBe('100500');

    client.destroy();
});

test('should abort incomplete authorization', async () => {
    const windowOpen = windowOpenMock.install();
    const windowCloseMock = jest.fn();
    windowOpen.mockReturnValue({
        location: {href: ''},
        close: windowCloseMock,
    });

    const client = new YandexOAuthClient({
        clientId: '123',
    });

    const authorization = client.authorize();
    client.destroy();

    await expect(authorization).rejects.toThrowError('getTimeout: cancelled');
    expect(windowCloseMock).toHaveBeenCalled();
});

test('should throw when "state" not matching', async () => {
    const windowOpen = windowOpenMock.install();
    const windowCloseMock = jest.fn();
    windowOpen.mockReturnValue({
        location: {href: `http://localhost/?code=100500&state=foobar`},
        close: windowCloseMock,
    });

    const client = new YandexOAuthClient({
        clientId: '123',
    });

    const authorization = client.authorize();

    await expect(authorization).rejects.toThrowError(
        "YandexOAuthClient: request state and current state didn't match",
    );
});

test('should throw unauthorized results', async () => {
    const windowOpen = windowOpenMock.install();
    const windowCloseMock = jest.fn();
    windowOpen.mockReturnValue({
        location: {
            href: `http://localhost/?error=access_denied&error_description=foobar%20description&state=${oAuthRandomString}`,
        },
        close: windowCloseMock,
    });

    const client = new YandexOAuthClient({
        clientId: '123',
    });

    const authorization = client.authorize();

    await expect(authorization).rejects.toThrowError(
        'YandexOAuthClient: access_denied: foobar description',
    );
});
