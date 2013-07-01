require('nodetime').profile({ // Nodetime Performance Analytics
    accountKey: '3f592a5426efc7091fbef5140cf050952e47c5db',
    appName: 'RedditInsight' // Email me for access @gdi2290
  });
// Module dependencies.
var spdy = require('spdy'),
    express = require('express'),
    routes = require('./routes'),
    user = require('./routes/index'),
    http = require('http'),
    path = require('path'),
    _ = require('underscore'),
    allPostsCollection = require('./dbLibrary.js'),  // why do I have to do this!?
    mongoose = require('mongoose'),
    ejs = require('ejs'),
    fs = require('fs');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));

var options = {
  key: fs.readFileSync(__dirname + '/keys/spdy-key.pem'),
  cert: fs.readFileSync(__dirname + '/keys/spdy-cert.pem'),
  ca: fs.readFileSync(__dirname + '/keys/spdy-csr.pem')
};
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routes
app.get('/', routes.index);

//start server
var server = spdy.createServer(options, app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  if ('reddit' == app.get('env')) {
    allPostsCollection.start(5000, '/subreddits/popular.json?limit=100', 'subs');
  }

});









