import { Method } from 'src/types';

import copy from './copy';
import showMethods from './showMethods';

export default {
  copy,
  showMethods,
} as { [name: string]: Method };
