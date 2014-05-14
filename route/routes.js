var gcm = require('node-gcm');
var couchbase = require('couchbase');
var db = new couchbase.Connection({host:
'ec2-54-187-152-26.us-west-2.compute.amazonaws.com:8091',
 bucket: 'updata'});
// or with object values
//var msg = new gcm.Message();
/*var message = new gcm.Message({
    collapse_key: '',
    data: {
        key1: 'value1'
    },
    delay_while_idle: true,
    time_to_live: 34,
    dry_run: false
});*/

var message = new gcm.Message({
    collapse_key: 'test',
    data: {
        key1: 'value1'
    },
    delay_while_idle: true,
    time_to_live: 34,
    dry_run: false
});

var sender = new gcm.Sender('AIzaSyD17YjE8f6SU4nue-WvfYUqCwzvJy2yFv8');

module.exports=function(app){
	app.post("/GCMRegKey",function(req,res){
		try{
			console.log(req.body);
			db.get(req.body.email,function(err,res){
				if(err) return err;
				if(res===null){
					res.end("nothing to do");
				}
				var newRes=getValue(res);
				newRes.RegKey=req.body.RegKey;
				db.set(req.body.email,newRes,function(err,result){
					console.log(result);
				});
			});
			console.log(req.body.email);
			//console.log(req.body.RegKey);	
			res.end("suceess");
		}catch(err){
			res.end("Error");
		}
	});

	app.get("/",function(req,res){
		var query=db.view('Info','Info');
		query.query([{key:"diwakarshukla14@gmail.com"},{key:"maheshgrt007@gmail.com"}],function(err,res){
			console.log(JSON.stringify(res));
		});
		console.log("dk");
		res.end("ddsfk");
	});

	app.get('/getConfig/:Email',function(req,res){
		console.log("getConfig");
		db.get(req.params.Email,function(err,result){
			result=getValue(result);
			res.json(result.allParrent);
		});
	});
		
	function SendTOParrent(senderEmail,Message){		
		db.get(senderEmail,function(err,res){
			var newRes=getValue(res);
			console.log(newRes.allParent);
			msg.addDataWithKeyValue('from',newRes.Name);
		 	msg.addDataWithKeyValue('message',Message);
			newRes.allParent.forEach(function(data){
				db.get(data,function(err,finalRes){
					finalRes=getValue(finalRes);
					console.log(finalRes.RegKey);
					sender.send(msg, finalRes.RegKey, 4, function (err, result) {
			   			 console.log("Result is Here.........."+JSON.stringify(result));
		 			});
				});
			});
		});
		
	}

	function getValue(doc){
		if(doc===null){
			return null;
		}
		while(!doc.Name){
			doc=doc.value;
		}
   		 return doc;
	}

	function SendMessage(senderEmail,reciverEmail,Message){
		db.get(senderEmail,function(err,senderInfo){
			senderInfo=getValue(senderInfo);
			db.get(reciverEmail,function(err,reciverInfo){
				reciverInfo=getValue(reciverInfo);
				//msg.addDataWithKeyValue('from','Diwakar');
				//msg.setCollapseKey('string');

// set dry run
//msg.setDryRun(false);

// set delay while idle
//msg.setDelayWhileIdle(true);
			//	msg.addDataWithKeyValue('message','Chal bey');
				//msg.timeToLive = Math.floor(Date.now() / 1000) + 3600 * 12; // expires 12 hour from now
   				// message.collapseKey = 'myapp';
    				//message.delayWhileIdle = false;
				console.log(Message);
				var reg_ids=[];
				reg_ids.push(reciverInfo.RegKey);
				sender.send(message,reg_ids,4,function(err,result){
					console.log(JSON.stringify(err));
					console.log("Result is Here........."+JSON.stringify(result));
				});
			});
		});					
	}

	app.post("/ChatWithParrent",function(req,res){
		console.log(req.body);
		SendTOParrent(req.body.senderEmail,req.body.message);
	});

	app.post("/sendMessage",function(req,res){
		console.log(JSON.stringify(req.body));
		SendMessage(req.body.senderEmail,req.body.recieverEmail,req.body.message);	
	});

	app.get("/getParrent/:emailId",function(req,res){
		db.get(req.params.emailId,function(err,result){
			result=getValue(result);
			//console.log(result.allParrent);
			var count=0;
			var resArray=[];
			for(var i in result.allParrent){
				db.get(result.allParrent[i],function(err,result1){
					result1=getValue(result1);
					var newObj={Name:result1.Name,Email:result1.Email};
					count++;
					resArray.push(newObj);
					if(count==result.allParrent.length){
						res.json(resArray);
					}
					//console.log(result1.Name);
				});
			}
			//console.log("Finished");
		});
	});

	app.get("/getChild/:emailId",function(req,res){
                db.get(req.params.emailId,function(err,result){
			//console.log(result);
                        result=getValue(result);
                        //console.log(result);
                        var count=0;
                        var resArray=[];
                        for(var i in result.Child){
                                db.get(result.Child[i],function(err,result1){
					//console.log(result1);
                                        result1=getValue(result1);
                                        var newObj={Name:result1.Name,Email:result1.Email};
                                        count++;
                                        resArray.push(newObj);
                                        if(count==result.Child.length){
                                                res.json(resArray);
                                        }
                                        //console.log(result1.Name);
                                });
                        }
                        //console.log("Finished");
                });
        });


}
