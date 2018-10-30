import { PNG } from 'pngjs';
import Jimp from 'jimp';

export async function getImageFromBase64(input) {
  const image = await getTrimedPng(input);
  const binaryImage = new Uint8Array(image.data.length / 4);

  for (let i = 0; i < image.data.length; i += 4) {
    // if any byte of rgb have value, the new image will be have 1
    const pixelValue = image.data[i + 0] || image.data[i + 1] || image.data[i + 2] || image.data[i + 3];

    binaryImage[i / 4] = pixelValue > 0 ? 1 : 0;
  }

  const base64 = PNG.sync.write(image).toString('base64');

  return {
    image: binaryImage,
    width: image.width,
    height: image.height,
    base64,
  };
}

async function getTrimedPng(input) {
  const jimp = await Jimp.read(Buffer.from(input.replace(/^data:image\/png;base64,/, ''), 'base64'));
  const image = jimp.autocrop().resize(20, 20).grayscale().contrast(1).posterize(2);
  const newImage = await Jimp.create(28, 28);
  const buff = await newImage.composite(image, 4, 4).getBufferAsync(Jimp.MIME_PNG);

  return PNG.sync.read(buff);
}
