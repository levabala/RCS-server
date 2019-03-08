import { Processor } from 'src/types';

import copyTo from './copyTo';

export default {
  copyTo: copyTo,
} as { [name: string]: Processor };
