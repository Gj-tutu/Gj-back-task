/**
 * Created by penny on 16-5-17.
 */
/**
 * Created by penny on 16-5-10.
 */
var ReportModel = require("../../../data/model/reportNotice").ReportNoticeModel;
var App = require('app/App').default;

describe('ReportModel', function () {
    var app = new App();
    var report_id = 5;
    var description = "test";
    var state = "hy";
    var time = "2016/5/17";
    var report = null;
    it.only('saveHistory', function (done) {
        new ReportModel(app).saveHistory(report_id,time,state,description)
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

    it('getHistory', function (done) {
        new ReportModel(app).getHistory(report_id)
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

});

