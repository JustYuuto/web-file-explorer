import { resolve } from 'path';

export function Error(code: string | null, nodeError: Error, options?: any) {
  const { status } = options;
  switch (code) {
    case 'ENOTDIR':
    case 'EPERM':
    case 'ENOENT':
      return FileSystemError(code, options.path, nodeError, status);
    case 'ERR_INVALID_ARG_VALUE':
      return InvalidArgError(options.arg, status);
    case null:
      return { error: options.error, status: status || 400 };
  }
}

export function InvalidArgError(arg: string, forWhat: string, status?: number) {
  return { error: `"${arg}" is not a valid argument for "${forWhat}"`, code: 'ERR_INVALID_ARG_VALUE', status: status || 400 };
}

export function FileSystemError(code: string, path: string, nodeError?: Error, status?: number) {
  let error; // eslint-disable-next-line indent
       if (code === 'ENOTDIR') error = 'Not a folder';
  else if (code === 'EPERM')   error = `Cannot access "${resolve(path)}"`;
  else if (code === 'ENOENT')  error = 'No such file or directory';
  else if (code === 'UNKNOWN') error = 'Unknown error';

  return error ? { error, code, status: status || 400, path } : nodeError;
}
