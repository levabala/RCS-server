import * as http from 'http';

import { RequestType } from './network';
import { routerFunction } from './router';

const possibleRequests = Object.keys(RequestType).filter(
  key => !isNaN(Number(RequestType[key])),
);

console.log('--- start server ---');
console.log();
console.log('possible requests:');
console.log(possibleRequests.map(r => `  - ${r}`).join('\n'));

http.createServer(routerFunction).listen(5543);
