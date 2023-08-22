import {AbortError} from '../AbortError/AbortError';
import {TimeoutError} from '../TimeoutError/TimeoutError';
import {getTimeout} from '../utils/getTimeout/getTimeout';
import {getTimeoutCheck} from '../utils/getTimeoutCheck/getTimeoutCheck';

import {getWindowAsync} from './getWindowAsync';

export abstract class OAuthClient<T = unknown> {
    protected abstract readonly windowName: string;
    protected abstract readonly windowSize: {width?: number; height?: number};
    protected readonly timeout = 60 * 1000;
    private abortController: AbortController | null = null;

    destroy() {
        this.stopPolling();
    }

    protected abstract getStatusFromHref(href: string): T;

    protected abstract getCodeFromStatus(status: T): string | undefined;

    /**
     * Resolves auth code for user
     */
    async authorize() {
        this.createController();

        const oAuthWindow = await getWindowAsync(
            this.url,
            this.windowName,
            this.windowSize,
            this.abortController?.signal,
        );

        return this.pollWindow(oAuthWindow).finally(() => {
            try {
                this.stopPolling();
                oAuthWindow.close();
            } catch {}
        });
    }

    private async pollWindow(oAuthWindow: Window) {
        if (!this.abortController) {
            throw new Error('BaseOAuthClient: controller is not created');
        }

        const timeIsExceed = getTimeoutCheck(this.timeout);
        let code: string | undefined;

        while (!code) {
            if (oAuthWindow.closed) {
                throw new AbortError('BaseOAuthClient: window closed');
            }

            // TODO use this.abortController.signal.throwIfAborted(); after update to Node>=17.3.0
            if (this.abortController.signal.aborted) {
                throw new AbortError('BaseOAuthClient: client destroyed');
            }

            if (timeIsExceed()) {
                throw new TimeoutError(`BaseOAuthClient: not authorised`, this.timeout);
            }

            let href;
            try {
                href = oAuthWindow.location.href;
            } catch {}

            if (!href) {
                await getTimeout(200, this.abortController.signal);
                continue;
            }

            let status;
            try {
                status = this.getStatusFromHref(href);
            } catch {
                await getTimeout(200, this.abortController.signal);
                continue;
            }

            code = this.getCodeFromStatus(status);
        }

        return code;
    }

    private createController() {
        this.stopPolling();
        this.abortController = new AbortController();
    }

    private stopPolling() {
        this.abortController?.abort();
        this.abortController = null;
    }

    protected abstract get url(): string;
}
