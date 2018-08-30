var merge = require('./merge')
  , load = require('./load')
  , path = require('path')
  , fs = require('fs')

module.exports = function(basePath, alwaysRequireEnv) {
  basePath = path.normalize(basePath);
  var domains = {};
  var env = process.env.NODE_ENV || 'development';
  var files = fs.readdirSync(basePath)

  var get = function (domain, requireEnv, opts) {
    var config;
    var lookupPath = [domain];

    if (typeof opts !== 'undefined' && opts.hasOwnProperty('lookupPath')){
      lookupPath = lookupPath.concat(opts.lookupPath);
    }

    // default to global expectation unless specifically overridden.
    if (requireEnv !== false && alwaysRequireEnv === true) {
      requireEnv = true;
    }

    if (domains.hasOwnProperty(domain)) {
      return domains[domain];
    }

    config = lookupPath.reduce(function(currentConfig, additionalPath){
      additionalConfig = merge(
        load(path.join(basePath, additionalPath + '.json'), additionalPath, true)
      , load(path.join(basePath, additionalPath + '.' + env + '.json'), additionalPath + "." + env, !!(requireEnv === true))
      );

      return merge(currentConfig, additionalConfig);
    }, {});
    
    domains[domain] = config;
    
    return config;
  }
  
  get.all = function (opts) {
    var lookupPath = [''];

    if (typeof opts !== 'undefined' && opts.hasOwnProperty('lookupPath')){
      lookupPath = lookupPath.concat(opts.lookupPath);
    }

    lookupPath.forEach(function(pathToLoockAt){
      var files = fs.readdirSync(path.join(basePath, pathToLoockAt));

      files.forEach(function (file) {
        if(file.match(/^\./)) return;
        if(!file.match(/\.json$/i)) return;
        var domain = path.join(pathToLoockAt, file.match(/^(.*?)\./i)[1]);
        if(domains.hasOwnProperty(domain)) return;
        domains[domain] = merge(
            load(path.join(basePath, domain + '.json'), domain, true)
          , load(path.join(basePath, domain + '.' + env + '.json'), domain, false)
        );
      });
    });

    return domains;
  }
  
  get.clear = function () {
    domains = {};
    files = fs.readdirSync(basePath)
  }
  
  return get
};
