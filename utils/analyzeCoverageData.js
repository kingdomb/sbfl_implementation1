export async function analyzeCoverageData(fs, directory) {
  const files = await fs.readdir(directory);
  let totalPassed = 0;
  let totalFailed = 0;

  for (const file of files) {
    const filePath = `${directory}/${file}`;
    const firstLine = await fs
      .readFile(filePath, "ascii")
      .then((content) => content.split("\n")[0]);

    const lastWord = firstLine.split(" ").pop();

    if (lastWord.toLowerCase() === "true") {
      totalPassed++;
    } else if (lastWord.toLowerCase() === "false") {
      totalFailed++;
    }
  }

  console.log("Total Passed:", totalPassed);
  console.log("Total Failed:", totalFailed);

  return { totalPassed, totalFailed };
}