// based on tutorial, "Gulp for Beginners" from Zell Liew, CSS-Tricks
// URL: https://css-tricks.com/gulp-for-beginners/

// run "gulp" to start watch, compile sass and browser sync
// run "gulp build" to create production files inside "dist" folder

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var pug = require('gulp-pug');

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and child dirs
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('pug', function buildHTML(){
    return gulp.src('app/views/**/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('watch', ['browserSync', 'sass', 'pug'], function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/views/**/*.pug', ['pug']);
    // Reloads the browse whenever HTML or JS files change
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

// concatenate and minify CSS and JS
gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function(){
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function(){
    return del.sync('dist');
});

gulp.task('cache:clear', function(){
    return cache.clearAll();
})

gulp.task('default', function(){
    runSequence(['sass', 'pug', 'browserSync', 'watch'])
})

gulp.task('build', function(){
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'])
})