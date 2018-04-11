define( function ( require ) {

    "use strict";

    // requare all routes
    return ['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ) {
        $urlRouterProvider.otherwise('/404');

        require( './routes/static' )( $stateProvider );
  }];
});
// не вижу смысла выносить роуты в отдельный файл, тут им самое место