var fs = require('fs'),
    path = require('path');

var y2nw = require('y2nw'),
    nwrun = require('nwrun');

var exec = require('child_process').exec;

function is_dir(filepath) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();
}

function _req(moduleName) {
  try {
    return require(moduleName);
  } catch (e) {
    // nothing to do
  }
}

var chromedriver = _req('chromedriver');

module.exports = function(argv, options, callback) {
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

  if (!is_dir(options.src)) {
    throw new Error('invalid ' + JSON.stringify(options.src) + ' directory');
  }

  options.hooks = options.hooks ? (Array.isArray(options.hooks) ? options.hooks : [options.hooks]) : [];

  if (typeof argv.hooks === 'string') {
    Array.prototype.push.apply(options.hooks, argv.hooks.split(/[,:|]]/));
  }

  var child;

  /* istanbul ignore if  */
  if (argv.execute) {
    child = exec(argv.execute, { env: process.env });
    process.stdout.write('Executing `' + argv.execute + '` on the background...\n');
  }

  function done(success) {
    /* istanbul ignore if  */
    if (child) {
      child.kill();
    }

    callback(success);
  }

  function next() {
    var defaults = {
      screenshots: {
        enabled: true,
        path: path.join(options.dest, 'screenshots')
      }
    };

    var browser = argv.browser || 'chrome';

    if (chromedriver && browser === 'chrome') {
      defaults.desiredCapabilities = {
        browserName: browser
      };

      defaults.cli_args = {
        'webdriver.chrome.driver': chromedriver.path
      };
    }

    var settings = {
      argv: argv,
      force: argv.force,
      standalone: argv.standalone,
      target: (argv.e || argv.env || argv.target || 'default').split(','),
      src_folders: path.join(options.dest, 'tests'),
      output_folder: path.join(options.dest, 'report'),
      jar_path: path.resolve(__dirname, '../selenium.jar'),
      test_settings: { 'default': defaults },
      custom_commands_path: [],
      custom_assertions_path: []
    };

    options.hooks.forEach(function(hook) {
      var hookModule = require(hook);

      if (typeof hookModule.configure === 'function') {
        hookModule.configure(settings, argv);
      }
    });

    nwrun(settings, done);
  }

  y2nw(options, next);
};
