import { S3Client, PutObjectCommand, S3ServiceException } from '@aws-sdk/client-s3';
import { arrayBuffer, buffer } from 'stream/consumers';

// Initialize the S3 client
const s3 = new S3Client();

// Function to upload a file to S3
export async function uploadFileToS3(file: File, fileName: string, userId: string): Promise<{key?:string, uploaded?:boolean}> {
  try {
    // Uploading files to the bucket
    const data = await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET, // The name of the bucket
      Key: `${userId}/${fileName}`, // The file will be saved as userId/originalFileName
      Body: Buffer.from(await file.arrayBuffer())
    }));

    const payload = {
      key : `${userId}/${fileName}`,
      uploaded: true
    }
    return payload

  } catch (error) {
    if (error instanceof S3ServiceException) {
      console.error("error uploading file", error)
      const payload = {
      uploaded: false
    }
    return payload

    } else {
      console.error("random error while uploading file", error)
      const payload = {
      uploaded: false
    }
    return payload
    }
  }
}
