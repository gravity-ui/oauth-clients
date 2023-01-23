export type AuthError = 'access_denied' | 'unauthorized_client';

interface BaseStatus {
    state: string | null;
}

export interface SuccessStatus extends BaseStatus {
    code: string;
}

export interface FailureStatus extends BaseStatus {
    error: string;
    errorDescription: string;
}
