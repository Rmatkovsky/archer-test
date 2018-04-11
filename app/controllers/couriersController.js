define( function () {

    "use strict";

    return ['$scope','$window', '$activeController', 'couriersModel',
        function ( $scope, $window, $activeController, couriersModel ) {
            $activeController.include( $scope );
            $scope.data = [];

            couriersModel.getAll($scope)
                .then(function (data) {
                    $scope.data = data.items;
                });
        }];
});
