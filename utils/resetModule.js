import fs from "fs-extra";
import readlineSync from "readline-sync"; 
import path from "path"; 
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

export async function resetProgram(jsonPath) {
  const userInput = readlineSync.question(
    chalk.yellow("Do you want to reset the program? (y/n): ")
  );

  if (userInput.toLowerCase() === "y" || userInput.toLowerCase() === "yes") {
    const sourceDir = path.resolve(__dirname, "../data/NewCoverageData");
    const targetDir = path.resolve(__dirname, "../NewCoverageData"); 
    try {
      await fs.remove(targetDir);

      await fs.copy(sourceDir, targetDir);

      console.log(chalk.green("NewCoverageData directory has been reset."));

      let jsonData = { methods: [], total_pass: 0, total_fail: 0 };

      if (await fs.pathExists(jsonPath)) {
        jsonData = await fs.readJson(jsonPath);

        jsonData.methods = [];
        if (jsonData.tests) {
          jsonData.tests = [];
        }

        jsonData.total_pass = 0;
        jsonData.total_fail = 0;

        await fs.writeJson(jsonPath, jsonData, { spaces: 2 });

        console.log(chalk.green("JSON data has been reset."));
      }
    } catch (error) {
      console.error(chalk.red(`Failed to reset: ${error.message}`));
    }
  } else {
    console.log(chalk.blue("Program reset canceled by user."));
  }
}
