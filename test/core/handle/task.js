/**
 * Created by tutu on 16-3-28.
 */

var App = require('app/App').default;
var task = require("../../../core/handle/Task").default;

describe('task', function () {
    this.timeout(1000*60*5);
    describe('run', function () {
        var app = new App();
        var _task = task.getInstance(app).start();
        it("start", function(done) {

        });
    });
});