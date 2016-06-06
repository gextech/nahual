var fs = require('fs-extra'),
    path = require('path');

function addFeature(src, desc, steps) {
  var fileName = desc.replace(/\W+/g, '-');
  var featureFile = path.join(src, 'features', fileName + '.feature');
  var stepsFile = path.join(src, 'steps', fileName + '.litcoffee');

  if (fs.existsSync(featureFile)) {
    throw new Error('feature file `' + featureFile + '` already exists');
  }

  fs.outputFileSync(featureFile, [
    '@tags=pending',
    '',
    'Feature: ' + desc,
    '',
    'Scenario: seacrhing for "' + desc + '" on [ENGINE]',
    '',
    '  Given open "[ENGINE]" URL',
    '  When I search for "[VALUE]"',
    '  Then should I see "[RESULT]"',
    '',
    '  Examples:',
    '    ENGINE | VALUE | RESULT',
    '    http://google.com | ' + desc + ' | ' + desc,
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
      'Given open "$ENGINE" URL.',
      '',
      '    (searchUrl) ->',
      '      @browser',
      '        .url(searchUrl)',
      "        .waitForElementVisible('body', 1000)",
      '',
      'When I search for "$INPUT".',
      '',
      '    (value) ->',
      '      @browser',
      "        .setValue('input[type=text]', value)",
      "        .click('button[name=btnG]')",
      '        .pause(1000)',
      '',
      'Then should I see "$OUTPUT".',
      '',
      '    (result) ->',
      '      @browser',
      "        .assert.containsText('#ires', result)",
      ''
    ].join('\n'));

    console.log('file `' + stepsFile + '` written');
  }
}

module.exports = function(argv) {
  addFeature(argv._[0] || 'test', argv.feature, argv['with-steps']);
};
