import fs from 'fs/promises';
import path from 'path';

const dir = './input';
export const readJson = async () => {
  try {
    const files = await fs.readdir(dir);
    const file = files[0];

    let ext = path.extname(file).slice(1);

    let filePath = path.join(dir, file);
    try {
      if (ext !== 'json') throw new Error('File is not of type json');

      const fileContent = await fs.readFile(filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (e) {
      return console.error('Error while reading file: ', e);
    }
  } catch (e) {
    console.error('Error while reading directory: ', e);
  }
};
