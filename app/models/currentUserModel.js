define( function () {

    "use strict";
    // model for stored CurrentUser info
    return ['$activeModel', function( activeModel ) {
        var currentUserModel = activeModel.$new();

        var userRoleIDs = {
            "admin": "1",
            "manager": "2",
            "guest": "3",
        };
        currentUserModel.roleId = 0;

        currentUserModel.changeRoleId = function (id) {
            this.roleId = id;
        };

        /**
         * [getRoleIdByName get role id from role name for checking permissions]
         * @param  {string} roleName
         * @return {string}          [role id]
         */
        currentUserModel.getRoleIdByName = function ( roleName ) {
            var roleId, roleKey;

            for ( roleKey in userRoleIDs ) {
                if ( hasOwnProperty.call( userRoleIDs,  roleKey ) ) {
                    if ( roleKey.toString().toLowerCase() === roleName.toString().toLowerCase() ) {
                        roleId = userRoleIDs[roleKey];
                    };
                };
            };

            return roleId;
        };

        // model name
        currentUserModel.name = "currentUserModel";

        return currentUserModel;
      }];
});
