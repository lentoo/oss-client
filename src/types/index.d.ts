export interface IFile {
  _id?: string;
  env?: string;

  filename: string;

  isDir: boolean;

  mimetype: string;

  cstore_url: string;

  file_key: string;

  parent_id: string;

  editing?: boolean;

  file_size?: number;
}
