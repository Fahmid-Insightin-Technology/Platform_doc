/*All Gulp Plugin*/
const { series, dest, src, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
const clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');



function html(cb) {
    return src('./src/*.html')
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(dest('build/'))
            .pipe(browserSync.stream({
                reload: true
            }));
    cb();
}

function scss(cb) {
    return src('./src/scss/*.scss')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('app.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('./build/css'))
   cb();
}


function images(cb) {
    return src('./src/images/**/*')
         .pipe(dest('./build/images'))
         .pipe(browserSync.stream({
             reload: true
         }))
 
 cb();
}

function icons(cb) {
    return src('./src/icons/**/*')
         .pipe(dest('./build/icons'))
 
 cb();
}

function file_clean(cb) {
    return src('./build', {read: false})
        .pipe(clean({force: true}))
    cb();
}

function server(cb) {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    cb();
}




const FontFiles = [
    './src/fonts/**/*'
];
  
  
function fonts(cb) {
    return src(FontFiles)
      .pipe(dest('./build/webfonts'))
    cb();
}



const jsFiles = [
    './src/vendor/jquery/jquery-3.6.0.min.js',
    './src/vendor/bootstrap-5.0.2/dist/js/bootstrap.bundle.js',
    './src/js/app.js'
];
  
function js(cb) {
return src( jsFiles,  { allowEmpty: true })
        .pipe(concat('bundle.min.js'))
        .pipe(dest('build/js'))
        .pipe(browserSync.stream({
            reload: true
        }));
cb();
}

/*All Demos*/
const jsFiles_demo = [
    './src/vendor/prismjs/prism.js',
];
function js_demo(cb) {
    return src( jsFiles_demo,  { allowEmpty: true })
            .pipe(concat('demo.min.js'))
            .pipe(dest('build/js'))
            .pipe(browserSync.stream({
                reload: true
            }));
    cb();
}


const cssFiles_demo = [
    './src/vendor/prismjs/prism.js',
];
function css_demo(cb) {
    return src('./src/vendor/prismjs/prism.css')
        .pipe(dest('./build/css'))
   cb();
}

watch('./src/**/*.html', series(html));
watch('./src/scss/**/*.scss', series(scss));
watch('./src/images/**/*', series(images));
watch('./src/js/**/*.js', series(js));

exports.default = series(file_clean, html, scss, js, js_demo, css_demo, images, icons, fonts, server);