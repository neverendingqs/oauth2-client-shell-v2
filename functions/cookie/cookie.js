const cookie = require('cookie');

const cookieName = 'settings';

exports.handler = async (event, context) => {
  function tryParseJson(stringified) {
    try {
      return JSON.parse(stringified);
    } catch {
      return {};
    }
  }

  function createCookie(cookieObj) {
    return cookie.serialize(
      cookieName,
      JSON.stringify(cookieObj),
      {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 14,
        sameSite: 'strict',
        secure: true
      }
    );
  }

  function createResponse(cookieObj) {
    const cookieStr = createCookie(cookieObj);

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': cookieStr,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cookieObj[cookieName]) || '{}'
    };
  }

  try {
    switch(event.httpMethod) {
      case 'GET':
        return createResponse(event.headers.cookie);
      case 'POST':
        return createResponse(tryParseJson(event.body));
      default:
        return {
          statusCode: 501,
          body: `HTTP method ${event.httpMethod} not supported.`
          // // more keys you can return:
          // headers: { "headerName": "headerValue", ... },
          // isBase64Encoded: true,
        };
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
