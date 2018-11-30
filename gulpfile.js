// https://haniwaman.com/gulp/

const gulp = require('gulp');
const browserSync = require('browser-sync');

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './public',
      index: 'index.html'
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch('./public/*.html', ['bs-reload']);
});
