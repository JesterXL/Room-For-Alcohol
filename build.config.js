
var packageJSON = require('./package.json');

module.exports = {
  

  client: {
    baseDirectory: 'src/client',
    sourceFiles:     ['*.js', '**/*.js', '!*.spec.js', '!**/*.spec.js', '!Gruntfile.js', '!gulpfile.js'],
    testFiles:       ['src/client/*.spec.js', 'src/client/**/*.spec.js'],
    lessFiles:  {'build/roomForAlcohol.css': 'src/client/roomForAlcohol.less'},
    buildDirectory:  'build',
    coverageDirectory: 'coverage',
    sourceIndexFile: 'src/client/index.html',
    buildIndexFile: 'build/index.html',
    injectorFiles: {
                    'build/index.html': ['src/client/*.js',
                                          'src/client/**/*.module.js',
                                          'src/client/**/*.js',
                                          'src/client/**/*.css',
                                          'src/client/*.css']
                    }
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