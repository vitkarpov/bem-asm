var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function () {
    return gulp.src('tests/tests.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});
