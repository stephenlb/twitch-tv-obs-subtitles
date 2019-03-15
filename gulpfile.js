const gulp    = require('gulp');
const htmlmin = require('gulp-htmlmin');
const merge   = require('gulp-merge');
const concat  = require('gulp-concat');
const cssmin  = require('gulp-clean-css');
const jsmin   = require('gulp-uglify-es').default;
const wrapper = require('gulp-wrapper');
const Markers = require('gulp-markers');
const markers = new Markers();

markers.addMarker({
    tag     : 'js-removal',
    re      : /<\/?script[^>]*>/,
    replace : e => ''
});

markers.addMarker({
    tag     : 'css-removal',
    re      : /<link rel="stylesheet"[^>]*>/,
    replace : e => ''
});

markers.addMarker({
    tag     : 'title-removal',
    re      : /<title>[^<]+<\/title>/,
    replace : e => ''
});

gulp.task( 'html', e => {
    return merge(

        gulp
        .src('css/dashboard.css')
        .pipe(cssmin({}))
        .pipe(wrapper({ header : '<style>', footer : '</style>' })),

        gulp
        .src('dashboard.html')
        .pipe(markers.replaceMarkers())
        .pipe(htmlmin({ collapseWhitespace : true, removeComments : true })),

        gulp
        .src('js/request.js')
        .pipe(jsmin())
        .pipe(wrapper({ header : '<script>', footer : '</script>' })),

        gulp
        .src('js/portal.js')
        .pipe(jsmin())
        .pipe(wrapper({ header : '<script>', footer : '</script>' })),

        gulp
        .src('js/dashboard.js')
        .pipe(jsmin())
        .pipe(wrapper({ header : '<script>', footer : '</script>' }))

    ).pipe(concat('dashboard.html')).pipe(gulp.dest('build'));
} );

gulp.task( 'default', gulp.series('html') );
