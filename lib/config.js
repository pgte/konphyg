var path = require('path')
  , load = require('./load')
  , merge = require('./merge');


module.exports = function(basePath, alwaysRequireEnv) {
  basePath = path.normalize(basePath);
  domains = {};

  var env = process.env.NODE_ENV || 'development';

  return function(domain, requireEnv) {
    var config;

    // default to global expectation unless specifically overridden.
    if (requireEnv !== false && alwaysRequireEnv === true) {
      requireEnv = true;
    }

    if (domains.hasOwnProperty(domain)) {
      return domains[domain];
    }
    
    config = merge(
        load(path.join(basePath, domain + '.json'), domain, true)
      , load(path.join(basePath, domain + '.' + env + '.json'), domain + "." + env, !!(requireEnv === true))
    );
    
    domains[domain] = config;
    
    return config;
  };
};