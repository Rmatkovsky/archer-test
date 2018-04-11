define( function () {

    "use strict";
    // model for storing Admin Settings
    return ['$activeModel', function( activeModel ) {
        var settingsModel = activeModel.$new();

        // specified urls
        settingsModel.url = {
            index:   "/settings.json",
            create:  "not now",
            show:    "not now",
            update:  "not now",
            destroy: "not now"
        };

        // model name
        settingsModel.name = "settingsModel";

        return settingsModel;
    }];
});
