import { Method } from 'src/types';

import copy from './copy';
import help from './help';
import showMethods from './showMethods';

export default {
  copy,
  showMethods,
  help,
} as { [name: string]: Method };
