define( function () {

    "use strict";

    return ['$scope','$window', '$activeController', 'deliveriesModel',
        function ( $scope, $window, $activeController, deliveriesModel ) {
            $activeController.include( $scope );
            $scope.data = [];

            deliveriesModel.getAll($scope)
                .then(function (data) {
                    $scope.data = data.items;
                });
        }];
});
