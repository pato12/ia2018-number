import { PNG } from 'pngjs';
import rp from 'request-promise';

const MNIST_IMAGES_SPRITE_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
const MNIST_LABELS_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

const NUM_DATASET_ELEMENTS = 10;
const NUM_TRAIN_ELEMENTS = 10;

export async function getDataToTrain() {
  const { image, labels } = await getData();

  const labelsFilter = labels.slice(0, NUM_TRAIN_ELEMENTS * 10);
  const imageFilter = image.slice(0, NUM_TRAIN_ELEMENTS * 28 * 28);

  return {
    labels: labelsFilter,
    image: imageFilter,
  };
}

export async function getDataToTest() {
  const { image, labels } = await getData();

  const labelsFilter = labels.slice(NUM_TRAIN_ELEMENTS * 10);
  const imageFilter = image.slice(NUM_TRAIN_ELEMENTS * 28 * 28);

  return {
    labels: labelsFilter,
    image: imageFilter,
  };
}

export async function getData() {
  const [image, labels] = await Promise.all([getImage(), getLabels()]);
  const length = Math.min(image.data.length, NUM_DATASET_ELEMENTS * 28 * 28 * 4);
  const binaryImage = new Int32Array(length / 4);

  for (let i = 0; i < length; i += 4) {
    // if any byte of rgb have value, the new image will be have 1
    const pixelValue = image.data[i + 0] || image.data[i + 1] || image.data[i + 2];

    binaryImage[i / 4] = pixelValue > 0 ? 1 : 0;
  }

  return {
    labels,
    image: binaryImage,
  };
}

async function getLabels() {
  const response = await rp.get(MNIST_LABELS_PATH, { encoding: null });
  return new Uint8Array(response);
}

async function getImage() {
  const png = new PNG();
  const response = await rp.get(MNIST_IMAGES_SPRITE_PATH, { encoding: null });

  return new Promise((resolve, reject) => png.parse(response, (err, data) => err ? reject(err) : resolve(data)));
}