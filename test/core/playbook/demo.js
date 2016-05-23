/**
 * Created by tutu on 16-3-24.
 */
var App = require('app/App').default;
var Demo = require('../../../core/playbook/Demo').default;

describe('demoPlaybook', function () {
    this.timeout(1000*60);
    var app = new App();
    var demo = null;
    it('add', function (done) {
        return new Demo(app).save()
            .then(function(demoPlaybook){
                console.log(demoPlaybook);
                demo = demoPlaybook;
                done();
            });
    });
    it('start', function (done) {
        return new Demo(app, demo).start()
            .then(function(result){
                console.log(result);
                done();
            });
    });
});