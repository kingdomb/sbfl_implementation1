export async function resetCoverageData(filesys, readlineModule, directory) {
  const files = await fs.readdir(directory);
  let fileNumber = 0;

  for (const file of files) {
    if (fileNumber % 2 === 0) {
      const filePath = `${directory}/${file}`;

      const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
      });

      let firstLine = null;
      for await (const line of rl) {
        firstLine = line.replace(/\bfalse\b$/, "true");
        break;
      }

      if (firstLine !== null) {
        const remainingContent = await fs.readFile(filePath, "utf-8");
        const updatedContent =
          firstLine +
          "\n" +
          remainingContent.slice(remainingContent.indexOf("\n") + 1);
        await fs.writeFile(filePath, updatedContent);
      }
    }
    fileNumber++;
  }
}
