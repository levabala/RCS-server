import * as fs from 'fs';
import * as http from 'http';
import { ParsedUrlQuery } from 'querystring';
import * as url from 'url';

import { BodyType, RequestType } from './network';

interface IRouteOutput {
  data: string | object;
  code: number;
}

const routes = {
  ['/' + RequestType.FileTree]: (query: ParsedUrlQuery): IRouteOutput => {
    try {
      const { path } = query as BodyType<RequestType.FileTree>;
      const files = fs.readdirSync(path);
      return { data: files, code: 200 };
    } catch (e) {
      return { data: (e as Error).message, code: 404 };
    }
  },
};

export function routerFunction(
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const q = url.parse(req.url, true);

  const route = routes[q.pathname];

  if (route) {
    const { code, data } = route(q.query);

    res.statusCode = code;
    res.write(JSON.stringify(data));
  } else res.write('RCS Server');

  res.end();
}
