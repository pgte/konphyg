var konphyg = require('../.')(__dirname + '/../assets/config');
var fs = require('fs');

var test = require('tap').test;

test("load existing configuration with one file", function(t) {
  var config = konphyg('test1');
  t.similar(config, {a:100,b:{c:120,d:13}}, "wrong file contents");
  t.end();
});

test("load all configs", function(t) {
  var config = konphyg.all();
  var expected = {test1:{a:100,b:{c:120,d:13}},test9:{e:10,f:[1,2,3,4]}}
  t.similar(config.test1, expected.test1);
  t.similar(config.test9.e, expected.test9.e);
  t.similar(config.test9.f, expected.test9.f);
  t.end();
});

test("non-existing base configuration file throws error", function(t) {
  var threw = false;

  try {
    var config = konphyg('test2');
  } catch(err) {
    threw = true
    t.ok(!!(/^Could not find configuration file for test2 domain/.test(err.message)), "Error message: " + err.message);
  }

  t.ok(threw, "should throw when base file is not found");
  t.end();
});

test("non-existing env configuration file doesn't throw error if requireEnv not specified", function(t) {
  var didnt_throw = true;

  try {
    var config = konphyg('test3', false);
  } catch(err) {
    didnt_throw = false;
  }

  t.ok(didnt_throw, "should not throw, requireEnv not set.");
  t.end();
});

test("non-existing env configuration file doesn't throw error if requireEnv !== true", function(t) {
  var didnt_throw = true;

  try {
    var config = konphyg('test4', false);
  } catch(err) {
    didnt_throw = false;
  }

  t.ok(didnt_throw, "should not throw, requireEnv not set.");
  t.end();
});

test("non-existing env configuration file throws error if requireEnv", function(t) {
  var threw = false;

  try {
    var config = konphyg('testdoesnotexist', true);
  } catch(err) {
    threw = true
    t.ok(!!(/^Could not find configuration file for testdoesnotexist domain/.test(err.message)), "Error message: " + err.message);
  }

  t.ok(threw, "should throw when env file is not found");
  t.end();
});

test("non-existing env configuration file doesn't throw error if alwaysRequireEnv === false", function(t) {
  var my_konphyg = require('../.')(__dirname + '/../assets/config', false);
  var didnt_throw = true;

  try {
    var config = my_konphyg('test6', false);
  } catch(err) {
    didnt_throw = false;
  }

  t.ok(didnt_throw, "should not throw, alwaysRequireEnv not set.");
  t.end();
});

test("non-existing env configuration file throws error if alwaysRequireEnv === true", function(t) {
  var my_konphyg = require('../.')(__dirname + '/../assets/config', true);
  var threw = false;

  try {
    var config = my_konphyg('test7');
  } catch(err) {
    threw = true
    t.ok(!!(/^Could not find configuration file for test7.development domain/.test(err.message)), "Error message: " + err.message);
  }

  t.ok(threw, "should throw when env file is not found (alwaysRequireEnv)");
  t.end();
});

test("non-existing env configuration file doesn't throw error if alwaysRequireEnv === true && requireEnv === false", function(t) {
  var my_konphyg = require('../.')(__dirname + '/../assets/config', true);
  var didnt_throw = true;

  try {
    var config = my_konphyg('test8', false);
  } catch(err) {
    didnt_throw = false;
  }

  t.ok(didnt_throw, "should not throw, requireEnv === false.");
  t.end();
});

test("clear method force reloading the underlaying configuration file", function(t) {
  var assetsPath = __dirname + '/../assets/config';
  fs.writeFileSync(assetsPath + '/test10.json', fs.readFileSync(assetsPath + '/test10-1.json'));
  
  var test101config = {a: 'foo'};
  var test102config = {a: 'bar', b: 'exists'};

  var my_konphyg = require('../.')(assetsPath);

  
  var all = my_konphyg.all();
  t.similar(all.test10, test101config);
  fs.writeFileSync(assetsPath + '/test10.json', fs.readFileSync(assetsPath + '/test10-2.json'));
  all = my_konphyg.all();
  t.similar(all.test10, test101config);
  my_konphyg.clear();
  all = my_konphyg.all();
  t.similar(all.test10, test102config);
  fs.unlinkSync(assetsPath + '/test10.json');
  
  t.end();
});