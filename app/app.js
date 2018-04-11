define( function ( require, exports, module ) {

  "use strict";

   /**
   * Loading App global modules / dependencies
   */
    require( 'angularRouter' );
    require( 'templates' );
    require( 'angularResource' );

    var angular = require( 'angular' ),
    // init module
    app = angular.module( 'app', ['ui.router','ngResource', 'templates'] );

    // configure APP module
    app.config( require( 'config/config' ) );
    app.config( require( 'config/routes' ) );
    app.run(    require( 'config/bootstrap' ) );

    // require and create services
    require( 'config/services' )( app );

    // require and create models
    require( 'config/models' )( app );

    // require and create controllers
    require( 'config/controllers' )( app );

    //bootstrap angular
    angular.element( document.documentElement ).ready( function () {
      angular.bootstrap( document, [app.name] );
    });

    module.exports = app;

});
