import { exec } from "child_process"
import { error } from "console"
import path from "path"
import { stdout } from "process"








export async function buildProject( id : string ){

    const buildPromise = new Promise((resolve)=>{
        const command = `cd ${path.join(__dirname, "../../clonedReposFolder/buildFolder/", `${id}`)} && npm install && npm run build`
        const executedCmd = exec(command)
        executedCmd.stdout?.on("data", (data)=>{
            console.log("Std out data : ", data)
        })
        executedCmd.stdout?.on("error", (err) => {
            console.log('Std out err : ', err);
        });
        executedCmd.on("close", ()=>{
            resolve("")
        })
    })
    await buildPromise
}



