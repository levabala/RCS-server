import * as fs from 'fs';
import * as http from 'http';
import { ParsedUrlQuery } from 'querystring';
import * as url from 'url';

import { BodyType, RequestType, ResponseType } from './types';

interface IRouteOutput<T extends RequestType> {
  data: ResponseType<T>;
  code: number;
}

const routes = {
  ['/' + RequestType.FileTree]: (
    query: ParsedUrlQuery,
  ): IRouteOutput<RequestType.FileTree> => {
    const { path } = query as BodyType<RequestType.FileTree>;
    const files = fs.readdirSync(path).map(f => {
      const stat = fs.statSync(f);
      return { name: f, isDirectory: stat.isDirectory(), size: stat.size };
    });
    return { data: files, code: 200 };
  },
};

export function routerFunction(
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  console.log('request', req.url);
  const q = url.parse(req.url, true);

  const route = routes[q.pathname];

  if (route)
    try {
      const { code, data } = route(q.query);
      res.writeHead(code, { 'Content-Type': 'application/json ' });
      res.write(JSON.stringify(data));
    } catch (e) {
      console.log(e);
      res.writeHead(404, { 'Content-Type': 'application/json ' });
      res.write(JSON.stringify((e as Error).message));
    }
  else res.write('RCS Server');

  res.end();
}
