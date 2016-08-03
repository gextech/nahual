var exit = process.exit.bind(process);

var pkg = require('../package.json'),
    runner = require('../lib');

var minimist = require('minimist'),
    path = require('path'),
    fs = require('fs');

var cwd = process.cwd(),
    argv = minimist(process.argv.slice(2), {
      '--': true,
      boolean: ['version', 'help', 'force', 'standalone'],
      string: ['target', 'require', 'steps', 'language', 'browser', 'hooks'],
      alias: {
        h: 'help',
        F: 'force',
        T: 'target',
        B: 'browser',
        D: 'steps',
        X: 'hooks',
        R: 'require',
        L: 'language',
        S: 'standalone'
      }
    });

process.name = 'nahual';

if (argv.help) {
  console.log(function() {/**---
Usage:
  nahual [SRC] [DEST] [OPTIONS] [NIGHTWATCH OPTIONS] [-- COMMAND]

Options:
  -F, --force       Always download the selenium-server
  -T, --target      Nightwatch's target to execute (e.g. -t integration)
  -B, --browser     Use a different browser for tests (e.g. -b safari)
  -D, --steps       Path for scanning additional steps (e.g. -d ./custom/steps)
  -X, --hooks       Load modules as external hooks (e.g. -x dayguard)
  -R, --require     Requires the given script before all steps (e.g. -p ./runtime.js)
  -L, --language    Use a different language for all sources (e.g. -l Spanish)
  -S, --standalone  Spawn a local selenium-server

The given command after -- will be spawned before running the tests.

Also, Nightwatch's CLI options are fully supported as-is.
---*/}.toString().match(/---([\s\S]+)---/)[1].trim());
  exit();
}

if (argv.version) {
  console.log(pkg.name + ' v' + pkg.version);
  exit();
}

var fixedRequires = (Array.isArray(argv.require) ? argv.require : argv.require ? [argv.require] : [])
  .map(function(file) {
    var test = path.resolve(file);

    if (fs.existsSync(test)) {
      return test;
    }

    return file;
  });

try {
  process.env.NODE_ENV = process.env.NODE_ENV || 'spec';
  process.env.PORT = process.env.PORT || 8081;

  var _env = [
    'process.env.NODE_ENV=' + JSON.stringify(process.env.NODE_ENV),
    'process.env.PORT=' + process.env.PORT
  ].join('\n');

  runner(argv, {
    src: path.resolve(cwd, argv._[0] || 'test'),
    dest: path.resolve(cwd, argv._[1] || 'generated'),
    prelude: _env + '\n' + fixedRequires.map(function(moduleName) {
      // preprend require-syntax only
      return 'require(' + JSON.stringify(moduleName) + ')';
    }).join('\n')
  }, exit);
} catch (e) {
  process.stderr.write('Error: ' + (e.message || e.toString()) + '\n');
  exit(1);
}
