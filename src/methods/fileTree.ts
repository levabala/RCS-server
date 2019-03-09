import * as directoryTree from 'levabala_directory-tree';
import { Command } from 'src/command';

export interface DirectoryTree {
  path: string;
  name: string;
  size: number;
  type: 'directory' | 'file';
  children?: DirectoryTree[];
  extension?: string;
}

type Req = [string, number?];
type Res = DirectoryTree;

const fileTree: Command<Req, Res> = args => {
  let targetPath, depth;
  try {
    [targetPath, depth = Infinity] = args;
  } catch (e) {
    throw new Error('invalid args');
  }

  return directoryTree(targetPath, null, null, null, depth);
};

export default fileTree;
