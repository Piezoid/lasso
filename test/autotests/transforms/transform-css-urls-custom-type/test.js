const promisify = require('pify');
const fs = require('fs');
const expect = require('chai').expect;
const path = require('path');

const readFileAsync = promisify(fs.readFile);

exports.getLassoConfig = function() {
    return {
        fingerprintsEnabled: true,
        urlPrefix: '/static',
        bundlingEnabled: true,
        plugins: [
            {
                plugin: function(theLasso) {
                    theLasso.dependencies.registerStyleSheetType('foo', {
                        properties: {
                            'path': 'string'
                        },

                        async init (lassoContext) {
                            this.path = this.resolvePath(this.path);
                        },

                        async read (lassoContext) {
                            const css = await readFileAsync(this.path, {encoding: 'utf8'});
                            return css;
                        },

                        getSourceFile: function() {
                            return this.path;
                        },

                        async getLastModified (lassoContext) {
                            return -1;
                        }
                    });
                }
            }
        ]
    };
};

exports.getLassoOptions = function() {
    return {
        dependencies: [
            {
                type: 'foo',
                path: path.join(__dirname, 'foo.css')
            }
        ]
    };
};

exports.check = function(lassoPageResult, writerTracker) {
    var expected = '.foo {background-image: url(\'ebay-logo-d481eb85.png\');}';
    var actual = writerTracker.getCodeForPath(lassoPageResult.getCSSFiles()[0]);
    // console.log(actual);
    expect(actual).to.equal(expected);
};
