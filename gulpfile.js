var gulp;
var uglify;
var rename;

gulp = require('gulp');
uglify = require('gulp-uglify');
rename = require("gulp-rename");

/**
 *
 */
gulp.task('build', function () {
    return gulp.src('./src/gulpury.js')
        .pipe(uglify())
        .pipe(rename('gulpury.min.js'))
        .pipe(gulp.dest('./dist'));
});

/**
 *
 */
gulp.task('watch', ['build'], function () {
    gulp.watch('./src/gulpury.js', ['build']);
});

gulp.task('default', ['watch']);