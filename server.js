const serverless = require('serverless-http');
const next = require('next');
const Koa = require('koa');
const Router = require('@koa/router');
const AccessLog = require('koa-accesslog');

const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = new Koa();
const router = new Router();

server.use(async (ctx, next) => {
  if (ctx.request.path.match(/.+\/$/)) {
    ctx.status = 308;
    ctx.redirect(`${ctx.request.path.replace(/\/+$/, '')}${ctx.request.search}`);
  } else {
    ctx.res.statusCode = 200;
    ctx.set('Cache-Control', 'no-store');
    await next();
  }
});

server.use(AccessLog());

router.all("*", async ctx => {
  await handle(ctx.req, ctx.res);
  ctx.response = false;
});

server.use(router.routes());
server.use(router.allowedMethods());

if (!process.env.SERVERLESS) {
  app.prepare().then(() => {
    server.listen(port, () => {
      console.log(`Listening: ${port}`);
    });
  });
}

module.exports.server = server;

// binary mode
// https://github.com/dougmoscrop/serverless-http/blob/master/docs/ADVANCED.md#binary-mode
const handler = serverless(server, {
  binary: [
    'application/javascript',
    'application/json',
    'application/octet-stream',
    'application/xml',
    'font/eot',
    'font/opentype',
    'font/otf',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'text/comma-separated-values',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/text',
    'text/xml',
  ],
});

module.exports.handler = (event, context) => {
  // decode query params for ALB
  // Node.js 12.x에서 Object.fromEntries 사용 가능함
  if (event.requestContext && event.requestContext.elb) {
    const params = Object.fromEntries(
      Object.entries(event.queryStringParameters)
        .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
    );
    event.queryStringParameters = params;
  }
  return handler(event, context);
};
