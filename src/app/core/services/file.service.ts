import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  isFileImage(file: File) {
    return file && file.type.split('/')[0] === 'image';
  }
}
