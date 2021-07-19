/////////express
const express = require("express");
const app = express();
var http = require('http').Server(app);
/////////discord.js
const Discord = require('discord.js');
const bot = new Discord.Client();

let config = require('./cfg.json');
let token = config.token;
let prefix = config.prefix;
/////////socket.io
var io = require('socket.io')(http);

let userCount = 0;
 
 function isEmpty(str) {
  if (str.trim() == '') 
    return true;
    
  return false;
}
 
 bot.on("ready", function() {
	console.log(bot.user.username + " started!");
	bot.user.setActivity("на тебя", { type: 'WATCHING' });
});
 
io.on('connection', function(socket) {
   console.log('A user connected');
	userCount++;
	console.log(userCount);
	let msg;
	let uname;
	let ch = bot.channels.cache.get('785026166582018050');
	socket.on('uname', function(data) {
		console.log(data);
		uname = data;
	});
	socket.on('msg', function(data) {
		console.log(data);
		msg = data;
	});
	socket.on('send', function(data) {
		try{
			if(msg === "") {
				console.log("Error");
				socket.emit('msgempty', { description: 'msgempty'});
				return socket.emit('msgempty', { description: 'msgempty'});
			}
			const wh = new Discord.WebhookClient('866671201132871680', '8YYnxiVzeZQGAmzq1bR41b5OpOynpxHGBmK5UYQk9y3IwsIwoQRPqG2VHi0usqqy_Xsi');

			//ch.createWebhook(uname)
			//.then(webhook => console.log(`Created webhook ${webhook}`))
			//.catch(console.error);

			//const webhooks = ch.fetchWebhooks();
			//const wh = webhooks.first();
			wh.send(msg, {
				username: uname,
			})
			.then(function(){})
			.catch(function(){
				console.log("Error");
				return socket.emit('error', { description: 'error'});
			});
			//wh.delete();
		} catch (err) {
			console.log(err);
			return socket.emit('error', { description: 'error'});
		}
	});
	
   socket.on('disconnect', function () {
      console.log('A user disconnected');
	  userCount--;
	  console.log(userCount);
   });
});
app.use(express.static(__dirname + "/site"));
http.listen(80, function() {
   console.log('listening on *:80');
});

bot.login(token);