import gulp from 'gulp';
import sonarqubeScanner from 'sonarqube-scanner';
import projectConfig from 'project.config';

gulp.task('sonar', () => new Promise((ok) => {
    sonarqubeScanner({
      serverUrl : projectConfig.sonarqube.serverUrl,
      options   : projectConfig.sonarqube,
    }, ok);
  })
);
