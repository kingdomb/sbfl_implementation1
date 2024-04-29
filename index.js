import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import {
  convertLinesToString,
  modifyFirst500Files,
  naturalSort,
} from './utils/createFailedTests.js';
import {
  processFirstLine,
  updateTestResults,
  updateTotalResults,
} from "./utils/processTestStatus.js";
import { processDirectory } from './utils/processMethods.js';
import { calculateSuspiciousness } from "./utils/calculateSuspiciousnessValues.js";
import { resetProgram } from "./utils/resetModule.js"; 

const directoryPath = './NewCoverageData'; 
const jsonFile = './data/testResults.json'; 

async function main() {
  try {
    let files = await fs.readdir(directoryPath);
    files.sort(naturalSort);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      await convertLinesToString(filePath);
    }

    await modifyFirst500Files(directoryPath);
    console.log(chalk.green("Modifying process complete."));

    const processedResults = await processFirstLine(directoryPath, jsonFile);

    if (processedResults.length > 0) {
      await updateTestResults(jsonFile, processedResults);
      await updateTotalResults(jsonFile, processedResults);
    }

    await processDirectory(directoryPath, jsonFile);

    await calculateSuspiciousness(jsonFile);
    console.log(chalk.green("END OF OPERATION."));
    
    await resetProgram(jsonFile); 
  } catch (error) {
    console.error(
      chalk.red(`Error processing files in directory ${directoryPath}: ${error.message}`)
    );
  }
}

main();