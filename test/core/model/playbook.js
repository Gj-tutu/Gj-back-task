/**
 * Created by tutu on 16-3-24.
 */
var PlaybookModel = require("../../../core/model/playbook").PlaybookModel;
var PlaybookRecord = require("../../../core/model/playbook").Playbook;
var App = require('app/App').default;

describe('playbookModel', function () {
    var app = new App();
    var playbook = null;
    it('add', function (done) {
        var playbookRecord = new PlaybookRecord();
        playbookRecord.type = "base";
        new PlaybookModel(app).add(playbookRecord)
            .then(function(playbookRecord){
                playbook = playbookRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('update', function (done) {
        new PlaybookModel(app).update(playbook)
            .then(function(playbookRecord){
                playbook = playbookRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('delete', function (done) {
        new PlaybookModel(app).del(playbook)
            .then(function(playbookRecord){
                playbook = playbookRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('get', function (done) {
        new PlaybookModel(app).get(playbook.id)
            .then(function(playbookRecord){
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('recovery', function (done) {
        new PlaybookModel(app).recovery(playbook)
            .then(function(playbookRecord){
                playbook = playbookRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('get', function (done) {
        new PlaybookModel(app).get(playbook.id)
            .then(function(playbookRecord){
                playbook = playbookRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
});