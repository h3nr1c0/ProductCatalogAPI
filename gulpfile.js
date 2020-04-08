const gulp = require('gulp')
const apidoc = require('gulp-apidoc')

gulp.task('apidoc', (done) => {
  apidoc({
    src: './routes',
    dest: './docs/apidocs'
  }, done)
})

gulp.task('watch', () => {
  gulp.watch(['./routes/**'], ['apidoc'])
})
