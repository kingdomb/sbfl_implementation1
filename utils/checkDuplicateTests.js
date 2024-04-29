/**
 *
 * checkDuplicateTests
 *
 */

import fs from "fs-extra";
import path from "path";
import readline from "readline";

const directoryPath = "./NewCoverageData";

async function checkDuplicateTests() {
  const firstLines = new Set();
  const duplicateLines = [];

  const files = await fs.readdir(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isFile()) {
      const firstLine = await getFirstLine(filePath);

      if (!firstLines.has(firstLine)) {
        firstLines.add(firstLine);
      } else {
        duplicateLines.push(firstLine);
      }
    }
  }

  const numberOfOriginalTests = firstLines.size;
  const numberOfDuplicates = duplicateLines.length;

  console.log("Number of original tests:", numberOfOriginalTests);
  console.log("Number of duplicate first lines:", numberOfDuplicates);

  console.log("Unique duplicate lines:", duplicateLines);
}

async function getFirstLine(filePath) {
  const readable = fs.createReadStream(filePath);
  const reader = readline.createInterface({ input: readable });
  const firstLine = await new Promise((resolve) => {
    reader.on("line", (line) => {
      reader.close();
      resolve(line);
    });
  });
  readable.close();
  return firstLine;
}

checkDuplicateTests(); 