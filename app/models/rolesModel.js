define( function () {

    "use strict";
    // model for storing Admin Settings
    return ['$activeModel', function( activeModel ) {
        var rolesModel = activeModel.$new();

        // specified urls
        rolesModel.url = {
            index:   "/roles.json",
            create:  "not now",
            show:    "not now",
            update:  "not now",
            destroy: "not now"
        };

        // model name
        rolesModel.name = "rolesModel";

        return rolesModel;
    }];
});
