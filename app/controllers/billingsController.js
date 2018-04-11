define( function () {

    "use strict";

    return ['$scope','$window', '$activeController', 'billingsModel',
        function ( $scope, $window, $activeController, billingsModel ) {
            $activeController.include( $scope );
            $scope.data = [];

            billingsModel.getAll($scope)
                .then(function (data) {
                    $scope.data = data.items;
                });
    }];
});
