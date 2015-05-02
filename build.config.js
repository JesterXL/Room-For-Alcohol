
var packageJSON = require('./package.json');

var config = {

  buildFilesAndDirectoriesToClean: ['build', 'coverage', 'reports'],

  client: {
    baseDirectory: 'src/client',
    sourceFiles:     ['*.module.js',
                      '*.js', 
                      '**/*.module.js',
                      '**/*.js', 
                      '!*.spec.js', 
                      '!**/*.spec.js', 
                      '!Gruntfile.js', 
                      '!gulpfile.js'],
    templateFiles: ['*.directive.html', '**/*.directive.html'],
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
    var base = config.client;
    base.sourceFiles = config.prefixPath(base.sourceFiles, base.baseDirectory);
    base.testFiles = config.prefixPath(base.testFiles, base.baseDirectory);
    base.templateFiles = config.prefixPath(base.templateFiles, base.baseDirectory);
  },

  karma: {
    configFile: 'karma.config.js',
    moduleName: 'roomForAlcohol',
    files: ['src/client/*.module.js',
            'src/client/*.js',
            'src/client/**/*.module.js',
            'src/client/**/*.js',
            'src/client/*.spec.js', 
            'src/client/**/*.spec.js',
            'src/client/*.directive.html',
            'src/client/**/*.directive.html']
  },

  staticServer: {
    file: './src/static/app.js',
    nodemonWatchFiles: ['src/api/**/*.js', 'src/static/**/*.js'],
    port: 8553
  }

  
};

config.normalizeSourceFiles();

module.exports = config;