export enum CommandType {
  FileTree = 'fileTree',
  Copy = 'copy',
  Help = 'help',
  ShowMethods = 'showMethods',
}

type Req = Array<any>;
type Res = object;

export type Command<I extends Req, O extends Res> = (args: I) => Promise<O>;
export type CommandAbstract = (args: Req) => Promise<Res>;
