define( function ( require ) {

    "use strict";

    // requare all services
    return function( app ) {

        app.service( '$activeModel',                        require( 'services/active-model' ) );
        app.service( '$activeController',                   require( 'services/active-controller' ) );
        app.service( 'utils',                               require( 'services/utils' ) );
        app.service( 'roleRestriction',                     require( 'services/roleRestriction' ) );

    };
});
