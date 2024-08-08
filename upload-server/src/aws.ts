import { S3 } from "aws-sdk"
import fs from "fs"

const s3client = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  endpoint: process.env.ENDPOINT,
});



export async function uploadFile(fileName : string, localFilePath : string){
    const fileContent = fs.readFileSync(localFilePath)
    const response = await s3client.putObject({
      Body: fileContent, //body of the file
      Bucket: 'vercel-clone-bucket', // name of the bucket we intend to put it in
      Key: fileName, //name of the file (internally stored as a hashmap so we use key as the file name)
    }).promise();
    // console.log(response)
}