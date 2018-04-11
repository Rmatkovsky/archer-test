define( function () {

    "use strict";
    // model for storing Admin Settings
    return ['$activeModel', function( activeModel ) {
        var couriersModel = activeModel.$new();

        // specified urls
        couriersModel.url = {
            index:   "/couriers.json",
            create:  "not now",
            show:    "not now",
            update:  "not now",
            destroy: "not now"
        };

        // model name
        couriersModel.name = "couriersModel";

        return couriersModel;
    }];
});
