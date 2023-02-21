import * as fs from 'fs';

export function isFileExists(path: string) {
  try {
    fs.statSync(path);
    return true;
  } catch (e) {
    return false;
  }
}
