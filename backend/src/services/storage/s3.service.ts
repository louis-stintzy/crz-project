import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../config/s3';
import { env } from '../../config/env';

interface UploadObjectParams {
  key: string;
  body: Buffer;
  contentType: string;
}

const uploadObject = async ({
  key,
  body,
  contentType,
}: UploadObjectParams): Promise<void> => {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
};

export const s3Service = {
  uploadObject,
};
