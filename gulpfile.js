//Подключем модули
const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');


//Пути файлов SASS
const sassFiles = [
    './src/sass/main.sass',
    './src/sass/media.sass'
]
//Пути файлов CSS
// const cssFiles = [
//     './src/css/main.css',
//     './src/css/media.css'
// ]
//Пути файлов JS
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]

exports.default = function() {
    return src('src/*.js')
      .pipe(babel())
      .pipe(dest('public/'));
  }

//Функция объединяет файлы sass, ставим префикси, минифицируем и переносим в папку public
function styles() {
    //Удаляем все файлы в папке CSS
    del(['public/css/*'])
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
    //Минификация CSS
    .pipe(cleanCSS({
        level: 2
    }))
    //Записываем карту
    .pipe(sourcemaps.write('./'))
    //Переносим в папку для стилей
    .pipe(gulp.dest('./public/css'))
    //Обновляем браузер
    .pipe(browserSync.stream())
}

//Функция объединяет скрипты в один файл или складываем в папку public
function scripts() {
    //Удаляем все файлы в папке js
    del(['public/js/*'])
    return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    //Минификация JS
    .pipe(uglify({
        toplevel: true
    }))
    //Выходная папка для JS
    .pipe(gulp.dest('./public/js'))
    //Обновляем браузер
    .pipe(browserSync.stream())
}

//Наблюдатель за изменениями файлов
function watchs() {
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

    gulp.watch('./src/sass/**/*.sass', gulp.series('styles'))
}



//Вызываем функцию объединения стилей
gulp.task('styles', styles);

//Вызываем функцию объединения скриптов
gulp.task('scripts', scripts);

//Отслеживаем события
gulp.task('watchs', watchs)

//Запускаем сборщик
gulp.task('build', gulp.series(gulp.parallel(styles, scripts)))

//Запускаем наблюдателя и сборщик
gulp.task('dev', gulp.series('build', 'watchs'))

