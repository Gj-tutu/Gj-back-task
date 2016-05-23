/**
 * Created by penny on 16-5-10.
 */
var ReportModel = require("../../../data/model/report").ReportModel;
var App = require('app/App').default;

describe('ReportModel', function () {
    var app = new App();
    var name = "penny_1fghrfth";
    var description = "test";
    var period = "h";
    var author = "penny";
    var report = null;
    it('addReport', function (done) {
        new ReportModel(app).addReport(name,description,period,author)
            .then(function(reportRecord){
                report = reportRecord;
                console.log(report);
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });

    it("findByName",function(done){
        new ReportModel(app).findByName(name)
            .then(function(reportRecord){
                report = reportRecord;
                console.log(report);
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });

    it.only('updateReport', function (done) {
        new ReportModel(app).updateReport(name,description,period,author)
            .then(function(reportRecord){
                report = reportRecord;
                console.log(report);
                done();
            })
            .catch(function(error){
                console.log(error);
                done();
            });
    });

    it('deleteReport', function (done) {
        new ReportModel(app).deleteReport(name)
            .then(function(reportRecord){
                report = reportRecord;
                done();
            })
            .catch(function(error){
                console.log("error", error);
                done();
            });
    });

   
});
