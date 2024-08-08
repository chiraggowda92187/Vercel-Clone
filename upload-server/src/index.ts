import express from "express"
import cors from "cors"
import {SimpleGit, simpleGit, SimpleGitOptions} from "simple-git"
import { generate } from "./util"
import { getAllPathsRecursive } from "./file"
import path = require("path")
import { uploadFile } from "./aws"
import { createClient } from "redis"
import { insertToBuildQueue } from "./redis"


const app = express()

export const PORT = process.env.PORT || 3000




app.use(express.json())
app.use(cors())



const options : Partial<SimpleGitOptions> = {
  baseDir : process.cwd(),
  binary : "git",
  maxConcurrentProcesses : 6,
  trimmed : false
}

const git : SimpleGit = simpleGit(options)


// console.log(path.join(__dirname, '../../clonedReposFolder/output'));
// uploadFile(
//   'clonedReposFolder/output/H3iVhtCU2/index.html'
//   , '../clonedReposFolder/output/H3iVhtCU2/index.htm/l');



// async function redisInitialize(){
//   const redisPublisherClient = createClient();
//   await redisPublisherClient.connect();

//   await redisPublisherClient.lPush("QueueForDeployProjectIds", "id1")
//   await redisPublisherClient.lPush('QueueForDeployProjectIds', 'id2');
//   await redisPublisherClient.lPush('QueueForDeployProjectIds', 'id3');
//   await redisPublisherClient.lPush('QueueForDeployProjectIds', 'id4');
//   let redisValue = await redisPublisherClient.rPop('QueueForDeployProjectIds');  
//   console.log(redisValue)

//   redisValue = await redisPublisherClient.rPop('QueueForDeployProjectIds');
//   console.log(redisValue);
  
//   redisValue = await redisPublisherClient.rPop('QueueForDeployProjectIds');
//   console.log(redisValue);
  
//   redisValue = await redisPublisherClient.rPop('QueueForDeployProjectIds');
//   console.log(redisValue);
// }
// redisInitialize()



app.post("/upload", async (req, res)=>{
    const url = req.body.repoUrl
    const generatedId = generate()
    await git.clone(
      url,
      path.join(__dirname, '../../clonedReposFolder/output', `${generatedId}`)
    );
    const filesPath = await getAllPathsRecursive({
      dir: path.join(__dirname, '../../clonedReposFolder/output', `${generatedId}`),
    });
    // console.log(filesPath);
      filesPath.map(async (file) => {
        // uploadFile(file.slice(__dirname.length))
        // console.log(__dirname.length);     // console.log(file)
        // console.log(__dirname)

        // Properly triming the file name so that there are no backward slashes else there will be ugly name and folder structure in the r2 bucket
        // console.log(file.slice(__dirname.length - 12).replaceAll('\\', '/'));

        // console.log(file.slice(__dirname.length - 18).replaceAll('\\', '/'));

        await uploadFile(
          file.slice(__dirname.length - 18).replaceAll('\\', '/'),
          file
        );
        // console.log('forst');
      });

    //Insert the id to the build queue
    // console.log("second")
    await new Promise((resolve) => setTimeout(resolve, 10000)); // this thing solves some weird bug where the redis actually pops the project id and starts to download but still there is nothing uploaded to r2 bucket
    insertToBuildQueue(generatedId);
    
    // For the frontend
    // todo add a status to indicate if the project has been properly copied to s3 
    return res.json({
      message: 'Url extracted',
      id: generatedId,
      url: url,
    });
})



app.listen(PORT, ()=>{
    console.log("Server Listening on port 3000...!")
})