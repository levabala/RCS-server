import * as fs from 'fs';
import * as http from 'http';
import { ParsedUrlQuery } from 'querystring';
import * as url from 'url';
import { promisify } from 'util';

import methods from './methods';
import { BodyType, RequestType, ResponseType } from './types';

interface IRouteOutput<T extends RequestType> {
  data: ResponseType<T>;
  code: number;
}

const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

const routes = {
  ['/' + RequestType.FileTree]: async (
    query: ParsedUrlQuery,
  ): Promise<IRouteOutput<RequestType.FileTree>> => {
    const { path } = query as BodyType<RequestType.FileTree>;
    const pr = readdirAsync(path).then(files =>
      Promise.all(
        files.map(async f => {
          const stat = await statAsync(`${path}/${f}`);
          return { name: f, isDirectory: stat.isDirectory(), size: stat.size };
        }),
      ),
    );

    const files = await pr;

    return { data: files, code: 200 };
  },
  ['/' + RequestType.ExecuteMethod]: async (
    query: ParsedUrlQuery,
  ): Promise<IRouteOutput<RequestType.ExecuteMethod>> => {
    const { processorName: methodName, args } = query as BodyType<
      RequestType.ExecuteMethod
    >;
    const method = methods[methodName];

    if (!method) throw new Error('no such processor');

    return method.execute(args).then(res => ({ data: res, code: 200 }));
  },
};

export async function routerFunction(
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const q = url.parse(req.url, true);

  console.log('request:', q.pathname, 'query:', q.query);

  const route = routes[q.pathname];

  if (route)
    try {
      const { code, data } = await route(q.query);
      res.writeHead(code, { 'Content-Type': 'application/json ' });
      res.write(JSON.stringify(data));
    } catch (e) {
      res.statusMessage = (e as Error).message;
      res.statusCode = 400;
    }
  else res.write('RCS Server');

  res.end();
}
