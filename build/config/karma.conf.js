import path from 'path';
import webpack from 'webpack';
import projectConfig from 'project.config';

module.exports = function(config) {

  const SRC_DIR = path.join(process.cwd(), 'src');
  config.set({
    basePath   : process.cwd(),
    frameworks : [ 'jasmine' ],
    files      : [
      '**/*.spec.tsx',
    ],
    webpack : {
      context : SRC_DIR,
      devtool : 'source-map',
      mode   : 'development',
      module : {
        rules : [
          {
            test    : /\.ts(x?)$/,
            include : [ SRC_DIR ],
            exclude : [/(node_modules)/],
            use     : [
              {
                loader: 'babel-loader'
              },
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true
                }
              }
            ]
          },
          {
            test    : /\.js(x?)$/,
            include : [ SRC_DIR ] ,
            exclude : [/(node_modules)/],
            use     : [
              {
                loader: 'babel-loader'
              }
            ]
          },
          {
            test    : /\.[tj]s(x?)$/i,
            exclude : /(node_modules|(?:spec\.[tj]s(x?)$))/,
            enforce : 'pre',
            use     : {
              loader: 'istanbul-instrumenter-loader',
              options:{
                esModules: true
              }
            }
          },
          {
            test    : /\.js(x?)$/,
            include : config.srcPath,
            exclude : /(node_modules|(?:\.spec\.js(x?)$))/,
            enforce : 'pre',
            use     : {
              loader :'eslint-loader',
              options : {
                configFile: path.join(projectConfig.checkStylePath, 'eslint.config.json')
              }
            }
          },
          {
            test    : /\.ts(x?)$/,
            include : config.srcPath,
            exclude : /(node_modules|(?:\.spec\.ts(x?)$))/,
            enforce : 'pre',
            use     : {
              loader :'tslint-loader',
              options : {
                configFile: path.join(projectConfig.checkStylePath, 'tslint.config.json')
              }
            }
          }
        ]
      },
      externals: {
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
      plugins: [
        new webpack.ProvidePlugin({
          'React' : 'react'
        })
      ],
      resolve: {
        extensions : [
          '.js', '.jsx', '.ts', '.tsx', '.scss'
        ],
        modules : [
          'src',
          'node_modules'
        ]
      }
    },
    preprocessors : {
      '**/*.spec.ts'  : [ 'webpack', 'sourcemap' ],
      '**/*.spec.tsx' : [ 'webpack', 'sourcemap' ],
      '**/*.spec.js'  : [ 'webpack', 'sourcemap' ]
    },
    reporters : [
      'progress', 'coverage-istanbul'
    ],
    browsers : ['chrome_driver_local'],
    customLaunchers : {
      chrome_driver_local : {
        base: 'Selenium',
        browserName: 'chrome',
        name: 'Karma test',
        config : {
          host: 'localhost',
          port: 4444,
          path: '/wd/hub',
          desiredCapabilities: {
            chromeOptions: {
              args: [ '--disable-gpu', '--no-sandbox'], //'--headless',
            },
            browserName: 'chrome',
          }
        }
      },
    },
    plugins: [
      'karma-coverage-istanbul-reporter',
      'karma-jasmine',
      'karma-selenium-launcher',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
    coverageIstanbulReporter: {
      reports: ['lcov', 'json'],
      dir: path.join(process.cwd(), 'reports', 'unit-coverage'),
      combineBrowserReports: true,
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
      'report-config': {
        'lcov': { file : 'lcov.info' },
        'json': { file : 'coverage.json' }
      },
    }
  })
};
