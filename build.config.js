
var packageJSON = require('./package.json');

var config = {

  buildFilesAndDirectoriesToClean: ['build', 'coverage', 'reports'],

  client: {
    baseDirectory: 'src/client',
    sourceFiles:     ['*.js', '**/*.js', '!*.spec.js', '!**/*.spec.js', '!Gruntfile.js', '!gulpfile.js'],
    testFiles:       ['*.spec.js', '**/*.spec.js'],
    globals: ['angular'],
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
                                          'src/client/*.css',
                                          '!src/client/*.spec.js', 
                                          '!src/client/**/*.spec.js', 
                                          '!Gruntfile.js', 
                                          '!gulpfile.js']
                    }
  },

  prefixPath: function(listOfFiles, prefix)
  {
    return listOfFiles.map(function(item)
    {
      if(item.charAt(0) != '!')
      {
        return config.client.baseDirectory + '/' + item;
      }
      else
      {
        return item;
      }
    });
  },

  normalizeSourceFiles: function()
  {
    config.client.sourceFiles = config.prefixPath(config.client.sourceFiles, config.client.baseDirectory);
    config.client.testFiles = config.prefixPath(config.client.testFiles, config.client.baseDirectory);
  },

  karma: {
    configFile: 'karma.config.js',
    moduleName: 'room-for-alcohol',
    files: ['src/client/*.module.js',
            'src/client/*.js',
            'src/client/**/*.module.js',
            'src/client/**/*.js',
            'src/client/*.spec.js', 
            'src/client/**/*.spec.js']
  },

  staticServer: {
    file: './src/static/app.js',
    nodemonWatchFiles: ['src/api/**/*.js', 'src/static/**/*.js'],
    port: 8553
  }

  
};

config.normalizeSourceFiles();

module.exports = config;