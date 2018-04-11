define( function () {

    "use strict";
    // service for managing of user access
    return ['$rootScope', '$state', 'currentUserModel',
        function( $rootScope, $state, currentUserModel ) {
            var roleRestriction = {};

            var event, toState, toParams = false;

            /**
             * [gotoToErrorPage - transfer to error page 401/404]
             * @param  {string} stateName [state where we should transfer]
             * @return {bool}           [result]
             */
            var gotoToErrorPage = function ( stateName ) {
                event.preventDefault();
                return $state.go(stateName);
            };

            /**
             * [areAllParamsPresent - check, all params pesent in url]
             * @return {bool} [result]
             */
            var areAllParamsPresent = function () {
                var paramKey, resultWithOutValue;
                for ( paramKey in toParams ) {
                    if ( hasOwnProperty.call( toParams, paramKey ) && !toParams[paramKey] ) {
                        resultWithOutValue = true;
                    };
                };
                return !resultWithOutValue; // resultWithOutValue изначально андефайнед, если в цикле условие не выполнится, то вернется !андефайнед, т.е. тру, итого эта ф-ция всегда выводит тру
            };

            /**
             * [isUserPermissionValid - check permissions]
             * @return {Boolean} [result]
             */
            var isUserPermissionValid = function () {
                if ( !toState.permission.length ) {
                    return true;
                };

                var userRoleId = currentUserModel.roleId,
                    result;
                toState.permission.some(
                    function ( role ) {
                        return result = userRoleId == currentUserModel.getRoleIdByName( role );
                    }
                );
                return result;
            };

            /**
             * [check - main entrance in this service]
             * @param  {object} eventIn    [state event]
             * @param  {object} toStateIn  [state object]
             * @param  {object} toParamsIn [state params]
             * @return {bool}            [result]
             */
            roleRestriction.check = function ( eventIn, toStateIn, toParamsIn ) {
                event = eventIn;
                toState = toStateIn;
                toParams = toParamsIn;


                // check params. if lost something
                if ( !areAllParamsPresent() ) {
                    return gotoToErrorPage( "404" );
                };

                // if state hasn't permission array we should to show errror and transfer on 401
                if ( !toState.permission ) {
                    console.log("previous route ", toState, toParams );
                    gotoToErrorPage( "401" );
                    throw new Error("State hasn't permission");
                    return false;
                };

                // check if current user have permission for this page
                if ( !isUserPermissionValid() ) {
                    return gotoToErrorPage( "401" );
                };
            };

            return roleRestriction;
        }
    ];
});
