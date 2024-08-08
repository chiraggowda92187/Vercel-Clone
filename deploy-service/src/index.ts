import { commandOptions, createClient } from "redis"
import { downloadAllFromS3 } from "./aws";
import { buildProject } from "./util";
import { uploadBuildDir } from "./file";



export const QueueName = 'buildQueueForDeployedProjects';
const deployRedisClient = createClient();
deployRedisClient.connect();

async function startDeployService(){
    while (1) {
        // Ideally the setInterval or setTimeout not to be used. So that it is instantly working
        // setTimeout(async ()=>{
            const project = await deployRedisClient.brPop(commandOptions({isolated : true}), QueueName, 0)
            // console.log(project);
            // console.log(`clonedReposFolder/output/${project?.element}`, "     ", `${project?.element}`);
            //@ts-ignore
            const projectId = project.element;
            // console.log(projectId)
            await downloadAllFromS3(`clonedReposFolder/output/${projectId}`, `${projectId}`);
            await buildProject(`${projectId}`)
            await new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve("")
                }, 5000)
            })
            await uploadBuildDir(`${projectId}`)
        // }, 5000)
        
    }
}

// downloadAllFromS3('clonedReposFolder/output/Kli977x23', 'Kli977x23');
// buildProject("kpxkeizJs");
startDeployService()