import Koa from 'koa';
import Router from '@koa/router';
import fs from 'fs';
import serve from 'koa-static';

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = fs.readFileSync('views/index.html', { encoding: 'utf-8' });
});

app.use(serve('static'));
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
