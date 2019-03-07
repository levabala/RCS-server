export enum RequestType {
  FileTree = 'fileTree',
}

interface bodyTypes {
  [RequestType.FileTree]: { path: string };
}

interface responseTypes {
  [RequestType.FileTree]: Array<{
    name: string;
    isDirectory: boolean;
    size: number;
  }>;
}

export type BodyType<T extends RequestType> = bodyTypes[T];
export type ResponseType<T extends RequestType> = responseTypes[T];
