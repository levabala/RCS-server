import { Method } from 'src/types';

import methods from '.';

const help: Method = {
  execute: async args => {
    let targetMethod;
    try {
      [targetMethod] = args;
    } catch (e) {
      throw new Error('invalid args');
    }

    const method = methods[targetMethod];
    if (!method) throw new Error('no such method');

    return method.help;
  },
  help: 'just execute it without any args',
  name: 'showMethods',
};

export default help;
