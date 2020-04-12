//Подключем модули
const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');


//Пути файлов SASS
const sassFiles = [
    './src/sass/main.sass'
    // './src/sass/media.sass'
]
//Пути файлов CSS
// const cssFiles = [
//     './src/css/*.css',
//     './src/css/media.css'
// ];
//Пути файлов JS
const jsFiles = [
    './src/js/*.js'
    // './src/js/main.js'
];
//Пути файлов HTML
const htmlFiles = [
    './src/*.html'
];
//Пути файлов IMG
const imgFiles = [
    './src/img/**'
];

exports.default = function () {
    return gulp.src(jsFiles)
        .pipe(babel())
        .pipe(dest('dist/'));
};

//Функция объединяет файлы sass, ставим префикси, минифицируем и переносим в папку dist
function styles() {
    //Удаляем все файлы в папке CSS
    del(['dist/css/*']);
    //Возвращаем массив с путями к файлам SASS
    return gulp.src(sassFiles)
        //Объединяем файлы из массива sassFiles в один файл
        .pipe(concat('style.sass'))
        //Инициализируем карту
        .pipe(sourcemaps.init())
        //Компилируем из sass в css
        .pipe(sass())
        //Добавим префиксы
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        }))
        // //Минификация CSS
        // .pipe(cleanCSS({
        //     level: 2
        // }))
        //Записываем карту
        .pipe(sourcemaps.write('./'))
        //Переносим в папку для стилей
        .pipe(gulp.dest('./dist/css'))
        //Обновляем браузер
        .pipe(browserSync.stream())
}

//Функция объединяет скрипты в один файл или складываем в папку dist
function scripts() {
    //Удаляем все файлы в папке js
    del(['dist/js/*']);
    return gulp.src(jsFiles)
        .pipe(concat('script.js'))
        //Минификация JS
        .pipe(uglify({
            toplevel: true
        }))
        //Выходная папка для JS
        .pipe(gulp.dest('./dist/js'))
        //Обновляем браузер
        .pipe(browserSync.stream())
}

//Функция удаляет html в папке dist и переносит из папки src
function htmlChange() {
    del(['dist/*.html']);
    return gulp.src(htmlFiles)
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream())
}

//Clean img in folder dist/img and copy from folder src/img
function imgChange() {
    del(['dist/img/**']);
    return gulp.src(imgFiles)
        .pipe(gulp.dest('./dist/img/'))
        .pipe(browserSync.stream())
}
function fontsChange() {
    del(['dist/fonts/**']);
    return gulp.src(['./src/fonts/**'])
        .pipe(gulp.dest('./dist/fonts/'))
        .pipe(browserSync.stream())
}

//Наблюдатель за изменениями файлов
function watchs() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    //Следить за CSS файлами
    // gulp.watch('./src/css/**/*.css', styles);
    //Следить за JS файлами
    gulp.watch('./src/css/**/*.js', scripts);
    //Watch for changes html files
    gulp.watch('./src/*.html', htmlChange);
    //При изменении html перезагружаем страницу
    gulp.watch('./src/*.html').on('change', browserSync.reload);
    //Watch for changes img folder
    gulp.watch('./src/img/**', imgChange);
    //Watch fo changes fonts folder
    gulp.watch('./src/fonts/**', fontsChange);
    //Watch for changes styles files
    gulp.watch('./src/sass/**/*.sass', gulp.series('styles'));
    //Watch for changes JS files
    gulp.watch('./src/js/**/*.js', gulp.series('scripts'));
}

//Вызываем функцию объединения стилей
gulp.task('styles', styles);

//Вызываем функцию объединения скриптов
gulp.task('scripts', scripts);

//Отслеживаем события
gulp.task('watchs', watchs);

//Запускаем сборщик
gulp.task('build', gulp.series(gulp.parallel(styles, scripts, htmlChange, imgChange, fontsChange)));

//Запускаем наблюдателя и сборщик
gulp.task('dev', gulp.series('build', 'watchs'));

