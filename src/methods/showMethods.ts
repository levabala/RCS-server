import { Command } from 'src/command';

import methods from '../methods';

export type ShowMethodsRequest = [];
export type ShowMethodsResponse = { methodNames: string[] };

const showMethods: Command<
  ShowMethodsRequest,
  ShowMethodsResponse
> = async args => ({
  methodNames: Object.keys(methods),
});

export default showMethods;
