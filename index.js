const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');
const serveStatic = require('koa-static');

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = fs.readFileSync('views/index.html', { encoding: 'utf-8' });
});

app.use(serveStatic('static'));
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
