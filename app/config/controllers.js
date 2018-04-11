define( function ( require ) {

    "use strict";

    // requare all controllers
    return function( app ) {
        require( 'config/controllers/miscs' )( app );
    };
});
