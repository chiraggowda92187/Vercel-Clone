import { createClient } from "redis";


const publisherRedisClient = createClient()
publisherRedisClient.connect();
export const QueueName = "buildQueueForDeployedProjects"



export async function insertToBuildQueue(publishId : string){
    try { 
        const response = publisherRedisClient.lPush(QueueName, publishId);
        console.log(response)
    } catch (error) {
        console.log("Error while publishing to the queue!", error)
    }
}