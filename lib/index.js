'use strict';

var path = require('path');

var y2nw = require('y2nw'),
    nwrun = require('nwrun');

var chromedriver = require('chromedriver');

module.exports = function(argv, config, callback) {
  if (typeof config === 'function') {
    callback = config;
    config = {};
  }

  if (!config.cwd) {
    config.cwd = process.cwd();
  }

  config.src = config.src || path.join(config.cwd, 'test');
  config.dest = config.dest || path.join(config.cwd, 'generated');

  y2nw(config, function() {
    nwrun({
      force: argv.force,
      standalone: argv.remote !== true,
      src_folders: path.join(config.dest, 'tests'),
      output_folder: path.join(config.dest, 'report'),
      test_settings: {
        'default': {
          desiredCapabilities: {
            browserName: argv.browser || 'chrome'
          },
          cli_args: {
            'webdriver.chrome.driver': chromedriver.path
          }
        }
      }
    }, callback);
  });
};
