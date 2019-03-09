import { Command } from 'src/command';

import methods from '../methods';

type Req = [];
type Res = { methodNames: string[] };

const showMethods: Command<Req, Res> = async args => ({
  methodNames: Object.keys(methods),
});

export default showMethods;
