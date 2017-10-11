'use strict';
require('../util/test-init');

var mockLasso = require('./mock-lasso');
var buildPluginConfig = require('lasso/require/build-plugin-config');
var MockDependency = require('./MockDependency');
var extend = require('raptor-util/extend');
var fs = require('fs');
var path = require('path');

function removeDashes(str) {
    return str.replace(/-([a-z])/g, function (match, lower) {
        return lower.toUpperCase();
    });
}

function removeExt(filename) {
    var ext = path.extname(filename);
    return filename.slice(0, 0 - ext.length);
}

exports.create = function(pluginConfig) {
    var mockPluginConfig = buildPluginConfig(pluginConfig);

    function createDependencyFactory(mixinsFactory) {
        class Dependency extends MockDependency {}
        extend(Dependency.prototype, mixinsFactory.create(mockPluginConfig, mockLasso));
        return function createDependency(props) {
            var d = new Dependency();
            extend(d, props);
            return d;
        };
    }

    var factories = {};
    var srcDir = path.join(__dirname, '../../src/require');
    fs.readdirSync(srcDir)
        .forEach(function(child) {
            if (child.startsWith('dep-')) {
                var name = removeDashes(removeExt(child));
                factories[name] = createDependencyFactory(require(`lasso/require/${child}`));
            }
        });

    return factories;
};
