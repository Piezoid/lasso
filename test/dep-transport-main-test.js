'use strict';
require('./util/test-init');

const nodePath = require('path');
const chai = require('chai');
chai.config.includeStack = true;
require('chai').should();
const MockLassoContext = require('./mock/MockLassoContext');

describe('lasso-require/dep-transport-main', function() {
    require('./autotest').scanDir(
        nodePath.join(__dirname, 'autotests/dep-transport-main'),
        async function (dir, helpers) {
            var main = require(nodePath.join(dir, 'test.js'));
            var dependencyProps = main.createDependency(dir);
            var pluginConfig = main.getPluginConfig ? main.getPluginConfig() : {};

            pluginConfig.rootDir = dir;

            var dependencyFactory = require('./mock/dependency-factory').create(pluginConfig);
            var dependency = dependencyFactory.depTransportMain(dependencyProps);
            var lassoContext = new MockLassoContext();

            dependency.init(lassoContext);

            const src = await dependency.read(lassoContext);
            helpers.compare(src, '.js');
        });
});
