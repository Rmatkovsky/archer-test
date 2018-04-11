define( function () {

    "use strict";

    return ['$resource', '$rootScope', 'utils', function( $resource, $rootScope, utils ) {
        var activeModel = $rootScope.$new(),
            fetchDataFromResource, isContains, sendNewModelOnResource, isValidModel, toLowerCase,
            parametersSubstitution, fetchModelFromResource, updateModelOnResource,
            fetchCustomQueryFromResource, sendCustomQueryToResource,
            destroyModelOnResource;

        activeModel.models = [];
        activeModel.resource = $resource;
        activeModel.name = "ActiveModel";

        // mockups for children
        activeModel.url = {
            index:   "",
            create:  "",
            show:    "",
            update:  "",
            destroy: ""
        };

        //  url type - QA/DEV/DEMO
        activeModel.urlMode = "http://" + $rootScope.mode + ".";

        // mockup for children
        activeModel.validationRules = {};

        // substitute params to url
        parametersSubstitution = function ( url, params ) {
            var fullUrl = activeModel.urlMode + url,
                paramKey;

            if ( !params ) {
                return fullUrl;
            };

            for ( paramKey in params ) {
                if ( hasOwnProperty.call( params,  paramKey ) ) {
                    fullUrl = fullUrl.replace( ":" + paramKey,  params[paramKey]);
                };
            };
            return fullUrl;
        };
                // очень громоздкие валидаторы!
                // и еще, если на вход придет объект, то objectValue.toString() вернет "[object Object]" и вся валидация рушится
                // 
        // check model on validation
        isValidModel = function ( scope, newModel, exeptFieldArray ) {
            var checkPresents, checkMinLength, checkMaxLength, checkPatternMatch,
                newModelKey, isExistFieldInExeptFieldArray;

            checkPresents = function ( objectKey, objectValue ) {
                var currentValidation = this.validationRules[objectKey];
                if ( currentValidation && currentValidation.presence ) {
                    if ( objectValue && objectValue.toString().trim().length !== 0 ) {
                        return false;
                    };
                    scope.errors[objectKey] = currentValidation.presence.message;
                };
            };

            checkMinLength = function ( objectKey, objectValue ) {
                var currentValidation = this.validationRules[objectKey];
                if ( currentValidation && currentValidation.minLength ) {
                    if ( objectValue && objectValue.toString().trim().length < currentValidation.minLength.value ) {
                        scope.errors[objectKey] = currentValidation.minLength.message;
                    };
                };
            };

            checkMaxLength = function ( objectKey, objectValue ) {
                var currentValidation = this.validationRules[objectKey];
                if ( currentValidation && currentValidation.maxLength ) {
                    if ( objectValue && objectValue.toString().trim().length > currentValidation.maxLength.value ) {
                        scope.errors[objectKey] = currentValidation.maxLength.message;
                    };
                };
            };

            checkPatternMatch = function (  objectKey, objectValue ) {
                var currentValidation = this.validationRules[objectKey];
                if ( currentValidation && currentValidation.pattern && currentValidation.pattern.value ) {
                    var patterRegObject = new RegExp( currentValidation.pattern.value );
                    if ( objectValue && !patterRegObject.test( objectValue.toString() ) ) {
                        scope.errors[objectKey] = currentValidation.pattern.message;
                    };
                };
            };

            isExistFieldInExeptFieldArray = function ( fieldName ) {
                var result  = false;

                if ( !exeptFieldArray || ( exeptFieldArray && !exeptFieldArray.length )) {
                    return result = false; // грубо
                };

                exeptFieldArray.some(
                    function ( field ) {
                        if ( fieldName == field ) {
                            return result = true; // грубо
                        };
                    }
                );

                return result;
            };

            for( newModelKey in newModel ) {
                if ( hasOwnProperty.call( newModel,  newModelKey ) && !isExistFieldInExeptFieldArray(newModelKey) ) {
                    checkPresents.call( this, newModelKey, newModel[newModelKey] );
                    checkMinLength.call( this, newModelKey, newModel[newModelKey] );
                    checkMaxLength.call( this, newModelKey, newModel[newModelKey] );
                    checkPatternMatch.call( this, newModelKey, newModel[newModelKey] );
                };
            };

            return utils.isEmpty( scope.errors );
        };

        // fetch data from server
        fetchDataFromResource = function ( scope ) {
            var that = this;
            var modelsIndex = $resource( this.urlMode + this.url.index, {}, {get: {method: 'GET'}} ),
                promise = modelsIndex.get().$promise;

            promise.then(
                function ( data )  {
                    scope.data = that.models = angular.fromJson( data.items );// почему не жсон парсе/стрингифай?..
                },
                function ( error ) {
                      scope.alerts.push( {  type: 'danger', msg: error.data.message } );
                }
            );
            return promise;
        };

        // fetch one model from server
        fetchModelFromResource = function ( scope, params ) {
            var modelGet = $resource( parametersSubstitution( this.url.show, params ), {}, {get: {method: 'GET'}} ),
                promise = modelGet.get().$promise;

            promise.catch(
                function ( error ) {
                    scope.alerts.push( {  type: 'danger', msg: error.data.message } );
                }
            );
            return promise;
        };

        // create new model on server
        sendNewModelOnResource = function ( scope, newModel, params, exeptFieldArray ) {
            var that = this;
            if ( !isValidModel.call( this, scope, newModel, exeptFieldArray ) ) {
                return false;
            };
            var modelCreate = $resource( parametersSubstitution( this.url.create, params ), {}, {create: {method: 'POST'}} ),
                promise = modelCreate.create( newModel ).$promise;

            promise.then(
                function ( data )  {
                    that.models.push( angular.fromJson( data ) );
                    scope.alerts.push( {  type: 'success', msg: "Successfully created!" } );
                },
                function ( error ) {
                    scope.alerts.push( {  type: 'danger', msg: error.data.message } );
                }
            );
          return promise;
        };

        // update model on server
        updateModelOnResource = function ( scope, newModel, params, exeptFieldArray ) {
            if ( !isValidModel.call( this, scope, newModel, exeptFieldArray ) ) {
                return false;
            };
            var modelUpdate = $resource( parametersSubstitution( this.url.update, params ), {}, {update: {method: 'PUT'}} ),
                promise = modelUpdate.update( newModel ).$promise;

            promise.catch(
                function ( error ) {
                    scope.alerts.push( {  type: 'danger', msg: error.data.message } );
                }
            );
          return promise;
        };

        // destroy model on server
        destroyModelOnResource = function ( scope, params ) {
            var modelDestroy = $resource( parametersSubstitution( this.url.destroy, params ), {}, {destroy: {method: 'DELETE'}} ),
                promise = modelDestroy.destroy().$promise;

            promise.catch(
                function ( error ) {
                    scope.alerts.push( {  type: 'danger', msg: error.data.message } );
                }
            );
            return promise;
        };

        // fetch custom data from server
        fetchCustomQueryFromResource = function ( scope, url, params ) {
            var modelsCustomQuery = $resource( parametersSubstitution( url, params ), {}, {get: {method: 'GET'}} ),
                promise = modelsCustomQuery.get().$promise;
            return promise;
        };

        // send data on server
        sendCustomQueryToResource = function ( scope, newModel, url, method, params ) {
            var modelsCustomQuery = $resource( parametersSubstitution( url, params ), {}, {query: {method: method }} ),
                promise = modelsCustomQuery.query( newModel ).$promise;
            return promise;
        };

        // check if contains key
        isContains = function ( arr, key ) {
            var result = false;

            arr.forEach( function ( sepObject ) {
                if ( sepObject === key ) {
                    result = true;
                };
            });

            return result;
        };

        // string lowercase
        toLowerCase = function ( value ) {
            if ( !value ) {
                return "";
            };
            return value.toString().toLowerCase();
        };

        // wrapper for custom query
        activeModel.getCustomQuery = function ( scope, url, params ) {
            return fetchCustomQueryFromResource.call( this, scope, url, params );
        };

        // wrapper for send query
        activeModel.sendCustomQuery = function ( scope, newModel, url, method, params ) {
            return sendCustomQueryToResource.call( this, scope, newModel, url, method, params );
        };

        // wrapper for getAll
        activeModel.getAll = function ( scope ) {
            return fetchDataFromResource.call( this, scope );
        };

        // is empty for array
        activeModel.isEmpty = function () {
            return !!this.models.length;
        };

        // wrapper for model validation
        activeModel.validate = function ( scope, newModel, exeptFieldArray ) {
            return isValidModel.call( this, scope, newModel, exeptFieldArray );
        };

        // wrapper for create new
        activeModel.createNew = function ( scope, newModel, params ) {
            return sendNewModelOnResource.call( this, scope, newModel, params );
        };

        // wrapper for getModel
        activeModel.getModel = function ( scope, params ) {
            return fetchModelFromResource.call( this, scope, params );
        };

        // wrapper for update
        activeModel.updateModel = function ( scope, newModel, params, exeptFieldArray ) {
            return updateModelOnResource.call( this, scope, newModel, params, exeptFieldArray );
        };

        // wrapper for destroy
        activeModel.destroyModel = function ( scope, params ) {
            return destroyModelOnResource.call( this, scope, params );
        };

        // is exists
        activeModel.isExists = function ( objectMatch ) {
            var result = false,
                objectMatchKey;

            if ( objectMatch == null ) {
                return result;
            };
            if ( !this.models && !this.models.length ) {
                return result;
            };

            this.models.forEach( function ( sepModel ) {
                var resultFroSeparateModel = 0;

                if ( !result ) {
                    for ( objectMatchKey in objectMatch ) {
                        if ( hasOwnProperty.call( objectMatch,  objectMatchKey ) ) {
                            if ( isContains( Object.keys( sepModel ), objectMatchKey ) &&
                                 toLowerCase(sepModel[objectMatchKey]) == toLowerCase(objectMatch[objectMatchKey])  ) {
                                if ( resultFroSeparateModel === 0 ) {
                                    resultFroSeparateModel = 1;
                                };
                            } else {
                                resultFroSeparateModel = 2;
                            };
                        };
                    };
                };

                if ( !result ) {
                    result = resultFroSeparateModel !== 2;
                };
            }, this );

            return result;
        };

        return activeModel;
    }];
});
