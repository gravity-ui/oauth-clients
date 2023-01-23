# YandexOAuthClient

Client for oauth.yandex.ru. See [OAuthClient](../OAuthClient/README.md) docs for basic usage of client.

## Usage

```ts
import {YandexOAuthClient} from '@gravity-ui/oauth-clients';

const client = new YandexOAuthClient({
  // Client ID of your app
  clientId: '...',
  // URL is not required, but without proper URL on same-origin we can't determine authorization status
  redirectUri: 'https://example.com/oauth-code-proxy',
});
```
