const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = fs.readFileSync('views/index.html', {encoding: 'utf-8'});
});

router.get('/app.js', (ctx) => {
  ctx.body = fs.readFileSync('views/app.js', {encoding: 'utf-8'});
});

router.get('/templates/app.html', (ctx) => {
  ctx.body = fs.readFileSync('templates/app.html', {encoding: 'utf-8'});
});


router.get('/nunjucks.min.js', (ctx) => {
  ctx.body = fs.readFileSync('vendor/nunjucks.min.js', {encoding: 'utf-8'});
})

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
