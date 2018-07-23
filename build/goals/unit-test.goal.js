import gulp from 'gulp';
import path from 'path';
import projectConfig from 'project.config';

import {Server} from 'karma';

gulp.task('unit-test',function(done){
  new Server({
    configFile : path.join(projectConfig.buildConfigPath, 'karma.conf.js'),
    singleRun  : true,
  }, done).start()
});
