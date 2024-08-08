import path, { dirname } from "path";
import fs from "fs"
import { uploadFile } from "./aws";










export async function uploadBuildDir(projectId : string){
    const dirName = path.join(__dirname, `../../clonedReposFolder/buildFolder/${projectId}`, "dist")
    const allFilePaths = getAllPathsRecursive({dir : dirName})
    allFilePaths.map(async (file)=>{
    //   console.log(file);
    //   D:\EXAM AND STUFF\CODING\100xdevs\Projects\Vercel-Clone\clonedReposFolder\buildFolder\dOiThMdUN\dist/assets/index-DiwrgTda.css
    //   console.log(file.slice(101));
    //   assets/index-DiwrgTda.css
      await uploadFile(`builtDirs/${projectId}/${file.slice(101)}`, file);
    })
}



function getAllPathsRecursive({ dir }: { dir: string }) {
  let filesPath: string[] = [];
  try {
    const files =  fs.readdirSync(dir);
    files.forEach((mainFile) => {
      if (fs.statSync(`${dir}/${mainFile}`).isDirectory()) {
        const files = getAllPathsRecursive({ dir: `${dir}/${mainFile}` });
        files.forEach((file) => {
          filesPath.push(`${file}`);
        });
      } else {
        filesPath.push(`${dir}/${mainFile}`);
      }
    });
    // console.log(filesPath)
  } catch (error) {
    console.log('Error while reading files path');
    console.log(error);
  }
  return filesPath;
}