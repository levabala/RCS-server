import { promises as fs } from 'fs';
import { Processor } from 'src/types';

const copyTo: Processor = {
  process: args => {
    const [targetPath, outputPath] = args;

    return fs
      .copyFile(targetPath, outputPath)
      .then(() => 'ok')
      .catch(() => 'error');
  },
  name: 'copyTo',
  help: 'input args: [targetPath] [outputPath]',
};

export default copyTo;
