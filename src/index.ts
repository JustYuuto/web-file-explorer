import express = require('express');
import Log from '../utils/Log';
import * as fs from 'fs';
import { join, resolve } from 'path';
import { isFileExists } from '../utils/FileSystem';
import { Error, FileSystemError, InvalidArgError } from '../utils/Error';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.get('/api/files', (req, res) => {
  const path = req.query.path?.toString();
  if (!path) {
    res.status(400);
    res.send({ error: 'No path specified', status: 400 });
    return;
  }
  try {
    const files = fs.readdirSync(path.toString()).filter(f => isFileExists(join(path, f))).map(file => {
      const stat = fs.statSync(join(path, file));
      return {
        name: file, size: stat.size, modifiedAt: stat.mtime, lastAccessAt: stat.atime
      };
    });
    res.send(files);
  } catch (e: any) {
    res.status(400);
    res.send(FileSystemError(e.code, path, e));
  }
});

app.get('/api/file', (req, res) => {
  if (!req.query.path) {
    res.status(400);
    res.send({ error: 'No path specified', status: 400 });
    return;
  }
  const path = resolve(req.query.path?.toString());
  const encoding = req.query.encoding?.toString() || 'utf8';
  const contentType = req.query.content_type?.toString() || 'text/plain';
  try {
    try {
      res.status(200);
      if (!fs.statSync(path).isFile()) {
        res.contentType('application/json');
        res.send(FileSystemError('ENOENT', path));
      } else {
        res.contentType(contentType); // @ts-ignore
        res.send(fs.readFileSync(path, { encoding }).toString());
      }
    } catch (e: any) {
      res.status(400);
      res.contentType('application/json');
      res.send(InvalidArgError(encoding, 'encoding'));
    }
  } catch (e: any) {
    res.status(400);
    res.send(FileSystemError(e.code, path, e));
  }
});

app.post('/api/file', (req, res) => { // @ts-ignore
  const { path, content } = req.body;
  if (!path) {
    res.status(400); // @ts-ignore
    res.send(Error(null, null, { error: 'No path specified' }));
    return;
  }
  try {
    fs.writeFileSync(path, content || '');
    res.status(204);
    res.send();
  } catch (e: any) {
    res.status(400);
    res.send(FileSystemError(e.code, path, e));
  }
});

app.delete('/api/file', (req, res) => {
  const path = req.query.path?.toString();
  if (!path) {
    res.status(400);
    res.send({ error: 'No path specified', status: 400 });
    return;
  }
  try {
    fs[fs.statSync(path).isFile() ? 'rmSync' : 'rmdirSync'](path);
    res.status(204);
    res.send();
  } catch (e: any) {
    res.status(400);
    res.send(FileSystemError(e.code, path, e));
  }
});

app.listen(port, () => {
  Log.info(`Server started on http://localhost:${port}`);
});
