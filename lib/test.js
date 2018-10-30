import * as tf from '@tensorflow/tfjs';

import { getDataToTest } from './data2';
import { getTrainedModel } from './training';

export async function main() {
  const data = await getData();
  const model = await getTrainedModel();

  tf.tidy(() => {
    const axis = 1;
    const output = model.predict(data.xs);

    const labels = Array.from(data.labels.argMax(axis).dataSync());
    const predictions = Array.from(output.argMax(axis).dataSync());

    printNumber(data.xs.dataSync(), labels, predictions);
  });
}


function printNumber(pixels, labels = null, predictions = null) {
  let text = '';

  for (let i = 0; i < pixels.length; i++) {
    text += (pixels[i] > 0 ? '#' : '.').toString();

    if (i % (28 * 28) === 0 && labels !== null && predictions !== null) {
      const index = i / (28 * 28);

      console.log('');
      console.log('label:', labels[index]);
      console.log('pred:', predictions[index]);
    }

    if (i % 28 === 0 && i !== 0) {
      console.log(text);
      text = '';
    }
  }
}

async function getData() {
  const { image, labels } = await getDataToTest();

  const xs = tf.tensor4d(image, [image.length / (28 * 28), 28, 28, 1]);
  const labels2d = tf.tensor2d(labels, [labels.length / 10, 10]);

  return { xs, labels: labels2d };
}
