var dayguard = require('dayguard');

module.exports = function(feature, scenario) {
  if (scenario.dayguard || feature.dayguard) {
    var fixedPath = scenario.dayguard || feature.dayguard;

    dayguard.bind(this, {
      path: typeof fixedPath === 'string' ? fixedPath : undefined
    });
  } else {
    dayguard.unbind(this);
  }
};
