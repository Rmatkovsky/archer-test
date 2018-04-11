define( function () {

    "use strict";
    // model for storing Admin Settings
    return ['$activeModel', function( activeModel ) {
        var deliveriesModel = activeModel.$new();

        // specified urls
        deliveriesModel.url = {
            index:   "/deliveries.json",
            create:  "not now",
            show:    "not now",
            update:  "not now",
            destroy: "not now"
        };

        // model name
        deliveriesModel.name = "deliveriesModel";

        return deliveriesModel;
    }];
});
