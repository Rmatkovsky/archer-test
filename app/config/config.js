define( function () {

  "use strict";

  return ['$httpProvider', '$locationProvider', function( $httpProvider, $locationProvider ) {

    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.defaults.useXDomain = true;

    $locationProvider.html5Mode( true );

  }];
});
