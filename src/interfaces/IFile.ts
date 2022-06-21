'use strict';

export interface IFile {
  encoding: string;
  buffer: Buffer;
  filename: string;
  mimetype: string;
  originalname: string;
  size: number;
}
