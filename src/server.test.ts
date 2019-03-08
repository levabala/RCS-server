import { expect } from 'chai';
import * as fs from 'fs';
import * as httpMock from 'node-mocks-http';

import { routerFunction } from './router';
import { BodyType, RequestType } from './types';

describe('Requests', () => {
  describe('FileTree request', () => {
    it('returns valid file tree', async () => {
      const query: BodyType<RequestType.FileTree> = {
        path: './',
      };
      const strQuery = `${Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`;

      const req = httpMock.createRequest({
        url: `/${RequestType.FileTree}?${strQuery}`,
        method: 'POST',
      });

      const res = httpMock.createResponse();

      await routerFunction(req, res);

      const rawData = res._getData();
      const data = JSON.parse(rawData);

      const files = fs.readdirSync(query.path);
      expect(data.join()).to.equal(files.join());
    });
  });
});
