const {src, dest, series, parallel, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const include = require('gulp-file-include');
const del = require('del')
const sync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename')

const profectFolder = 'dist';
const srcFolder = 'src';

const path = {
    build:{
        html:  `${profectFolder}/`,
        css:  `${profectFolder}/assets/css/`,
        img:  `${profectFolder}/assets/images/`,
        js:  `${profectFolder}/assets/js/`,
    },
    src: {
        html: `${srcFolder}/**.html`,
        css: `${srcFolder}/css/**.css`,
        scss: `${srcFolder}/scss/**.scss`,
        img: `${srcFolder}/images/**/*.{jpg,png,svg,gif,ico,webp}`,
        js: `${srcFolder}/js/**.js`,
    }
}


function html() {
    return src(path.src.html)
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(dest(path.build.html))
        .pipe(sync.stream())
}

function scss() {
    return src(path.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: true
        }))
        .pipe(dest(path.build.css))
        .pipe(csso())
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(sync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(dest(path.build.css))
        .pipe(sync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(dest(path.build.js))
        .pipe(sync.stream())
}

function img() {
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(sync.stream())
}

const clear = () => del(profectFolder)

function serve() {
    sync.init({
        server: './' + profectFolder,
        notify: false
    })
}

function watchFile() {
    watch([path.src.html], html)
    watch([path.src.scss], scss)
    watch([path.src.js], js)
    watch([path.src.img], img)
}

const build = series(clear, js, img, scss, html, css)
const watcher = parallel(build, watchFile, serve)
exports.html = html
exports.css = css
exports.js = js
exports.img = img
exports.scss = scss
exports.clear = clear

exports.build = build
exports.watcher = watcher   
exports.default = watcher   