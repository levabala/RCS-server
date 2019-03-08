export enum RequestType {
  FileTree = 'fileTree',
  ExecuteMethod = 'applyProcessor',
}

interface bodyTypes {
  [RequestType.FileTree]: { path: string };
  [RequestType.ExecuteMethod]: { processorName: string; args: string[] };
}

interface responseTypes {
  [RequestType.FileTree]: Array<{
    name: string;
    isDirectory: boolean;
    size: number;
  }>;
  [RequestType.ExecuteMethod]: string;
}

export type BodyType<T extends RequestType> = bodyTypes[T];
export type ResponseType<T extends RequestType> = responseTypes[T];

export interface Method {
  execute: (args: string[]) => Promise<string>;
  name: string;
  help: string;
}
