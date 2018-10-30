import * as tf from '@tensorflow/tfjs';

import { getImageFromBase64 } from './png';
import { getTrainedModel } from './training';

export async function predicNumber(input) {
  const { image, width, height, base64 } = await getImageFromBase64(input);
  const model = await getTrainedModel();

  printNumber(image, width);

  const xs = tf.tensor4d(image, [1, width, height, 1]);

  const axis = 1;
  const output = model.predict(xs);

  const prediction = output.argMax(axis).dataSync()[0];
  const result = new Array(...output.dataSync()).map((acc, n) => ({ acc, n }))

  return {
    prediction,
    result,
    base64,
  };
}


function printNumber(pixels, width) {
  let text = '';

  for (let i = 0; i < pixels.length; i++) {
    text += (pixels[i] > 0 ? '#' : '.').toString();

    if (i % width === 0 && i !== 0) {
      console.log(text);
      text = '';
    }
  }
}
