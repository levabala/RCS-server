import { expect } from 'chai';
import * as fs from 'fs';
import * as httpMock from 'node-mocks-http';

import { routerFunction } from '../router';
import { BodyType, RequestType } from '../types';

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

      const testData = fs.readdirSync(query.path).map(f => {
        const stat = fs.statSync(query.path + '/' + f);
        return { name: f, isDirectory: stat.isDirectory(), size: stat.size };
      });
      expect(data.join()).to.equal(testData.join());
    });
  });
});
