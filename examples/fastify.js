const fs = require('fs');
const path = require('path');
const fastify = require('fastify');

const isomorphicCookie = require('../dist/index');

const app = fastify({ logger: true });

app.register(require('fastify-cookie'));

let callIndex = 0;

app.get('/', (req, reply) => {
  callIndex++;

  app.log.info(`client cookie: ${isomorphicCookie.load('clientCookie', req)}`);
  app.log.info(`server cookie: ${isomorphicCookie.load('serverCookie', req)}`);

  isomorphicCookie.save('serverCookie', `serverCookie, call #: ${callIndex}`, { secure: false }, reply);

  const stream = fs.createReadStream(path.join(__dirname, 'index.html'));

  reply.type('text/html').send(stream);
});

app.listen(8000, error => {
  if (error) {
    app.log.error(error);
    process.exit(1);
  }
});