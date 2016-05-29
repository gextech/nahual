'use strict';

var fs = require('fs'),
    path = require('path');

var y2nw = require('y2nw'),
    nwrun = require('nwrun');

var spawn = require('child_process').spawn;

function is_dir(filepath) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();
}

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

  var child;

  function done(success) {
    /* istanbul ignore if  */
    if (child) {
      child.kill();
    }

    callback(success === true ? 0 : 1);
  }

  function next() {
    nwrun({
      argv: argv,
      force: argv.force,
      standalone: argv.standalone,
      target: (argv.e || argv.env || argv.target || 'default').split(','),
      src_folders: path.join(options.dest, 'tests'),
      output_folder: path.join(options.dest, 'report'),
      jar_path: path.resolve(__dirname, '../selenium.jar'),
      test_settings: {
        'default': {
          screenshots: {
            enabled: true,
            path: path.join(options.dest, 'screenshots')
          }
        }
      }
    }, done);
  }

  y2nw(options, function() {
    var cmd = argv['--'];

    /* istanbul ignore if  */
    if (cmd && cmd.length) {
      child = spawn(cmd[0], cmd.slice(1))
        .on('close', function(code) {
          done(!code);
        });
    }

    next();
  });
};
