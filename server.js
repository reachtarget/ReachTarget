var http = require('http');
var app = require('./config/express')();
var schedule = require('node-schedule');

require('./config/database.js')('mongodb://localhost/reachtarget');

http.createServer(app)
	.listen(app.get('port'), function() {
		console.log('Express - Listening in port ' + app.get('port'));

		/*
		var rule = new schedule.RecurrenceRule();
		rule.hour = 7;
		rule.minute = 30;
		rule.dayOfWeek = 1;

		var j = schedule.scheduleJob(rule, function(){
    		console.log('Time for tea!');
		});
		*/
});