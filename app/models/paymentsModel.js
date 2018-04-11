define( function () {

    "use strict";
    // model for storing Admin Settings
    return ['$activeModel', function( activeModel ) {
        var paymentsModel = activeModel.$new();

        // specified urls
        paymentsModel.url = {
            index:   "/payments.json",
            create:  "not now",
            show:    "not now",
            update:  "not now",
            destroy: "not now"
        };

        // model name
        paymentsModel.name = "paymentsModel";

        return paymentsModel;
    }];
});
