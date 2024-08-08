import {S3} from "aws-sdk"

const s3client = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  endpoint: process.env.ENDPOINT,
});


export async function getObject(fileName : string){
    const file = await s3client
      .getObject({
        Bucket: 'vercel-clone-bucket',
        Key: fileName,
      })
      .promise();
    return file
}