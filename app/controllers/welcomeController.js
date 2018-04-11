define( function () {

    "use strict";

    return ['$scope','$window', '$activeController', function ( $scope, $window, $activeController ) {
        $activeController.include( $scope );

    }];
});
