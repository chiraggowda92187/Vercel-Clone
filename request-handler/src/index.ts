import express from "express"
import { getObject } from "./aws"
import 'dotenv/config';

const app = express()



app.get("/:projectId/*", async (req, res)=>{
    try {
        const projectId = req.params.projectId;
        const originalFilePath = req.path
        const modifiedFilePath = req.path.slice(projectId.length + 2);
        // console.log(projectId)
        // console.log(filePath)
        // console.log(filePath.slice(projectId.length + 2))
        const newFilePath = originalFilePath.startsWith(`${projectId}`) ? modifiedFilePath : `${projectId}/${originalFilePath}` 
        const objectContent = await getObject(
          `builtDirs/${projectId}/${filePath}`
        );
        const type = filePath.endsWith('html') ? 'text/html' : `/${filePath}`;
        res.set('Content-Type', type);
        console.log(objectContent);
        return res.send(objectContent.Body);
    } catch (error) {
        console.log(error)
    }
})





app.listen(3001, ()=>{
    console.log("Request Handler Server is listening on port 3001")
})