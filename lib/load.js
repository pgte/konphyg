var fs = require('fs');

module.exports = function(filePath, domain, throwIfNotFound) {
  var fileContents, ret;
  
  try {
    fileContents = fs.readFileSync(filePath)
  } catch(err) {
    if (err.code === 'EBADF') {
      if (throwIfNotFound) {
        throw new Error('Could not find configuration file for ' + domain + ' domain');
      }
      return null;
    }
    throw err;
  }
  try {
    ret = JSON.parse(fileContents)
  } catch(err) {
    throw error('Error parsing JSON file ' + filePath);
  }
  return ret;
};