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
      string: ['target', 'prelude', 'steps', 'lang', 'browser', 'hooks'],
      alias: {
        h: 'help',
        s: 'standalone',
        x: 'hooks',
        f: 'force',
        b: 'browser',
        p: 'prelude',
        t: 'target',
        d: 'steps',
        l: 'language',
        F: 'feature',
        S: 'with-steps'
      }
    });

process.name = 'nahual';

if (argv.help) {
  console.log(function() {/**---
Usage:
  nahual [SRC] [DEST] [OPTIONS] [-- COMMAND]

Options:
  -s, --standalone  Spawn a local selenium-server
  -f, --force       Always download the selenium-server
  -x, --hooks       Load modules as external hooks (e.g. -x dayguard)
  -b, --browser     Use a different browser for tests (e.g. -b safari)
  -p, --prelude     Prepends the given script before all steps (e.g. -p ./runtime.js)
  -t, --target      Nightwatch's target to execute (e.g. -t integration)
  -d, --steps       Path for scanning additional steps (e.g. -d ./custom/steps)
  -l, --lang        Use a different language for all sources (e.g. -l Spanish)

The given command after -- will be spawned before running the tests
---*/}.toString().match(/---([\s\S]+)---/)[1].trim());
  exit();
}

if (argv.version) {
  console.log(pkg.name + ' v' + pkg.version);
  exit();
}

try {
  runner(argv, {
    src: path.resolve(cwd, argv._[0] || 'test'),
    dest: path.resolve(cwd, argv._[1] || 'generated'),
    header: argv.prelude ? fs.readFileSync(argv.prelude) : ''
  }, exit);
} catch (e) {
  process.stderr.write('Error: ' + (e.message || e.toString()) + '\n');
  exit(1);
}
