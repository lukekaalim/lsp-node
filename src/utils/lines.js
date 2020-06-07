const flatten = list => list.reduce((acc, curr) => [...acc, ...curr], []);

const createLines = (contents) => {
  const linesSplitByCRLF = contents.split('\r\n');
  const linesSplitByLF = flatten(linesSplitByCRLF.map(line => line.split('\n')));
  const linesSplitByCR = flatten(linesSplitByLF.map(line => line.split('\r')));

  const lines = linesSplitByCR;

  return lines;
};

const updateLines = (lines, range, newContents) => {
  const { start, end } = range;

  const startOfRange = lines[start.line].slice(0, start.character);
  const endOfRange = lines[end.line].slice(end.character + 1);
  const newLines = createLines(startOfRange + newContents + endOfRange);
  return [
    ...lines.slice(0, start.line),
    ...newLines,
    ...lines.slice(end.line + 1),
  ]
};

module.exports = {
  createLines,
  updateLines,
};
