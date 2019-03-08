export enum RequestType {
  FileTree = 'fileTree',
  ApplyProcessor = 'applyProcessor',
}

interface bodyTypes {
  [RequestType.FileTree]: { path: string };
  [RequestType.ApplyProcessor]: { processorName: string; args: string[] };
}

interface responseTypes {
  [RequestType.FileTree]: Array<{
    name: string;
    isDirectory: boolean;
    size: number;
  }>;
  [RequestType.ApplyProcessor]: string;
}

export type BodyType<T extends RequestType> = bodyTypes[T];
export type ResponseType<T extends RequestType> = responseTypes[T];

export interface Method {
  execute: (args: string[]) => Promise<string>;
  name: string;
  help: string;
}
