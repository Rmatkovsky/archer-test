define( function () {

    "use strict";
    // model for storing Admin Settings
    return ['$activeModel', function( activeModel ) {
        var billingsModel = activeModel.$new();

        // specified urls
        billingsModel.url = {
            index:   "/billings.json",
            create:  "not now",
            show:    "not now",
            update:  "not now",
            destroy: "not now"
        };

        // model name
        billingsModel.name = "billingsModel";

        return billingsModel;
    }];
});
