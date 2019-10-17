const cookie = require('cookie');

const cookieName = 'settings';

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

exports.handler = async (event, context) => {
  try {
    switch(event.httpMethod) {
      case 'GET':
        return {
          statusCode: 200,
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify( event.headers.cookie[cookieName] )
        };
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
