import * as tf from '@tensorflow/tfjs';
import path from 'path';
import fs from 'fs';

import { createModel } from './model';
import { getDataToTrain } from './data2';

const LEARNING_RATE = 0.15;
const TRAIN_BATCH_SIZE = 10;
const MODEL_PATH = path.resolve(__dirname, '..', 'model');

export async function getTrainedModel() {
  let model;

  if (fs.existsSync(path.resolve(MODEL_PATH, 'model.json'))) {
    model = await tf.loadModel(`file:///${MODEL_PATH}/model.json`);
  } else {
    model = createModel();
    const data = await getData();

    const optimizer = tf.train.sgd(LEARNING_RATE);

    model.compile({
      optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    const history = await model.fit(data.xs, data.labels, {
      batchSize: TRAIN_BATCH_SIZE,
      epochs: 1,
    });

    const loss = history.history.loss[0];
    const accuracy = history.history.acc[0];

    console.log('loss', loss);
    console.log('accuracy', accuracy);

    await model.save(`file:///${MODEL_PATH}`);
  }

  return model;
}

async function getData() {
  const { image, labels } = await getDataToTrain();

  const xs = tf.tensor4d(image, [image.length / (28 * 28), 28, 28, 1]);
  const labels2d = tf.tensor2d(labels, [labels.length / 10, 10]);

  return { xs, labels: labels2d };
}
