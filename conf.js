exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['src/client/basicProtractor.spec.js',
  			'src/client/roomForAlcohol.route.spec.js']
};