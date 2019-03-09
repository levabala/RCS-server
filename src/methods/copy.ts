import * as fs from 'fs';
import { Command } from 'src/command';
import { promisify } from 'util';

const copyFileAsync = promisify(fs.copyFile);

export type CopyRequest = [string, string];
export type CopyResponse = { message: string };

const copy: Command<CopyRequest, CopyResponse> = args => {
  let targetPath, outputPath;
  try {
    [targetPath, outputPath] = args;
  } catch (e) {
    throw new Error('invalid args');
  }

  return copyFileAsync(targetPath, outputPath)
    .then(() => ({ message: 'done' }))
    .catch((e: Error) => ({ message: e.message }));
};

export default copy;
