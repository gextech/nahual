'use strict';


const exit = process.exit.bind(process);

const pkg = require('../package.json');
const runner = require('../lib');

const wargs = require('wargs');
const path = require('path');
const fs = require('fs');

const cwd = process.cwd();

const argv = wargs(process.argv.slice(2), {
  booleans: ['version', 'help', 'force', 'standalone'],
  aliases: {
    h: 'help',
    F: 'force',
    T: 'target',
    B: 'browser',
    D: 'steps',
    X: 'hooks',
    R: 'require',
    E: 'execute',
    L: 'language',
    S: 'standalone',
  },
});

process.name = 'nahual';

if (argv.flags.help) {
  console.log(`
Usage:
  nahual [SRC] [DEST] [OPTIONS] [NIGHTWATCH OPTIONS]

Options:
  -F, --force       Always download the selenium-server
  -T, --target      Nightwatch's target to execute (e.g. -T integration)
  -B, --browser     Use a different browser for tests (e.g. -B safari)
  -D, --steps       Path for scanning additional steps (e.g. -D ./custom/steps)
  -X, --hooks       Load modules as external hooks (e.g. -X dayguard)
  -R, --require     Requires the given script before all steps (e.g. -R ./runtime.js)
  -E, --execute     Execute arbitrary command before any test (e.g. -E 'python -m SimpleHTTPServer')
  -L, --language    Use a different language for all sources (e.g. -L Spanish)
  -S, --standalone  Spawn a local selenium-server

The given command after -- will be spawned before running the tests.

Also, Nightwatch's CLI options are fully supported as-is.
`.trim());
  exit();
}

if (argv.flags.version) {
  console.log(`${pkg.name} v${pkg.version}`);
  exit();
}

function toArray(value) {
  if (!Array.isArray(value)) {
    return value ? [value] : [];
  }

  return value;
}

const fixedRequires = toArray(argv.flags.require)
  .map(file => {
    const test = path.resolve(file);

    if (fs.existsSync(test)) {
      return test;
    }

    return file;
  });

try {
  process.env.NODE_ENV = process.env.NODE_ENV || 'spec';
  process.env.PORT = process.env.PORT || 8081;

  const _env = [
    `process.env.NODE_ENV=${JSON.stringify(process.env.NODE_ENV)}`,
    `process.env.PORT=${process.env.PORT}`,
  ].join('\n');

  runner(argv.flags, {
    src: path.resolve(cwd, argv._[0] || 'test'),
    dest: path.resolve(cwd, argv._[1] || 'generated'),
    // preprend require-syntax only
    prelude: `${_env}\n${fixedRequires.map(moduleName =>
      `require(${JSON.stringify(moduleName)})`).join('\n')}`,
  }, success => {
    if (success === true) {
      exit(0);
    }

    if (success === false) {
      exit(1);
    }

    if (typeof success === 'number') {
      exit(success);
    }
  });
} catch (e) {
  process.stderr.write(`Error: ${e.message || e.toString()}`);
  exit(1);
}
