var express = require('express.io');
var app = express().http().io();

var couchbase = require('couchbase');
//var db = new couchbase.Connection({host:
//'http://ec2-54-187-19-103.us-west-2.compute.amazonaws.com:8091',
// bucket: 'beer-sample'});

app.use(express.bodyParser());
// app.use(express.static(path.join(__dirname, 'ClientSide')));
app.use(express.cookieParser());
app.use(express.session({ secret: 'abc' }));

require('./route/routes')( app);

app.get('/ak',function(req,res){
	console.log("aaya");
	res.end("pk");
});

app.listen(9002);
console.log('Express server started on port 9002');
