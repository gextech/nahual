var fs = require('fs-extra'),
    path = require('path');

function initFiles(src) {
  if (fs.existsSync(src)) {
    throw new Error('directory `' + src + '` already exists');
  }

  fs.mkdirsSync(src);
  fs.mkdirsSync(path.join(src, 'steps'));
  fs.mkdirsSync(path.join(src, 'features'));

  console.log('directory `' + src + '` created');
  console.log('directory `' + src + '/steps` created');
  console.log('directory `' + src + '/features` created');
}

function addFeature(src, desc, steps) {
  var fileName = desc.replace(/\W+/g, '-');
  var featureFile = path.join(src, 'features', fileName + '.feature');
  var stepsFile = path.join(src, 'steps', fileName + '.coffee.md');

  if (fs.existsSync(featureFile)) {
    throw new Error('feature file `' + featureFile + '` already exists');
  }

  fs.outputFileSync(featureFile, [
    '@tags=pending',
    '',
    'Feature: ' + desc,
    '',
    'Scenario: __FILLME__',
    '',
    '  Given __FILLME__',
    ''
  ].join('\n'));

  console.log('file `' + featureFile + '` written');

  if (steps) {
    if (fs.existsSync(stepsFile)) {
      throw new Error('step file `' + stepsFile + '` already exists');
    }

    fs.outputFileSync(stepsFile, [
      '# ' + desc,
      '',
      'Given __FILLME__.',
      '',
      '    ->',
      "      console.log '__FILLME__'",
      ''
    ].join('\n'));

    console.log('file `' + stepsFile + '` written');
  }
}

module.exports = function(argv) {
  if (argv.init) {
    initFiles(argv._[0] || 'test');
  } else if (argv.feature) {
    addFeature(argv._[0] || 'test', argv.feature, argv['with-steps']);
  }
};
