import fs from "fs-extra";
import readline from "readline";
import path from "path";
import chalk from "chalk";


export function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export async function convertLinesToString(filePath) {
  try {
    const readStream = fs.createReadStream(filePath, { encoding: "utf-8" });
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });

    const newContent = []; 

    
    for await (const line of rl) {
      newContent.push(line.toString());
    }

    
    await fs.writeFile(filePath, newContent.join("\n"), { encoding: "utf-8" });

    console.log(`Converted lines to string for file: ${filePath}`); 
  } catch (error) {
    console.error(`Error converting lines to string for file ${filePath}:`, error); 
  }
}

export async function modifyFirst500Files(directory) {
  try {
    let files = await fs.readdir(directory); 
    files.sort(naturalSort); 
    const maxFiles = 500;

    for (let i = 0; i < Math.min(maxFiles, files.length); i++) {
      const file = files[i];
      const filePath = path.join(directory, file);

      try {
        const fileContent = await fs.readFile(filePath, { encoding: "utf-8" });
        const lines = fileContent.split("\n");

        if (lines.length > 0) {
          lines[0] = lines[0].replace(/\btrue\b$/, "false");
        }

        await fs.writeFile(filePath, lines.join("\n"), { encoding: "utf-8" });

        console.log(`Modified first line in file: ${filePath}`);
      } catch (err) {
        console.error(`Error processing file ${filePath}:`, err);
      }
    }

    console.log(chalk.green("Completed modifications for the first 500 files."));
  } catch (error) {
    console.error(
      chalk.red(
        `Error modifying the first 500 files in directory ${directory}:`,
        error
      )
    );
  }
}