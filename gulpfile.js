/**
 * Created by tutu on 15-12-17.
 */

//初始化组件
var gulp = require('gulp');
var path = require("path");
var gutil = require("gulp-util");
var config = require("./app/config");
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var __DEV__ = config.DEBUG;

//编译ts文件
gulp.task('ts', shell.task([path.join(__dirname, "./node_modules/typescript/bin/tsc")]));

//编译sass文件,并压缩
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');

gulp.task('sass', function () {
    if(__DEV__){
        gulp.src('./core/src/css/index.sass')
            .pipe(sass())
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./static/css'));
    }else{
        gulp.src('./core/src/css/index.sass')
            .pipe(sass())
            .pipe(sass().on('error', sass.logError))
            .pipe(minifycss())
            .pipe(gulp.dest('./static/css'));
    }
});


//执行webpack打包
var webpack = require('webpack');

function webpackConfig (){

    this.serverHost = "http://localhost:9090";
    this.jsPath = "/static/js";
    this.srcPath = "./core/src";

    this.formatSrcPath = path.join(__dirname, this.srcPath);
    this.formatJsPath = path.join(__dirname, this.jsPath);
    this.serverJsPath = this.serverHost + this.jsPath;


    this.getConfig = function(server){
        var entry={},output={},plugins=[],resolve={},module={};
        entry = {
            index: ["./core/src/Index"],
            "reactAll": ["react", "react-redux", "react-dom", "react-router", "react-redux", "react-router-redux"]
        };

        output = {
            path: this.formatJsPath,
            filename: "[name].js"
        };

        plugins = [
            new webpack.optimize.CommonsChunkPlugin({
                "name": "common",
                "chunks": ["index", "reactAll"],
                "minChunks": Infinity
            })
        ];
        if(!__DEV__){
            output.fileName = "[name]-[chunkHash].js";
            plugins.push(
                new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }));
        }

        if(server){
            entry.index = [
                'webpack-dev-server/client?'+this.serverHost,
                'webpack/hot/only-dev-server',
                './core/src/Index'
            ];
            output.publicPath = this.serverJsPath;
            module = {
                loaders: [{
                    test: /\.js$/,
                    loaders: ['react-hot'],
                    include: [this.formatSrcPath]
                }]
            };
            resolve = {
                extensions: ['', '.js']
            };
            plugins.push(new webpack.HotModuleReplacementPlugin());
        }
        return {
            entry: entry,
            output: output,
            plugins: plugins,
            resolve: resolve,
            module: module
        }
    };

    this.getServerConfig = function(){
        return {
            publicPath: this.serverJsPath,
            hot: true,
            historyApiFallback: true
        }
    }

}
var webpack_config = new webpackConfig();
//清除文件
gulp.task("webpack_clean", ["ts"], function(){
    gulp.src('./static/js/*.js')
        .pipe(clean());
});
gulp.task("webpack", ["webpack_clean"], function(callback) {
    webpack(webpack_config.getConfig(), function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        callback();
    });
});
//处理生成文件
gulp.task('webpack_handle', ["webpack"], shell.task([path.join(__dirname,"./resource.sh")]));

//开启webpack资源服务器
var WebpackDevServer = require("webpack-dev-server");

gulp.task("webpack-dev-server", function(callback) {
    new WebpackDevServer(webpack(webpack_config.getConfig(true)), webpack_config.getServerConfig())
        .listen(9090, function (err, result) {
            if(err) throw new gutil.PluginError("webpack-dev-server", err);
            callback();
        });
});

gulp.task("init", ["ts", "sass", "webpack_clean", "webpack", "webpack_handle"]);

