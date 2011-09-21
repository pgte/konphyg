var fs = require('fs');

module.exports = function(filePath) {
  var fileContents;
  try {
    fileContents = fs.readFileSync(filePath)
  } catch(err) {
    if (err.code === 'EBADF') {
      return null;
    }
    throw err;
  }
  return JSON.parse(fileContents);
};