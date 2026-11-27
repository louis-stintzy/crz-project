import sharp from 'sharp';
import { AppError } from '../../errors/AppError';

const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'webp']);

const MAX_DIMENSION = 512;

interface ProcessedProfilePicture {
  buffer: Buffer;
  contentType: 'image/webp';
}

export const processProfilePicture = async (
  input: Buffer
): Promise<ProcessedProfilePicture> => {
  try {
    const image = sharp(input, {
      limitInputPixels: 25_000_000,
      animated: false,
    });

    const metadata = await image.metadata();

    if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format)) {
      throw new AppError(400, 'Only JPEG, PNG and WebP images are allowed.');
    }

    const buffer = await image
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    return {
      buffer,
      contentType: 'image/webp',
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(400, 'Invalid or unsupported image.');
  }
};
