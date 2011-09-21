var path = require('path')
  , load = require('./load')
  , merge = require('./merge');


module.exports = function(basePath) {
  basePath = path.normalize(basePath);
  domains = {};
  return function(domain) {
    var config;
    
    if (domains.hasOwnProperty(domain)) {
      return domains[domain];
    }
    
    var env = process.env.NODE_ENV || 'development';
    
    config = merge(
        load(path.join(basePath, domain + '.json'))
      , load(path.join(basePath, domain + '.' + env + '.json'))
    );
    
    domains[domain] = config;
    
    return config;
  };
};