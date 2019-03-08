import { Method } from 'src/types';

import methods from '.';

const showMethods: Method = {
  execute: async () => Object.keys(methods).join('\n'),
  help: 'just execute it without any args',
  name: 'showMethods',
};

export default showMethods;
