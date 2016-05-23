/**
 * Created by tutu on 16-1-4.
 */
var App = require('app/App').default;
var request = require('supertest');

describe('App', function () {
  it('error handle', function (done) {
    var app = new App;
    app.errorHandle();
    request(app.app)
      .get('/')
      .end(function (err, res) {
        console.log(res.statusCode);
        done();
      });
  });
});
