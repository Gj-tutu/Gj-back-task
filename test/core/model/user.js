/**
 * Created by tutu on 16-3-24.
 */
var UserModel = require("../../../core/model/user").UserModel;
var App = require('app/App').default;

describe('userModel', function () {
    var app = new App();
    var email = "test@test.com";
    var password = "test";
    var user = null;
    it('register', function (done) {
        new UserModel(app).register(email, password)
            .then(function(userRecord){
                user = userRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('login', function (done) {
        new UserModel(app).login(email, password)
            .then(function(userRecord){
                user = userRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('update', function (done) {
        user.email = "test1@test.com";
        new UserModel(app).update(user)
            .then(function(userRecord){
                user = userRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('delete', function (done) {
        new UserModel(app).del(user)
            .then(function(userRecord){
                user = userRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('get', function (done) {
        new UserModel(app).get(user.id)
            .then(function(userRecord){
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('recovery', function (done) {
        new UserModel(app).recovery(user)
            .then(function(userRecord){
                user = userRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
    it('get', function (done) {
        new UserModel(app).get(user.id)
            .then(function(userRecord){
                user = userRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });
});