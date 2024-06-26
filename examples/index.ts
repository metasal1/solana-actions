import { serve } from '@hono/node-server';
import donate from './donate/route';
import jupiterSwap from './jupiter-swap/route';
import future from './future/route';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { serveStatic } from '@hono/node-server/serve-static'

const app = new OpenAPIHono();
app.use('/*', cors());

// <--Actions-->
app.route('/api/donate', donate);
app.route('/api/jupiter/swap', jupiterSwap);
app.route('/api/future/swap', future);
app.get('/actions.json', (c) => c.json({
  "rules": [
    {
      "pathPattern": "/swap/**",
      "apiPath": "https://actions.dialect.to/api/jupiter/swap/**"
    }
  ]
}))
// </--Actions-->

app.doc('/doc', {
  info: {
    title: 'An API',
    version: 'v1',
  },
  openapi: '3.1.0',
});

app.get(
  '/swagger-ui',
  swaggerUI({
    url: '/doc',
  }),
);

const port = 3000;
console.log(
  `Server is running on port ${port}
Visit http://localhost:${port}/swagger-ui to explore existing actions
Visit https://actions.dialect.to to unfurl action into a Blink
`,
);

serve({
  fetch: app.fetch,
  port,
});
