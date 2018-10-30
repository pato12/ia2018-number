import path from 'path';
import fs from 'fs';

const DATA_PATH = path.resolve(__dirname, '..', 'data');

const NUM_DATASET_ELEMENTS = 60000;
const NUM_TEST_ELEMENTS = 10;

const NUM_TRAIN_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TEST_ELEMENTS;

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
  const image = getImage();
  const labels = getLabels();

  const imageFilter = image.slice(0, NUM_DATASET_ELEMENTS * 28 * 28);
  const labelsFilter = labels.slice(0, NUM_DATASET_ELEMENTS * 10);

  const binaryImage = new Uint8Array(imageFilter.length);

  for (let i = 0; i < imageFilter.length; i++) {
    // if any byte of rgb have value, the new image will be have 1
    const pixelValue = imageFilter[i + 0] || imageFilter[i + 1] || imageFilter[i + 2];

    binaryImage[i] = pixelValue > 0 ? 1 : 0;
  }

  return {
    labels: labelsFilter,
    image: binaryImage,
  };
}

export function getLabels() {
  const file = 'train-labels-idx1-ubyte';
  const buffer = fs.readFileSync(path.resolve(DATA_PATH, file));

  const originalLabels = new Uint8Array(buffer).slice(8);
  const labels = new Uint8Array(originalLabels.length * 10);

  for (let i = 0; i < originalLabels.length; i++) {
    const arrayNumber = numberLabel(originalLabels[i]);

    for (let j = 0; j < arrayNumber.length; j++) {
      labels[i * 10 + j] = arrayNumber[j];
    }
  }

  return labels;
}

export function getImage() {
  const file = 'train-images-idx3-ubyte';
  const buffer = fs.readFileSync(path.resolve(DATA_PATH, file));

  return new Uint16Array(buffer).slice(16);
}

function numberLabel(number) {
  let base = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  base[number] = 1;

  return base;
}