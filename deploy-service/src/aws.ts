import S3 from "aws-sdk/clients/s3";
import { error } from "console";
import fs from "fs"
import path from "path";
import 'dotenv/config';




const s3client = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  endpoint: process.env.ENDPOINT,
});

//
export async function downloadAllFromS3(prefix : string, projectId:string){
    try {
        // const downloadedObject = await s3client.getObject({
        //     Bucket: 'vercel-clone-bucket',
        //     Key: prefix,
        // }).promise();
        // console.log(prefix, " inside the fun ", projectId)
        const objects = await s3client.listObjectsV2({
          Bucket: 'vercel-clone-bucket',
          Prefix : prefix
        }).promise();
        console.log(objects);   
        const promises = objects.Contents?.map(async (s3Object)=>{
            return new Promise(async (resolve)=>{
                if(!s3Object.Key){
                    resolve('');
                    return                     
                }
                const keyFilePath = s3Object.Key.slice(prefix.length + 1)
                const finalOutputPath = path.join(__dirname, "../../clonedReposFolder/buildFolder/", projectId, keyFilePath)
                const dirName = path.dirname(finalOutputPath)
                if(!fs.existsSync(dirName)){
                    fs.mkdirSync(dirName, {recursive : true})
                }
                const writeStream = fs.createWriteStream(finalOutputPath);
                console.log("before getting object")
                s3client
                  .getObject({
                    Bucket: 'vercel-clone-bucket',
                    Key: s3Object.Key,
                  }).on("success", (res)=>{
                    console.log(res)
                  })
                  .createReadStream()
                  .pipe(writeStream)
                  .on('finish', () => {
                    resolve('');
                  })
                  .on("error", (err)=>{
                    console.log(err)
                  });  
                  console.log('after getting object');
                })
            
        }) || []
        await Promise.all(promises?.filter(x=>x!==undefined))
        console.log("executed promises")
    } 
    catch (error) {
        console.log(error)
    }
}



export async function uploadFile(fileName: string, localFilePath: string) {
  // filename : How it should be stored ( file structure and where ) in R2 / S3 bucket 
  // localFilePath : local directory where the file is present
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3client
    .putObject({
      Body: fileContent, //body of the file
      Bucket: 'vercel-clone-bucket', // name of the bucket we intend to put it in
      Key: fileName, //name of the file (internally stored as a hashmap so we use key as the file name)
    })
    .promise();
  // console.log(response)
}