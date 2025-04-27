import * as fs from 'fs/promises';

export async function readCfgFile(filePath) {
  try {
    // Read the content of the .cfg file
    const data = await fs.readFile(filePath, "utf8");

    // Split the content by lines
    const lines = data.split("\n");

    // Find the start index after the separator
    const separatorLineIndex = lines.findIndex(
      (line) => line.trim() === "##########################"
    );

    // Check if the separator was found
    if (separatorLineIndex === -1) {
      console.log(
        'Separator "##########################" not found in the file.'
      );
      return [];
    }

    // Slice the lines to get the lines after the separator
    const relevantLines = lines.slice(separatorLineIndex + 1);

    // Now, process each relevant line (if needed)
    const parsedEntries = relevantLines
      .map((line) => {
        // Skip empty lines and lines starting with comments (if any)
        if (
          !line.trim() ||
          line.trim().startsWith("##########################")
        ) {
          return null;
        }

        // Assuming the format of each line is like: <ip range>, "Description", <number>, <country code>, <status>
        const match = line.match(
          /^(\S+),\s+"([^"]+)",\s+(\d+),\s+"([^"]+)",\s+(.*)$/
        );

        if (match) {
          return {
            ipRange: match[1],
            description: match[2],
            number: match[3],
            country: match[4],
            status: match[5],
          };
        } else {
          console.warn(`Skipping invalid line: ${line}`);
          return null;
        }
      })
      .filter((entry) => entry !== null);

    // Return the parsed entries
    return parsedEntries;
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}
