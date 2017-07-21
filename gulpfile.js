'use strict';

var gulp             = require('gulp'),
    postcss          = require('gulp-postcss'),
    sass             = require('gulp-sass'),
    rigger           = require('gulp-rigger'),
    watch            = require('gulp-watch'),
    autoprefixer     = require('autoprefixer'),
    normalize        = require('node-normalize-scss'),
    cssmin           = require('gulp-minify-css'),
    sourcemaps       = require('gulp-sourcemaps'),
    sorting          = require('postcss-sorting'),
    browserSync      = require('browser-sync'),
    del              = require('del'),
    cache            = require('gulp-cache'),
    //sortingConfig = require('../posrcss-sorting.config.json'),
    // clearSvgProp     = require('remove-svg-properties').stream,
    // svgSprite        = require('gulp-svg-sprite'),
    // svgSpriteConfig  = {
    //     mode: {
    //         symbol: { // symbol mode to build the SVG
    //             render: {
    //                 css: {// CSS output option for icon sizing
    //                     dest: '../css/icons-sprite.css'
    //                 },
    //                 scss: false // SCSS output option for icon sizing
    //             },
    //             title: '%f icon',
    //             id: '%f',
    //             prefix: '.ds-icon-%s', // BEM-style prefix if styles rendered
    //             sprite: 'icons-sprite.svg', //generated sprite name
    //             example: {
    //                 dest: '../sprites.html'
    //             }, // Build a sample page, please!
    //             dest: '../images/'
    //         }
    //     }
    // },
    //svgFragments = require('postcss-svg-fragments'),

    imagemin = require('gulp-imagemin'),
    imageminConfig = {
        options: {
            optimizationLevel: 3,
            progessive: true,
            interlaced: true,
            removeViewBox:false,
            removeDimensions: false,
            removeComments:true,
            removeUselessStrokeAndFill:false,
            cleanupIDs:true
        }
    },

    path = {

        // Пути для готовых после сборки файлов
        build: {
            html: 'build/',
            js: 'build/js/',
            css: 'build/css/',
            img: 'build/images/',
            fonts: 'build/fonts/'
        },

        // Пути исходников
        src: {
            html: 'src/*.html',
            js: 'src/js/main.js',
            style: 'src/css/template_styles.scss',
            img: 'src/images/',
            fonts: 'src/fonts/**/*.*'
        },

        watch: {
            html: 'src/**/*.html',
            style: 'src/css/**/*.+(scss|sass)',
            js: 'src/js/**/*.js'
        }
    },

    srverConfig = {
        server: {
            baseDir: './build'
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "Resolve"
    };

// TODO [danil]: Запуск локального сервера
gulp.task('webserver', function () {
    browserSync(srverConfig);
});

// TODO [danil]: Очистка папок
gulp.task('clean', function() {
    return del.sync('build'); // Удаляем папку build перед сборкой
});

// TODO: Собираем html
gulp.task('html:build', function () {
    gulp.src(path.src.html) // Выберем файлы по нужному пути
        .pipe(rigger()) // Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) // Сохраним
        .pipe(browserSync.reload({stream:true}));
});

// TODO [danil]: Сборка JS
gulp.task('js:build', function() {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));
});

// TODO [danil]: Сборка css
gulp.task('style:build', function () {
    var processors = [
        autoprefixer({browsers: ['last 6 versions']})
    ];
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: normalize.includePaths}))
        .pipe(postcss(processors))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));
});


// TODO [danil]: Сборка графики
gulp.task('images:build', function() {
    gulp.src(path.src.img + '**/*.*')
        .pipe(cache(imagemin(imageminConfig)))
        .pipe(gulp.dest(path.build.img))
});

// TODO: Сборка шрифтов
gulp.task('fonts:build', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
});

// TODO [danil]: Описание watcher
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
});

// TODO: Полная сборка
gulp.task('buildFull', [
    'clean',
    'html:build',
    'style:build',
    'js:build',
    'fonts:build',
    'images:build'
]);

gulp.task('buildLight', [
    'style:build',
    'js:build',
    'html:build'
]);

gulp.task('default', ['buildLight', 'webserver', 'watch']);


// TODO [danil]: Билд спрайтов -
/*
gulp.task('sprites:build', function () {
    return gulp.src(path.src.img + 'sprite-icons/*.svg')// исходники
        .pipe(clearSvgProp.remove({
            properties: [
                clearSvgProp.PROPS_FILL,
                clearSvgProp.PROPS_STROKE,
                clearSvgProp.PROPS_FONT
            ],
            namespaces: ['i', 'sketch', 'inkscape']
        }))
        .pipe(imagemin(imageminConfig)) // сжимаем
        .pipe(svgSprite(svgSpriteConfig)) // склеиваем
        .pipe(gulp.dest(path.build.img)); // сохраняем
}); */













