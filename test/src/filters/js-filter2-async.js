var ok = require('assert').ok;
var raptorPromises = require('raptor-promises');

exports.stream = false;

exports.contentType = 'js';

exports.filter = function(code, contentType, context) {
    ok(contentType === 'js', '"js" content type expected');

    var deferred = raptorPromises.defer();

    setTimeout(function() {
        deferred.resolve(code + '-JavaScriptFilter2Async');
    }, 200);

    return deferred.promise;
};

exports.name = module.id;