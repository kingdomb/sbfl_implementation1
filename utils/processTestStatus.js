import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { naturalSort } from "./createFailedTests.js"; 

export async function processFirstLine(directory, jsonPath) {
  let jsonData = { tests: [] };

  if (await fs.pathExists(jsonPath)) {
    jsonData = await fs.readJson(jsonPath); 
    if (jsonData.tests.length > 0) {
      console.log(
        chalk.yellow(
          "The tests array already contains data. Processing skipped."
        )
      );
      return []; 
    }
  }

  const files = await fs.readdir(directory); 
  files.sort(naturalSort);

  const processedResults = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const lines = fileContent.split("\n");
    const firstLine = lines[0];

    const words = firstLine.trim().split(" "); 
    const lastWord = words.pop();
    const trimmedLine = words.join(" ").trim();

    processedResults.push({
      id: files.indexOf(file) + 1,
      test: trimmedLine,
      status: lastWord === "true" ? "passed" : "failed",
    });

    console.log(chalk.green(`Processed file: ${file}`));
  }

  return processedResults;
}

export async function updateTestResults(jsonPath, processedResults) {
  let jsonData = { tests: [] };

  if (await fs.pathExists(jsonPath)) {
    jsonData = await fs.readJson(jsonPath);

    if (jsonData.tests.length > 0) {
      console.log(
        chalk.yellow("The tests array already contains data. No updates made.")
      );
      return;
    }
  }

  jsonData.tests.push(...processedResults);

  await fs.writeJson(jsonPath, jsonData, { spaces: 2 });
  console.log(chalk.blue("JSON file updated successfully."));
}

export async function updateTotalResults(jsonPath, processedResults) {
  let jsonData = { tests: [], total_pass: 0, total_fail: 0 };

  if (await fs.pathExists(jsonPath)) {
    jsonData = await fs.readJson(jsonPath);
  }

  const passedCount = processedResults.filter(
    (result) => result.status === "passed"
  ).length;
  const failedCount = processedResults.filter(
    (result) => result.status === "failed"
  ).length;

  let updateRequired = false;

  if (jsonData.total_pass !== passedCount) {
    jsonData.total_pass = passedCount;
    updateRequired = true;
  } else {
    console.log(chalk.yellow("Passed count unchanged. No updates made."));
  }

  if (jsonData.total_fail !== failedCount) {
    jsonData.total_fail = failedCount;
    updateRequired = true;
  } else {
    console.log(chalk.yellow("Failed count unchanged. No updates made."));
  }

  if (updateRequired) {
    await fs.writeJson(jsonPath, jsonData, { spaces: 2 });
    console.log(chalk.blue("Total results updated successfully."));
  }
}