define( function () {

    return function ( $stateProvider ) {

        return $stateProvider
        // main page
        .state('welcome', {
            url:         '/',
            templateUrl: 'welcome.tmpl.html',
            controller:  'WelcomeController',
            permission:  []
        })
        .state('deliveries', {
            url:         '/deliveries',
            templateUrl: 'common.tmpl.html',
            controller:  'DeliveriesController',
            permission:  ["admin", "manager"]
        })
        .state('billings', {
            url:         '/billings',
            templateUrl: 'common.tmpl.html',
            controller:  'BillingsController',
            permission:  ["admin", "manager"]
        })
        .state('couriers', {
            url:         '/couriers',
            templateUrl: 'common.tmpl.html',
            controller:  'CouriersController',
            permission:  ["admin", "manager", "guest"]
        })
        // error page with 401
        .state('401', {
            url:         '/401',
            templateUrl: 'permissions-error.tmpl.html',
            permission:  []
        });

    };
});
