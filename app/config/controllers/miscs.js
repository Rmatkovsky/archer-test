define( function ( require ) {

    "use strict";

    //requare controllers for Miscs
    return function( app ) {

        app.controller( 'MainController',                   require( 'controllers/mainController' ) );
        app.controller( 'WelcomeController',                   require( 'controllers/welcomeController' ) );
        app.controller( 'DeliveriesController',                   require( 'controllers/deliveriesController' ) );
        app.controller( 'BillingsController',                   require( 'controllers/billingsController' ) );
        app.controller( 'CouriersController',                   require( 'controllers/couriersController' ) );

    };
});
