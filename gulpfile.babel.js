import gulpRequireTasks from 'gulp-require-tasks';
import config from 'project.config';
require('babel-polyfill');

gulpRequireTasks({
  path: config.buildGoalsPath,
});
