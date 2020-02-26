//Подключем модули
const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

//Пути файлов CSS
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]
//Пути файлов JS
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]

exports.default = function() {
    return src('src/*.js')
      .pipe(babel())
      .pipe(dest('build/'));
  }

//Функция объединяет стили в один файл или складываем в папку build
function styles() {
    //Удаляем все файлы в папке CSS
    del(['build/css/*'])
    //Возвращаем массив с путями к файлам CSS
    return gulp.src(cssFiles)
    //Объединяем файлы из массива cssFiles в один файл
    .pipe(concat('style.css'))
    //Добавим префиксы
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions']
    }))
    //Минификация CSS
    .pipe(cleanCSS({
        level: 2
    }))
    //Выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
    //Обновляем браузер
    .pipe(browserSync.stream())
}

//Функция объединяет скрипты в один файл или складываем в папку build
function scripts() {
    //Удаляем все файлы в папке js
    del(['build/js/*'])
    return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    //Минификация JS
    .pipe(uglify({
        toplevel: true
    }))
    //Выходная папка для JS
    .pipe(gulp.dest('./build/js'))
    //Обновляем браузер
    .pipe(browserSync.stream())
}
//Наблюдатель за изменениями файлов
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Следить за CSS файлами
    gulp.watch('./src/css/**/*.css', styles)
    //Следить за JS файлами
    gulp.watch('./src/css/**/*.js', scripts)
    //При изменении html перезагружаем страницу
    gulp.watch('./*.html').on('change', browserSync.reload)
}

//Вызываем функцию объединения стилей
gulp.task('styles', styles);

//Вызываем функцию объединения скриптов
gulp.task('scripts', scripts);

//Отслеживаем события
gulp.task('watch', watch)

//Запускаем сборщик
gulp.task('build', gulp.series(gulp.parallel(styles, scripts)))

//Запускаем наблюдателя и сборщик
gulp.task('dev', gulp.series('build', 'watch'))