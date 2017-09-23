'use strict';

var gulp             = require('gulp'),
    postcss          = require('gulp-postcss'),
    sass             = require('gulp-sass'),
    rigger           = require('gulp-rigger'),
    rev              = require('gulp-rev-append'),
    watch            = require('gulp-watch'),
    autoprefixer     = require('autoprefixer'),
    normalize        = require('node-normalize-scss'),
    cssmin           = require('gulp-minify-css'),
    sourcemaps       = require('gulp-sourcemaps'),
    sorting          = require('postcss-sorting'),
    browserSync      = require('browser-sync'),
    del              = require('del'),
    cache            = require('gulp-cache'),
    imagemin         = require('gulp-imagemin'),
    cheerio          = require('gulp-cheerio'),
    replace          = require('gulp-replace'),
    svgSprite        = require('gulp-svg-sprite'),
    svgmin           = require('gulp-svgmin'),

    // TODO: Конфигурация минифицирования изображений
    imageminConfig = {
        options: {
            optimizationLevel: 3,
            progessive: true,
            interlaced: true,
            removeViewBox:false,
            removeDimensions: false,
            removeComments:false,
            removeUselessStrokeAndFill:false,
            cleanupIDs:false
        }
    },

    path = {
        // TODO: Пути для сборки
        build: {
            html: 'build/',
            js: 'build/js/',
            css: 'build/css/',
            img: 'build/images/'
        },

        // TODO: Пути исходников
        src: {
            html: 'src/*.html',
            js: 'src/js/*.js',
            styles: 'src/css/*.*',
            img: 'src/images/'
        },

        // TODO: Пути для watcher
        watch: {
            html: 'src/**/*.html',
            style: 'src/css/**/*.+(scss|sass)',
            img: 'src/images/',
            js: 'src/js/**/*.js'
        }
    },

    // TODO: Конфигурация сервера
    srverConfig = {
        server: {
            baseDir: './build'
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "Resolve"
    };


//  TODO: Запуск локального сервера
gulp.task('webserver', function () {
    browserSync(srverConfig);
});

// TODO: Очистка папок
gulp.task('clean', function() {
    return del.sync('build'); // Удаляем папку build перед сборкой
});

// TODO: Сборка HTML
gulp.task('html:build', function () {
    gulp.src(path.src.html) // Выберем файлы по нужному пути
        .pipe(rev())
        .pipe(rigger()) // Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) // Сохраним
        .pipe(browserSync.reload({stream:true}));
});

// TODO: Сборка JS
gulp.task('js:build', function() {
    gulp.src(path.src.js)
        .pipe(rev())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));
});

// TODO: Сборка CSS
gulp.task('style:build', function () {
    var processors = [
        autoprefixer({browsers: ['last 6 versions']})
    ];
    return gulp.src(path.src.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: normalize.includePaths}))
        .pipe(postcss(processors))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));
});

// TODO: Сборка графики
gulp.task('images:build', function() {
    gulp.src(path.src.img + '**/*.*')
        .pipe(cache(imagemin(imageminConfig)))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({stream: true}));
});

// TODO: Задачи watcher
gulp.task('watch', function(){
    watch([path.watch.html], function(event) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event) {
        gulp.start('images:build');
    });
});

// TODO: Полная сборка
gulp.task('buildFull', [
    'clean',
    'html:build',
    'style:build',
    'js:build',
    'images:build'
]);

// TODO: Легкая сборка
gulp.task('buildLight', [
    'style:build',
    'js:build',
    'images:build',
    'html:build'
]);

//  TODO: Задача по умолчанию
gulp.task('default', ['buildLight', 'webserver', 'watch']);















