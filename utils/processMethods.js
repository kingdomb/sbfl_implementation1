import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { naturalSort } from "./createFailedTests.js";

async function processFileContent(filePath, jsonData) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8"); 
    const lines = fileContent.split("\n");

    if (lines.length === 0) {
      console.log(chalk.yellow(`No lines found in file: ${filePath}`));
      return { lastWord: null, lineCount: 0 };
    }

    const firstLine = lines[0];
    const words = firstLine.trim().split(" ");
    const lastWord = words.pop();
    const trimmedLine = words.join(" ").trim();
    const isTrue = lastWord === "true";

    let lineCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const lineText = lines[i].trim();

      if (!lineText) {
        continue;
      }

      if (!jsonData.methods) {
        jsonData.methods = [];
      }

      const existingMethod = jsonData.methods.find(
        (method) => method.method === lineText
      );

      if (existingMethod) {
        if (isTrue) {
          existingMethod.passed += 1;
        } else {
          existingMethod.failed += 1;
        }
      } else {
        jsonData.methods.push({
          id: jsonData.methods.length + 1,
          method: lineText,
          passed: isTrue ? 1 : 0,
          failed: isTrue ? 0 : 1,
        });
      }

      lineCount += 1;
    }

    return { lastWord, lineCount };
  } catch (error) {
    console.error(
      chalk.red(`Error processing file ${filePath}: ${error.message}`)
    );
    throw error;
  }
}

export async function processDirectory(directory, jsonPath) {
  let jsonData = { methods: [] };

  if (await fs.pathExists(jsonPath)) {
    try {
      jsonData = await fs.readJson(jsonPath);

      if (jsonData.methods && jsonData.methods.length > 0) {
        console.log(
          chalk.yellow(
            "The methods array already contains data. Skipping operation."
          )
        );
        return;
      }
    } catch (error) {
      console.error(
        chalk.red(`Error reading JSON file ${jsonPath}: ${error.message}`)
      );
      return;
    }
  }

  const files = await fs.readdir(directory);
  files.sort(naturalSort);

  let totalLinesProcessed = 0;

  for (const file of files) {
    const filePath = path.join(directory, file);

    try {
      const { lastWord, lineCount } = await processFileContent(
        filePath,
        jsonData
      );

      console.log(
        chalk.green(`Processed ${lineCount} lines from file: ${file}`)
      );
      totalLinesProcessed += lineCount;
    } catch (error) {
      console.error(
        chalk.red(`Error processing file ${file}: ${error.message}`)
      );
    }
  }

  try {
    await fs.writeJson(jsonPath, jsonData, { spaces: 2 });
    console.log(chalk.blue(`Total lines processed: ${totalLinesProcessed}`));
  } catch (error) {
    console.error(
      chalk.red(`Error writing JSON to file ${jsonPath}: ${error.message}`)
    );
  }
}
