import * as http from 'http';
import * as url from 'url';

import { CommandAbstract } from './command';
import methods from './methods';

const routes: { [name: string]: CommandAbstract } = Object.entries(
  methods,
).reduce((acc, [name, method]) => {
  acc[`/${name}`] = method;
  return acc;
}, {});

export async function routerFunction(
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const q = url.parse(req.url, true);

  console.log('request:', q.pathname, 'query:', q.query);

  const route = routes[q.pathname];
                                                                                
  if (route)
    try {
      const args = Object.values(q.query);
      const output = await route(args);
      res.writeHead(200, { 'Content-Type': 'application/json ', 'Access-Control-Allow-Origin': 'http://159.93.101.156:3000' });
      res.write(JSON.stringify(output));
    } catch (e) {
      res.statusMessage = (e as Error).message;
      res.statusCode = 400;
    }
  else {
    res.statusMessage = 'no such command';
    res.statusCode = 400;
  }

  res.end();
}
