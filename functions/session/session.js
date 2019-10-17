const _ = {
  get: require('lodash.get')
};
const cookie = require('cookie');

const cookieName = 'session';

function tryParseJson(stringified) {
  try {
    return JSON.parse(stringified);
  } catch(err) {
    return {};
  }
}

function createCookie(cookieStr) {
  return cookie.serialize(
    cookieName,
    cookieStr,
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
  const { body, headers, httpMethod } = event;
  try {
    switch(httpMethod) {
      case 'GET':
        return {
          statusCode: 200,
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
          },
          body: cookie.parse(headers.cookie)[cookieName] || '{}'
        };
      case 'POST':
        return {
          statusCode: 200,
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            'Set-Cookie': createCookie(body)
          },
          body: JSON.stringify({ [cookieName]: tryParseJson(body) })
        };
      default:
        return {
          statusCode: 501,
          body: `HTTP method ${httpMethod} not supported.`
        };
    }
  } catch(err) {
    return { statusCode: 500, body: err.toString() + JSON.stringify(headers.cookie) };
  }
}
