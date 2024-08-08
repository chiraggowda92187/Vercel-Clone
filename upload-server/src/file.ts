import fs from 'fs';

// function getAllPathsRecursive({ dir }: { dir: string }): string[] {
//   let filesPath: string[] = [];
//   const files = fs.readdirSync(dir);
//   files.forEach((mainFile) => {
//     if (fs.statSync(`${dir}/${mainFile}`).isDirectory()) {
//       const files = getAllPathsRecursive({ dir: `${dir}/${mainFile}` });
//       files.forEach((file) => {
//         filesPath.push(`${file}`);
//       });
//     } else {
//       filesPath.push(`${dir}/${mainFile}`);
//     }
//   });
//   return filesPath;
// }

export function getAllPathsRecursive({ dir }: { dir: string }) {
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

// export async function getAllPaths({dir} : {dir : string}){
//     let filesPath : string[] = []
//     await fs.readdir(dir,(err, files)=>{
//         if(err){
//             console.log("Cant read the directory")
//         }
//         files.forEach((file)=>{
//             //console.log(file)
//             //console.log(`${dir}/${file}`);
//             const filePath = `${dir}/${file}`;
//             filesPath.push(filePath);
//         })
//     })
//     // console.log(filesPath)
//     return filesPath
// }
