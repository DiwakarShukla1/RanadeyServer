var express = require('express.io');
var app = express().http().io();

var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "errorsamphalreporter@gmail.com",
       pass: "samphal123"
   }
});

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
	console.log("aaya...");
	try{
		console.log(pk);
		res.end("pk");
	}catch(err){
		console.log(err.stack);
		sendError(err.stack);
	}
});

function sendError(err){
	console.log(err);
	smtpTransport.sendMail({
   		from: "<diwakarshukla14@gmail.com>", // sender address
   		to: "<diwakarshukla14@gmail.com>,<maheshgrt007@gmail.com>,<sagartiparadi@gmail.com>", // comma separated list of receivers
   		subject: "Hello Error Founded...", // Subject line
   		text: String(err)
	}, function(error, response){
   	if(error){
       		console.log(error);
  	 }else{
       		console.log("Message sent: " + response.message);
  	 }
	});
}

app.listen(9002);
console.log('Express server started on port 9002');
