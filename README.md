# oauth2-client-shell-v2

Interface for going through the OAuth 2.0 authorization code grant flow as per
[RFC 6749 section 4](https://tools.ietf.org/html/rfc6749#section-4). Uses local
and session storage to store state. This is a refresh of
[oauth2-client-shell](https://github.com/neverendingqs/oauth2-client-shell).

## Running a Local Version

The local version uses a self-signed SSL certificate from
[openssl-self-signed-certificate](https://www.npmjs.com/package/openssl-self-signed-certificate).

```sh
# Install npm dependencies
npm i

# Build the site
npm run build

# Start the site
npm run start
```
