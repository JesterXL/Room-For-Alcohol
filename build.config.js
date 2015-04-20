
var packageJSON = require('./package.json');

module.exports = {
  

  client: {
    baseDirectory: 'src/client',
    sourceFiles:     ['src/client/**/*.js', '!src/client/**/*.spec.js', '!Gruntfile.js', '!gulpfile.js'],
    testFiles:       ['src/client/**/*.spec.js'],
    buildDirectory:  'build'
  },

  karma: {
    configFile: 'karma.conf.js',
    files: ['src/client/**/*.module.js',
            'src/client/**/*.js',
            'src/client/**/*.html',
            'src/client/**/*.spec.js']
  }


  // staticServerConfig = {
  //   srcFiles:    ['src/static/**/*.js'],
  //   destDir:     'build/static',
  //   srcBaseDirs: ['src/static'],
  //   main:        'src/static/server.js',
  //   port: 8628,
  //   watchFiles:    ['src/static/**/*'],
  //   reloadWatchfile: '.reloadStatic'
  // }

  
};