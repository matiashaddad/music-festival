// function tarea( callback ) {
//     console.log("mi primer tarea");
//     callback();
// }
// exports.primerTarea = tarea;

const { src, dest, watch, parallel } = require("gulp"); // src encuentra un archivo, dest lo guarda, watch p cambios, parallel p ejecutar + tareas

// CSS

const sass = require("gulp-sass")(require('sass'));     //se deben usar ambos requires
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');


// IMAGENES
const cache = require('gulp-cache');
const imagemin = require( 'gulp-imagemin' );
const webp = require('gulp-webp');
const avif = require('gulp-avif');


// JavaScript
const terser = require('gulp-terser-js');


function css( done ) {
    src('src/scss/**/*.scss')        // Identificar archivo SASS con API
        .pipe( sourcemaps.init() )
        .pipe( plumber() )
        .pipe( sass() )             // Compilar SASS en scripts, viene de las dependencias; se ejecuta con .pipe()
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/css') )  // Almacenar en disco; se usa el otro pipe()
    done(); //Callback que avisa a gulp el final de ejecucion. Puede llamarse done, callback, cb...
}
exports.css = css;


function imagenes( done ) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(opciones) ) )
        .pipe( dest('build/img') )
    done();
}
exports.imagenes = imagenes;


function versionWebp( done ) {
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )     // convierte imagenes a webp
        .pipe( dest('build/img') )  //almacena en disco
    done();
}
exports.versionWebp = versionWebp;


function versionAvif( done ) {
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )     // convierte imagenes a webp
        .pipe( dest('build/img') )  //almacena en disco
    done();
}
exports.versionAvif = versionAvif;


function javascript( done ) {
    src('src/js/**/*.js')
        .pipe( sourcemaps.init() )
        .pipe( terser() )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/js') );
    done();
}
exports.js = javascript;


function dev( done ) {
    watch('src/scss/**/*.scss', css);     //css en este caso es la funcion css()
    watch('src/js/**/*.js', javascript);
    done();
}
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev );