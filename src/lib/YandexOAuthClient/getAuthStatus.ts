import type {AuthError, FailureStatus, SuccessStatus} from './types';

export function getAuthStatus(href: string) {
    const url = new URL(href);

    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error') as AuthError | null;
    const errorDescription = url.searchParams.get('error_description');

    let authStatus: SuccessStatus | FailureStatus;

    if (error) {
        authStatus = {
            state,
            error,
            errorDescription: errorDescription as string,
        };
    } else if (code) {
        authStatus = {
            state,
            code,
        };
    } else {
        throw new TypeError('Wrong url');
    }

    return authStatus;
}
