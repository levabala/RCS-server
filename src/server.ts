import * as http from 'http';

import { routerFunction } from './router';

console.log('--- start server ---');

http.createServer(routerFunction).listen(5543);
