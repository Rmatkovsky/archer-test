define( function ( require ) {

    "use strict";

    // requare all models
    return function( app ) {

        app.service( 'currentUserModel',  require( 'models/currentUserModel' ) );
        app.service( 'settingsModel',     require( 'models/settingsModel' ) );
        app.service( 'rolesModel',        require( 'models/rolesModel' ) );
        app.service( 'paymentsModel',     require( 'models/paymentsModel' ) );
        app.service( 'billingsModel',     require( 'models/billingsModel' ) );
        app.service( 'couriersModel',     require( 'models/couriersModel' ) );
        app.service( 'deliveriesModel',   require( 'models/deliveriesModel' ) );

    };
});
