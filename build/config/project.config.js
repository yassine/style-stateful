import path from 'path';
import deepmerge from 'deepmerge';
import fs from 'fs';

const root                  = process.cwd(),
      buildDirname          = path.join(root, 'build'),
      srcDirname            = path.join(root, 'src'),
      buildConfigDirname    = path.join(buildDirname, 'config'),
      buildGoalsPathDirname = path.join(buildDirname, 'goals'),
      checkStylePathDirname = path.join(buildDirname, 'checkstyle'),
      loaderPathDirname     = path.join(buildDirname, 'loader'),
      targetPathDirname     = path.join(root, 'dist');

const defaultConfig = {
  buildConfigPath : buildConfigDirname,
  buildGoalsPath  : buildGoalsPathDirname,
  buildPath       : buildDirname,
  checkStylePath  : checkStylePathDirname,
  loaderPath      : loaderPathDirname,
  srcPath         : srcDirname,
  targetPath      : targetPathDirname,
  sonarqube       : {
    serverUrl     : 'https://sonarcloud.io',
    'sonar.projectKey'   : 'com.github.yassine:style-stateful',
    'sonar.organization' : 'yassine-github',
    'sonar.login'        : process.env.SONAR_TOKEN,
    'sonar.javascript.lcov.reportPaths' : path.join(process.cwd(), 'reports', 'unit-coverage', 'lcov.info'),
    'sonar.typescript.lcov.reportPaths' : path.join(process.cwd(), 'reports', 'unit-coverage', 'lcov.info'),
    'sonar.exclusions' : 'src/globals.d.ts, **/node_modules/**, reports/**, build/**, **/*.spec.ts, **/*.spec.tsx, **/*.spec.js, **/*.spec.jsx, **/*.*spec.ts, **/*.*spec.tsx, **/*.*spec.js, **/*.*spec.jsx, gulpfile.babel.js',
  }
};

let configOverrides = {};
try{
  fs.accessSync(path.join(__dirname, 'project.config.private-overrides.js'));
  configOverrides = require('./project.config.private-overrides.js').default;
}catch (e){
  //no override file
}

export default deepmerge(defaultConfig, configOverrides);

