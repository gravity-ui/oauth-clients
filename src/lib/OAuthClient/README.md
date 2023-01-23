# OAuthClient

Abstract client for OAuth API. This class provides base methods for opening popup and polling it state. By default,
popup with OAuth API confirmation is centered relative to user screen.

## Usage

```ts
import {OAuthClient} from '@gravity-ui/oauth-clients';

// Type for generic of returned status after href parsing
type MyStatus = string;

class MyClient extends OAuthClient<MyStatus> {
  // Unique name for window.open
  protected readonly windowName = 'ExampleComOAuthWinfow';
  // Window sizes
  protected readonly windowSize = {
    // If width is not proided then window will not be aligned horizontally
    width: 100,
    // If height is not proided then window will not be aligned vertically
    height: 100,
  };

  // Url to use in window.open
  protected get url() {
    return 'https://oauth.example.com';
  }

  // Do something to determine current status
  // This method runs each 200ms
  // If something went wrong with url it's OK to throw Error in this method
  protected getStatusFromHref(href: string): MyStatus {
    return '...';
  }

  // Handles result from `getStatusFromHref`
  // This method should return oAuth code
  // If this method throw Error, this will abort whole authorization flow
  protected getCodeFromStatus(status: MyStatus) {
    if (status === 'ok') {
      return 'code';
    }

    throw new Error('Something went wrong');
  }
}

const client = new MyClient();

client.authorize().then((code) => {
  console.log(code);
});

// You can abort authorization any time with client destroy
// Opened window will be closed
client.destroy();
```
