import {nanoid} from 'nanoid';

import {OAuthClient} from '../OAuthClient';

import {getAuthStatus} from './getAuthStatus';
import {getUrl} from './getUrl';

interface Options {
    clientId: string;
    redirectUri?: string;
}

export class YandexOAuthClient extends OAuthClient<ReturnType<typeof getAuthStatus>> {
    protected readonly clientId: string;
    protected readonly redirectUri: string | undefined;
    protected readonly host: string = 'https://oauth.yandex.ru';
    protected readonly windowName: string = 'YandexOAuthCodeWindow';
    protected readonly windowSize: OAuthClient['windowSize'] = {
        // magic number, width at which oAuth got proper breakpoint
        width: 480,
        // magic number, height, when whole content available without scroll
        height: 600,
    };
    /** Random string */
    private state: string | null = null;

    constructor(options: Options) {
        super();

        this.clientId = options.clientId;

        if (!this.clientId) {
            throw new Error('YandexOAuthClient: clientId missing');
        }

        this.redirectUri = options.redirectUri;
    }

    protected getStatusFromHref(href: string) {
        return getAuthStatus(href);
    }

    protected getCodeFromStatus(status: ReturnType<typeof getAuthStatus>): string | undefined {
        if (!this.isCurrentState(status.state)) {
            throw new Error("YandexOAuthClient: request state and current state didn't match");
        }

        if ('code' in status) {
            return status.code;
        }

        if ('error' in status) {
            throw new Error(`YandexOAuthClient: ${status.error}: ${status.errorDescription}`);
        }

        return undefined;
    }

    private isCurrentState(state: string | null) {
        return state !== null && state === this.state;
    }

    protected get url() {
        this.state = nanoid(16);

        return getUrl({
            host: this.host,
            clientId: this.clientId,
            redirectUri: this.redirectUri,
            state: this.state,
        });
    }
}
