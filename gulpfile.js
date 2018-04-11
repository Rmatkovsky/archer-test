require('es6-shim');

var gulp            = require('gulp'),
    gulputils       = require('gulp-util'),
    plumber         = require('gulp-plumber'),
    sass            = require('gulp-sass'),
    csso            = require('gulp-csso'),
    requirejs       = require('requirejs'),
    preprocess      = require('gulp-preprocess'),
    templateCache   = require('gulp-angular-templatecache'),
    minifyHtml      = require('gulp-minify-html'),
    rename          = require('gulp-rename'),
    webserver       = require('gulp-webserver'),
    argv            = require('yargs').argv,
    gulpif          = require('gulp-if'),
    htmlify         = require('gulp-angular-htmlify'),

    env = (argv.env || 'dev').toLowerCase(),
    isDev = true
    isBuild = (argv['_'].indexOf('build') !== -1), /* isBuild: disabled "watch" tasks, output to /build dir */
    isProd = !isDev,
    isLocalServerEnabled = (isBuild && argv['_'].indexOf('server') !== -1),

    // Main configuration
    config = {
      host:           'localhost',
      port:           3000,
      indexFile:      'index.html',
      devRootFolder:  'app',
      prodRootFolder: 'build',
      livereloadPort: 3577,
      getServerURL:   function () { return ['http://', this.host, ':', this.port].join(""); },
      errorHandler:   function ( err )  {
                                          gulputils.beep();
                                          gulputils.log(  gulputils.colors.white.bgRed.bold("!!!!!!!!!!!!!!!!!!!!!!!! ERROR "), "\n", err );
                                        },
      getEnvDestFolder:
                      function () { return isBuild ? this.prodRootFolder : this.devRootFolder; },
      src: {
        index:        'app/views/index.tmpl.html',
        styles:       'app/assets/styles/*.scss',
        scripts:      'app/**/*.js',
        templates: [
                      'app/views/**/*.html',
                      '!app/views/index.tmpl.html'
        ],
        resourcesToMove: [
                      'app/assets/images/**/*.*',
                      'app/assets/fonts/**/*.*',
                      'app/vendors/**/*.*'
        ],
        apiToMove: 'api/*.*'
      },
      dest: {
        webxml:       'web.config',
        styles:       'app/assets/styles/',
        templates:    'app/assets/scripts/',

        buildScripts: 'build/js/',
        buildStyles:  'build/assets/styles/'
      },
      requirejs: {
        baseUrl:      'app',
        getOutPath:   function () { return config.dest.buildScripts + 'index.min.js'; },
        configFile:   'app/index.js',
        includeFiles: function () { return ['vendors/require']; }
      }
  };

isBuild && console.log('\x1B[31m' + 'Building project for production (concat, minify, uglify) ...' + '\x1B[39m');

/**
 * Gulp Main tasks
 * `$ gulp work` (or) simple `$ gulp` is used for local environment development
 * `$ gulp build --env=dev` is used to produce production ready compiled, minimized version of html,js,css
 */


/**
 * PRODUCTION tasks
 */

gulp.task('compile-scripts', ['templates2js'], function () {
    requirejs.optimize({
        baseUrl:                  config.requirejs.baseUrl,
        name:                     'index',
        out:                      config.requirejs.getOutPath(),
        mainConfigFile:           config.requirejs.configFile,
        include:                  config.requirejs.includeFiles(),
        waitSeconds:              60,
        optimize:                 'none', // change it to uglify2 back again, after fixing angular DI
        removeCombined:           true,
        keepBuildDir:             true,
        preserveLicenseComments:  false,
        useStrict:                true
    });
});

gulp.task('build', ['clean-build', 'templates2js'], function () {
    gulp.start('copy-assets');
    gulp.start('copy-api');
    gulp.start('styles');
    gulp.start('preprocess');
    gulp.start('build-scripts');

    if (isLocalServerEnabled) {
        gulp.start('server');
    }
});

gulp.task('clean-build', function () {
    var clean = require('gulp-clean');
    return gulp.src(config.prodRootFolder, {read: false})
        .pipe(clean());
});

/* "Internal" gulp tasks */
gulp.task('copy-assets', function () {
    gulp.src( config.src.resourcesToMove, {
        base: config.devRootFolder
    }).pipe(gulp.dest(config.getEnvDestFolder()));
});

/* "Internal" gulp tasks */
gulp.task('copy-api', function () {
    gulp.src( config.src.apiToMove, {
        base: 'api'
    }).pipe(gulp.dest(config.getEnvDestFolder() + '/api'));
});

/* "Internal" gulp tasks */
gulp.task('copy-scripts', function () {
    gulp.src(config.src.scripts, {
        base: config.devRootFolder
    }).pipe(gulp.dest(config.getEnvDestFolder()));
});

gulp.task('build-scripts', function () {
    /* Copy scripts to build directory on build:dev */
    /* Compile & optimize scripts to build directory on build:prod */
    isDev ? gulp.start('copy-scripts') : gulp.start('compile-scripts');
});

gulp.task( 'watch', function () {
  gulp.watch( config.src.styles,    ['styles'] );
  gulp.watch( config.src.templates, ['templates2js'] );
  gulp.watch( config.src.index,     ['preprocess'] );
});

gulp.task( 'templates2js' , function () {
  return gulp.src( config.src.templates )
          .pipe(htmlify())
          .pipe( minifyHtml({
              empty:  true,    // do not remove empty attributes
              spare:  true,    // do not remove redundant attributes
              quotes: true     // do not remove arbitrary quotes
          }))
          .pipe( templateCache( { standalone: true } ) )
          .pipe( gulp.dest( config.dest.templates ) );
});

gulp.task( 'styles', function () {
  return gulp.src( config.src.styles )
          .pipe( plumber( { errorHandler: config.errorHandler } ) )
          .pipe( sass({
            outputStyle: (isDev ? 'nested' : 'compressed'),
            sourceComments: (isDev ? 'normal' : 'none'),
            errLogToConsole: !isBuild   // fail sass task on error|
          }))
          // .pipe( autoprefixer( 'last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ) )
          .pipe(rename('index.css'))
          .pipe(gulpif( isProd, csso() ))
          .pipe( gulp.dest( isBuild ? config.dest.buildStyles : config.dest.styles ) );
});

gulp.task( 'preprocess', function () {
  gulp.src( config.src.index )
    .pipe(preprocess({
            context: {
                isBuild: isBuild,
                isDev:   isDev,
                isProd:  isProd,
                env:     env
            }
    }))
    .pipe( gulpif( isBuild, minifyHtml ( {
      empty:  true,
      spare:  true,
      quotes: true
    })))
    .pipe( htmlify() )
    .pipe( rename( config.indexFile ) )
    .pipe( gulp.dest( config.getEnvDestFolder() ) );
});


gulp.task('server', function() {
    gulp.src('build')
        .pipe(webserver({
            livereload: true,
            port: config.port,
            directoryListing: false,
            open: true
        }));
});

gulp.task( 'work', ['preprocess', 'styles', 'templates2js', 'watch'], function () {
    gulp.start( 'server' );
});
gulp.task( 'default', ['work'] );
