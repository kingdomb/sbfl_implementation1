import fs from "fs-extra";
import path from "path"; 
import { fileURLToPath } from "url"; 
import chalk from "chalk";
import { stringify } from "csv-stringify"; 
import { sqrt } from "mathjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function calculateSuspiciousness(jsonPath) {
  let jsonData = { methods: [], total_pass: 0, total_fail: 0 };

  if (await fs.pathExists(jsonPath)) {
    jsonData = await fs.readJson(jsonPath);
  } else {
    console.error(chalk.red("JSON file not found!"));
    return;
  }

  const { total_pass, total_fail } = jsonData;

  if (total_pass === 0 || total_fail === 0) {
    console.error(chalk.red("Invalid total pass/fail counts."));
    return;
  }

  jsonData.methods.forEach((method) => {
    const { passed, failed } = method;

    if (
      "s_tarantula" in method ||
      "s_sbi" in method ||
      "s_jaccard" in method ||
      "s_ochiai" in method
    ) {
      console.log(
        chalk.yellow(
          `Method ${method.method} already has suspiciousness values. Skipping...`
        )
      );
      return;
    }

    method.s_tarantula = Number(
      (
        failed /
        total_fail /
        (failed / total_fail + passed / total_pass)
      ).toFixed(2)
    );

    method.s_sbi = Number((failed / (failed + passed)).toFixed(2));
    method.s_jaccard = Number((failed / (total_fail + passed)).toFixed(2));
    method.s_ochiai = Number((failed / sqrt(passed + failed)).toFixed(2));
  });

  await fs.writeJson(jsonPath, jsonData, { spaces: 2 });

  const csvData = [];

  csvData.push([
    "Method",
    "Passed",
    "Failed",
    "Tarantula",
    "SBI",
    "Jaccard",
    "Ochiai",
  ]);

  jsonData.methods.forEach((method) => {
    csvData.push([
      method.method,
      method.passed,
      method.failed,
      method.s_tarantula,
      method.s_sbi,
      method.s_jaccard,
      method.s_ochiai,
    ]);
  });

  const csvContent = await new Promise((resolve, reject) => {
    stringify(csvData, { delimiter: ",", header: false }, (err, output) => {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });

  console.log(chalk.blue("Suspiciousness values calculated:"));
  console.log(csvContent); 

  const dataDir = path.resolve(__dirname, "../data"); 
  const tableFilePath = path.join(dataDir, "suspiciousness_table.csv");

  try {
    await fs.ensureDir(dataDir);
    await fs.writeFile(tableFilePath, csvContent, "utf8");
    console.log(chalk.green(`CSV table written to ${tableFilePath}`));
  } catch (error) {
    console.error(chalk.red(`Failed to write CSV file: ${error.message}`));
  }
}
