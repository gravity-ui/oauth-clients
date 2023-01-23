export function getUrl({
    host,
    clientId,
    redirectUri,
    state,
}: {
    host: string;
    clientId: string;
    redirectUri?: string;
    state?: string;
}) {
    const url = new URL('authorize', host);

    url.searchParams.set('client_id', clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('display', 'popup');

    if (state) {
        url.searchParams.set('state', state);
    }

    if (redirectUri) {
        url.searchParams.set('redirect_uri', redirectUri);
    }

    return url.toString();
}
