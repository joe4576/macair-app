export function csvToJson(csv: string) {
  const lines = csv.split("\n").filter((line) => (line ? line : null));
  const headers = lines[0].substring(0, lines[0].length - 1).split(",");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].includes('"')) {
      lines[i] = removeCommasBetweenCharacter(lines[i], '"');
    }

    let newObject: any = {};
    const currentLineItems = lines[i].split(",");

    for (let j = 0; j < currentLineItems.length; j++) {
      if (currentLineItems[j].includes("~")) {
        currentLineItems[j] = currentLineItems[j].replaceAll("~", ",");
      }
      newObject[headers[j]] = currentLineItems[j];
    }
    result.push(newObject);
  }

  return result;
}

const removeCommasBetweenCharacter = (input: string, character: string) => {
  let internalInput = input;

  const characterIndexes: number[] = [];
  for (let i = 0; i < internalInput.length; i++) {
    if (internalInput[i] === character) characterIndexes.push(i);
  }

  while (characterIndexes.length !== 0) {
    const substr = internalInput.substring(
      characterIndexes[0],
      characterIndexes[1] + 1
    );
    const substrWithoutCommas = substr.replaceAll(/[,]+/g, "~");
    internalInput = internalInput.replace(substr, substrWithoutCommas);
    characterIndexes.splice(0, 2);
  }

  return internalInput;
};
