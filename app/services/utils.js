define( function () {

    "use strict";

    return ['$http', '$timeout', function( $http, $timeout ) {
        var utils = {};

        // check if object is empty
        utils.isEmpty = function ( value ) {
            if ( value == null ) {
                return true;
            };
            if ( value.length > 0 ) {
                return false;
            };
            if ( value.length === 0 )  {
                return true;
            };

            for ( var key in value ) {
                if ( hasOwnProperty.call( value, key ) ) {
                    return false;
                };
            };

            return true;
        };

        // set new header
        utils.setHttpHeader  = function ( headerName, headerValue ) {
            $http.defaults.headers.common[headerName] = headerValue;
        };

        // delete header
        utils.deleteHttpHeader  = function ( headerName ) {
            delete $http.defaults.headers.common[headerName];
        };

        // format money - need refactoring and rebase to filter
        utils.formatMoney = function( number, decPlaces, thouSeparator, decSeparator ) {
            decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
            decSeparator = decSeparator == undefined ? "." : decSeparator;
            thouSeparator = thouSeparator == undefined ? "," : thouSeparator;
            var sign = number < 0 ? "-" : "",

            i = parseInt(number = Math.abs(+number || 0).toFixed(decPlaces)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
            return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
        };

        // create new cookie
        function createCookie( cookieName, cookieValue, cookieExp, cookiePath, cookieDomain ) {
            var cookie = cookieName + "=" + escape( cookieValue ) + ";";

            if ( cookieExp ) {

                if ( cookieExp instanceof Date ) {

                    if (isNaN( cookieExp.getTime())) {
                        cookieExp = new Date();
                    };
                } else {
                    cookieExp = new Date(new Date().getTime() + parseInt( cookieExp ) * 1000 * 60 * 60 * 24);
                };

                cookie += "expires=" + cookieExp.toGMTString() + ";";
            };

            if ( cookiePath ) {
                cookie += "path=" + cookiePath + ";";
            };

            if ( cookieDomain ) {
                cookie += "domain=" + cookieDomain + ";";
            };

            document.cookie = cookie;
        };

        // get cookie value
        utils.getCookieByName = function ( cookieName ) {
            var name = cookieName + "=",
                ca = document.cookie.split(';'),
                i, c;
            for( i=0; i<ca.length; i++ ) {
                c = ca[i].trim();
                if ( c.indexOf(name) === 0 ) {
                    return c.substring( name.length, c.length );
                };
            };
            return "";
        };

        // delete cookie by name
        utils.deleteCookie = function ( cookieName, cookiePath, cookieDomain ) {
            createCookie( cookieName, "", -100, cookiePath, cookieDomain );
        };

        // set default language
        utils.setDefaultLanguage = function () {
            var languageRegExp = new RegExp( navigator.language );
            this.setLanguage( languageRegExp.test("en-US") ? "sv-SE" : "en-US" );
        };

        // set language header
        utils.setLanguage = function ( language ) {
            utils.setHttpHeader( 'Accept-Language', language );
        };

        // check if it a number
        utils.isNumber = function( string ) {
            return /^\d+$/.test( string );
        };

        // set function in begin of stek
        utils.deferExecution = function( func, delay ) {
            $timeout( func, delay );
        };

    return utils;
  }];
});
