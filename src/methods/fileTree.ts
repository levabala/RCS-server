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

export type FileTreeRequest = [string, number?];
export type FileTreeResponse = DirectoryTree;

const fileTree: Command<FileTreeRequest, FileTreeResponse> = args => {
  let targetPath, depth;
  try {
    [targetPath, depth = Infinity] = args;
  } catch (e) {
    throw new Error('invalid args');
  }

  return directoryTree(targetPath, null, null, null, depth);
};

export default fileTree;
