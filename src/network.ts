export enum RequestType {
  FileTree = 'fileTree',
}

interface bodyTypes {
  [RequestType.FileTree]: { path: string };
}

export type BodyType<T extends RequestType> = bodyTypes[T];
