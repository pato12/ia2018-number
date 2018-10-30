import express from 'express';
import bodyParser from 'body-parser';
import '@tensorflow/tfjs-node';

import { predicNumber } from './lib/predict';

const app = express();

app.use(bodyParser.json({ limit: '900kb' }));

app.post('/predecir', async (req, res) => {
  const { png } = req.body;
  const data = await predicNumber(png);

  res.json({ data });
});

app.use(express.static('public'));

app.listen(3000, function() {
  console.log('Listening on port 3000!');
});
