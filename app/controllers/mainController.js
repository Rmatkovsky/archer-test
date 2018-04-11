define( function () {

    "use strict";

    // main controller of whole application. if you need do some global action this is the best place
    return ['$scope', '$rootScope', '$activeController', 'settingsModel', 'rolesModel',
        function ( $scope, $rootScope, $activeController, settingsModel, rolesModel ) {
            var controller = this;
            $scope.selectedRole = 0;
            $scope.isLoaded = false;
            $activeController.include( $scope, controller );

            controller.currentUserModel.isAuthentificationChecked = true;

            $scope.prepareModels([
                controller.settingsModel,
                controller.rolesModel,
                controller.paymentsModel,
            ])
                .then(function () {
                    $scope.isLoaded = true;
                });

            $scope.$watch('selectedRole', function (newValue) {
                controller.currentUserModel.changeRoleId(newValue);
            })

    }];
});
