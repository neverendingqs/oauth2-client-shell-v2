const _ = {
  get: require('lodash.get')
};
const cookie = require('cookie');

const cookieName = 'session';

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
          body: JSON.stringify(
            _.get(headers, `cookie.${cookieName}`, {})
          )
        };
      case 'POST':
        return {
          statusCode: 200,
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            'Set-Cookie': createCookie(body)
          },
          body: JSON.stringify({ [cookieName]: body })
        };
      default:
        return {
          statusCode: 501,
          body: `HTTP method ${httpMethod} not supported.`
        };
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
