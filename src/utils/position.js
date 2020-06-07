const { createLines } = require('./lines');

const positionToIndex = (sourceText, position) => {
  const lines = createLines(sourceText);
  const lineLengths = lines.map(line => line.length + 1);
  const lineDistances = lineLengths.reduce((acc, curr, index) => [...acc, curr + (acc[index - 1] || 0)], []);
  
  const lineDistance = lineDistances[position.line] - lineLengths[position.line];
  const characterDistance = position.character;

  return lineDistance + characterDistance;
};

const indexToPosition = (sourceText, index) => {
  const lines = createLines(sourceText);
  const lineLengths = lines.map(line => line.length + 1);
  const lineDistances = lineLengths.reduce((acc, curr, index) => [...acc, curr + (acc[index - 1] || 0)], []);

  const lineNumber = lineDistances.findIndex(lineDistance => lineDistance > index);
  const characterNumber = index - (lineDistances[lineNumber - 1] || 0);

  return {
    character: characterNumber,
    line: lineNumber,
  };
};

module.exports = {
  positionToIndex,
  indexToPosition,
}