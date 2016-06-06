var exit = process.exit.bind(process);

var pkg = require('../package.json'),
    runner = require('../lib');

var minimist = require('minimist'),
    path = require('path'),
    fs = require('fs');

var cwd = process.cwd(),
    argv = minimist(process.argv.slice(2), {
      '--': true,
      boolean: ['version', 'help', 'force', 'standalone', 'with-steps'],
      string: ['target', 'prelude', 'steps', 'lang', 'browser', 'feature'],
      alias: {
        h: 'help',
        s: 'standalone',
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
  -b, --browser     Use a different browser for tests
  -p, --prelude     Prepends the given script before all steps
  -t, --target      Nightwatch's target to execute
  -d, --steps       Path for scanning additional steps
  -l, --lang        Use a different language for all sources

Tasks:
  -F, --feature     Adds a single feature with boilerplate
  -S, --with-steps  Adds required steps from given --feature

The given command after -- will be spawned before running the tests
---*/}.toString().match(/---([\s\S]+)---/)[1].trim());
  exit();
}

if (argv.version) {
  console.log(pkg.name + ' v' + pkg.version);
  exit();
}

try {
  if (argv.feature) {
    require('../lib/tasks')(argv);
    exit();
  }

  runner(argv, {
    src: path.resolve(cwd, argv._[0] || 'test'),
    dest: path.resolve(cwd, argv._[1] || 'generated'),
    header: argv.prelude ? fs.readFileSync(argv.prelude) : ''
  }, exit);
} catch (e) {
  process.stderr.write('Error: ' + (e.message || e.toString()) + '\n');
  exit(1);
}
