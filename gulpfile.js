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
    return gulp.src('./src/gulper.js')
        .pipe(uglify())
        .pipe(rename('gulper.min.js'))
        .pipe(gulp.dest('./dist'));
});

/**
 *
 */
gulp.task('watch', ['build'], function () {
    gulp.watch('./src/gulper.js', ['build']);
});

gulp.task('default', ['watch']);