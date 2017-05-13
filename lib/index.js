'use strict';

const fs = require('fs');
const path = require('path');

const y2nw = require('y2nw');
const nwrun = require('nwrun');

const exec = require('child_process').exec;

function toArray(value) {
  if (!Array.isArray(value)) {
    return value ? [value] : [];
  }

  return value;
}

function isDir(filepath) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();
}

function _req(moduleName) {
  try {
    return require(moduleName);
  } catch (e) {
    // nothing to do
  }
}

const chromedriver = _req('chromedriver');

module.exports = (argv, options, callback) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof argv === 'function') {
    callback = argv;
    options = {};
    argv = {};
  }

  if (!options) {
    options = {};
  }

  if (!argv) {
    argv = {};
  }

  if (!isDir(options.src)) {
    throw new Error(`Invalid ${JSON.stringify(options.src)} directory`);
  }

  options.hooks = toArray(options.hooks);

  if (typeof argv.hooks === 'string') {
    Array.prototype.push.apply(options.hooks, argv.hooks.split(/[,:|]]/));
  }

  let child;

  /* istanbul ignore if  */
  if (argv.execute) {
    child = exec(argv.execute, { env: process.env });
    process.stdout.write(`Executing '${argv.execute}' on the background...\n`);
  }

  function done(success) {
    /* istanbul ignore if  */
    if (child) {
      child.kill();
    }

    callback(success);
  }

  function next() {
    const defaults = {
      screenshots: {
        enabled: true,
        path: path.join(options.dest, 'screenshots'),
      },
    };

    const browser = argv.browser || 'chrome';

    if (chromedriver && browser === 'chrome') {
      defaults.desiredCapabilities = {
        browserName: browser,
      };

      defaults.cli_args = {
        'webdriver.chrome.driver': chromedriver.path,
      };
    }

    const settings = {
      argv,
      force: argv.force,
      standalone: argv.standalone,
      target: (argv.e || argv.env || argv.target || 'default').split(','),
      src_folders: path.join(options.dest, 'tests'),
      output_folder: path.join(options.dest, 'report'),
      jar_path: path.resolve(__dirname, '../selenium.jar'),
      test_settings: { default: defaults },
      custom_commands_path: [],
      custom_assertions_path: [],
    };

    options.hooks.forEach(hook => {
      const hookModule = require(hook);

      if (typeof hookModule.configure === 'function') {
        hookModule.configure(settings, argv);
      }
    });

    nwrun(settings, done);
  }

  y2nw(options, next);
};
