import * as express from 'express';
import Log from '../utils/Log';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/files', (req, res) => {

});

app.listen(port, () => {
  Log.info(`Server started on http://localhost:${port}`);
});
