/**
 * Created by tutu on 16-3-24.
 */
var assert = require('assert');
var App = require('app/App').default;
var Model = require('app/abstract/BaseModel').BaseModel;

describe('BaseModel', function () {
    var id1 = 0;
    var id2 = 0;
    describe("add", function () {
        it('add -> filed and value', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                add: true,
                tableName: 'test',
                filed:["test1", "test2"],
                value:{test1: "test", test2: 1, test3:new Date().getTime()/1000}
            };
            model.handle(modelHandle).then(function(result){
                assert.ifError(true);
                id1 = result["insertId"];
                done();
            }).catch(function(error){
                done();
            });
        });
        it('add -> value', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                add: true,
                tableName: 'test',
                value:{test1: "test", test2: 1, test3:new Date().getTime()/1000}
            };
            model.handle(modelHandle).then(function(result){
                id2 = result["insertId"];
                done();
            }).catch(function(error){
                done();
            });
        });
    });
    describe("update", function () {
        it('update -> filed and value', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                update: true,
                tableName: 'test',
                filed:["test1", "test2"],
                where:[["id", "=", id1]],
                value:{test1: "test", test2: 2, test3:new Date().getTime()/1000}
            };
            model.handle(modelHandle).then(function(result){
                var change = result["changedRows"];
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
        it('update -> value', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                update: true,
                tableName: 'test',
                where:[["id", "=", id2]],
                value:{test1: "test", test2: 2, test3:new Date().getTime()/1000}
            };
            model.handle(modelHandle).then(function(result){
                var change = result["changedRows"];
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
    });
    describe("select", function () {
        it('select -> filed and where', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                select: true,
                tableName: 'test',
                filed:["test1", "test2", "test3"],
                where:[["id", "=", id1]]
            };
            model.handle(modelHandle).then(function(result){
                console.log(result);
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
        it('select -> where', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                select: true,
                tableName: 'test',
                where:[["id", "=", id2]]
            };
            model.handle(modelHandle).then(function(result){
                console.log(result);
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
        it('select -> where', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                select: true,
                tableName: 'test',
                where:[["id", ">", 0]],
                limit:10
            };
            model.handle(modelHandle).then(function(result){
                console.log(result);
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
    });
    describe("select", function () {
        it('count -> filed and where', function (done) {
            var app = new App();
            var model = new Model(app);
            var modelHandle = {
                tableName: 'test',
                where:[["id", ">", id1]]
            };
            model.count(modelHandle).then(function(result){
                console.log(result);
                done();
            }).catch(function(error){
                console.log(error);
                done();
            });
        });
    });
});
