define( function () {

    "use strict";
    // Service to store small pieces of repeated code
    return ['utils', '$q', '$state', '$window',
            'currentUserModel', 'settingsModel', 'rolesModel', 'paymentsModel',
        function( utils, $q, $state, $window,
                  currentUserModel, settingsModel, rolesModel, paymentsModel,
                )
            {
                // mandatory subjects
                var activeController = {};
                activeController.lolka = false;

                activeController.model = {};
                activeController.data = {};

                activeController.currentUserModel = currentUserModel;

                // injects models and services
                var injectModels = function () {
                    var model                = {};
                    model.currentUserModel   = currentUserModel;
                    model.settingsModel      = settingsModel;
                    model.rolesModel         = rolesModel;
                    model.paymentsModel      = paymentsModel;

                    return model;
                };

                // synchronization mark with server
                activeController.isSynchronized = false;

                // include the service in controller
                activeController.include = function ( scope, controller ) {
                    angular.extend( scope, this );
                    scope.model = {};

                    if ( controller ) {
                        angular.extend( controller,  injectModels() );
                    };

                    delete scope.include;
                };

                // object for storing services
                activeController.injects = {
                    '$q':           $q,
                    'utils':        utils,
                    '$state':       $state
                };

                // go to another location
                activeController.stateGoToPage = function ( stateName, params ) {
                    if ( params ) {
                        return $state.transitionTo( stateName, params );
                    };
                    $state.transitionTo( stateName );
                };

                // prepare models due q.all function
                activeController.prepareModels = function ( modelsArray ) {
                    var promisesPack = [];

                    var createDataObject = function ( model ) {
                        return activeController.data[model.name.replace('Model', '')] = {};
                    };

                    var createPromise = function ( model ) {
                        return model.getAll( createDataObject(model) );
                    };

                    modelsArray.forEach(function( model ){
                        promisesPack.push( createPromise(model) );
                    });

                    return $q.all(promisesPack);
                };

                // access to $a all
                activeController.promiseAll = function ( arrayOfPromisses ) {
                    return $q.all( arrayOfPromisses );
                };

                activeController.name = "activeController";

                return activeController;
            }
    ];
});
