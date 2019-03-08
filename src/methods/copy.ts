import * as fs from 'fs';
import { Method } from 'src/types';
import { promisify } from 'util';

const copyFileAsync = promisify(fs.copyFile);

const copy: Method = {
  execute: args => {
    let targetPath, outputPath;
    try {
      [targetPath, outputPath] = args;
    } catch (e) {
      throw new Error('invalid args');
    }

    return copyFileAsync(targetPath, outputPath)
      .then(() => 'done')
      .catch(e => e.message);
  },
  name: 'copy',
  help: 'input args: [targetPath] [outputPath]',
};

export default copy;
