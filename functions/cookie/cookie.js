const cookie = require('cookie');

const cookieName = 'settings';

exports.handler = async (event, context) => {
  try {
    switch(event.httpMethod) {
      case 'GET':
        return {
          statusCode: 200,
          body: JSON.stringify({ cookie: event.headers.cookie })
          // // more keys you can return:
          // headers: { "headerName": "headerValue", ... },
          // isBase64Encoded: true,
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
