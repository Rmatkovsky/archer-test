define( function () {

    "use strict";

    return function( $rootScope, $activeModel, roleRestriction ) {

        // set full route mode
        $activeModel.urlMode = "http://localhost:3000/api";

        // user/page restrictions
        $rootScope.$on( '$stateChangeStart', function( event, toState, toParams ) {
            return roleRestriction.check( event, toState, toParams );
        });
    };
});
