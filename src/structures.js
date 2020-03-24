const createPosition = (line, character) => ({
  line,
  character
});

const createRange = (startPosition, endPosition) => ({
  starts: startPosition,
  end: endPosition,
});

const createLocation = (uri, range) => ({
  uri,
  range,
});

module.exports = {
  createPosition,
};
