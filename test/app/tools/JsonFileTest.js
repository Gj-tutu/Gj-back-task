/**
 * Created by tutu on 16-1-4.
 */
var JsonFile = require('app/tools/JsonFile').default;

describe('JsonFile', function () {
    it('read json file', function (done) {
        var data = JsonFile.read("app/resource");
        done();
    });
});
