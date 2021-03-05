var express = require("express");
var path = require("path");
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');

var constants = require('./var/constants');
var routes = require("./routes");
var sess_users = constants.SESS_USERS;

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 5000;
app.set("port", port);

// app.set("views", path.join(__dirname, "react_build/views"));
// app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/react_build/views/include/', partialsDir: __dirname + '/react_build/views/include/partials/'}));
// app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/react_build/assets', express.static('assets'));

var user_join = [];
var user_id = -1;

var email = "";
var user = "";
var pass = "";
var user_money = constants.MONEY;

var text01 = 'The user is offline or does not exist';
var text02 = 'Please type a user ( /w username message )';
var text03 = "Game has begun. Please wait for the next round."
var users = [];
var sockets = [];
var monkey = [];

var blackjack_deck = new Array();
var hidden_dealer = {};
var blackjack_current_player = 0
var blackjack_players = [];
var blackjack_dealer = {};
var game_start = false;

var server_tables = constants.SERVER_TABLES;
var market = constants.SERVER_MARKET;

app.use(routes);

io.on('connection', function(socket) {	
	socket.on('signin_send', function(data) {	
		var exists = false;	
		for(var i in sess_users){
			if(data.user === sess_users[i].user && data.pass === sess_users[i].pass){
				exists = true;
				user = data.user;
				pass = data.pass;
			}
		}
		io.to(socket.id).emit('signin_read', exists);		
	});

	socket.on('signup_send', function(data) {		
		var exists = false;	
		for(var i in sess_users){	
			if(data.user === sess_users[i].user && data.email === sess_users[i].email && data.pass === sess_users[i].pass){
				exists = true;
				user = data.user;
				email = data.user;
				pass = data.pass;
			}
		}	
		io.to(socket.id).emit('signup_read', exists);
	});

	socket.on('salon_send', function(data) {
		io.emit('salon_read', {server_tables: server_tables, server_user: user });
	});

	socket.on('logout_send', function(data) {	
		if (socket.handshake.session.userdata) {
            delete socket.handshake.session.userdata;
            socket.handshake.session.save();
        }
		io.to(socket.id).emit('logout_read', data);
	});

	socket.on('username', function(payload) { 	
		user_id++	
		payload.id = user_id;
		var username = payload.user;
		var user_table = payload.user_table.split(' ').join('_');
		
		socket.user_id = user_id;
		socket.username = username;
		socket.user_table = user_table;

		var room_name = user_table;
		if(typeof payload.user_type !== "undefined"){
			var user_type = payload.user_type;	
			socket.user_type = user_type;
			room_name = room_name + '_' + user_type;
		}
		socket.join(room_name);
		
		user_join.push(payload);		
		sockets.push(socket);
		users[socket.username] = socket;
		
		if(typeof username !== "undefined" && username !== ""){
			io.to(room_name).emit('is_online', '<p class="user_join">' + username + ' join the chat...</p>');
			io.to(room_name).emit('user_id', user_id);
			io.to(room_name).emit('chatlist', user_join);
		}		
    });		
	
	socket.on('chat_message_send', function(data) {
		var user_table = data.user_table.split(' ').join('_');
		var room_name = user_table;
		if(typeof data.user_type !== "undefined"){
			var user_type = data.user_type;	
			room_name = room_name + '_' + user_type;
		}

		io.to(room_name).emit('chat_message_read', chatMessage(data.user, data.message));		
	});	

	socket.on('choose_table_send', function(data) {
		var my_table = data.table_name + '_' +data.table_id;
		if(data.table_type !== "" && typeof data.table_type !== "undefined" && data.table_type !== null){
			my_table = my_table + '_' + data.table_type;
		} 
		io.emit('choose_table_read', my_table);
	});

	socket.on('user_page_send', function(data) {
		var my_table = data;
		var game = my_table.split('_')[0]
		var server_user = {user: user, money: user_money, user_table: my_table, game: game}
		io.to(socket.id).emit('user_page_read', server_user);
	});

	socket.on('market_send', function(data) {
		//console.log('market_send1', data)		
		var this_user = data.id;
		for(var i in sockets){
			if(sockets[i].user_id === this_user){
				//console.log('market_send2', sockets[i].user_id, this_user)
				sockets[i].emit('market_read', market);
			} 
		}
	});

	socket.on('roulette_spin_send', function(data) {
		//console.log('roulette_spin_send', data)
		if(data.spin_click === 1){
			var spin_time = Math.floor(Math.random() * (1000 - 500)) + 500;
			//var spin_time = 100;
			var ball_speed = 0.06;
			
			var user_table = data.user_table.split(' ').join('_');
			var user_type = data.user_type;
			var room_name = user_table + '_' + user_type;
			
			var k = data.my_click;
			var payload = {arc: 0.05, spin_time: spin_time, ball_speed: ball_speed, monkey: monkey[k]}
			
			io.to(room_name).emit('roulette_spin_read', payload);
			//io.emit('spin_read', payload);
		}
	});

	socket.on('blackjack_send', function(data) {
		//console.log('blackjack_send', data)	
		var user_table = data[1].user_table.split(' ').join('_');
		var room_name = user_table;
		if(typeof data[1].user_type !== "undefined"){
			var user_type = data[1].user_type;	
			room_name = room_name + '_' + user_type;
		}

		switch (data[0]) {
			case 'start':
				//if(!game_start){
					var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
					var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

					blackjack_deck = createDeck(suits, values, 10000);

					blackjack_players = user_join
					dealHands();
					
					hidden_dealer.id = blackjack_dealer.id;
					hidden_dealer.hand = [];
					hidden_dealer.hand.push(blackjack_dealer.hand[0])
					io.to(room_name).emit('blackjack_read', ['start', blackjack_players, hidden_dealer, blackjack_deck.length-1]);
					game_start = true;
				// } else {
				// 	io.to(room_name).emit('blackjack_read', text03);
				// }				
				break;
			case 'pause':
				if(!game_start){
					//io.to(room_name).emit('blackjack_read', "aaa");
				} else {					
					hidden_dealer.id = blackjack_dealer.id;
					hidden_dealer.hand = [];
					hidden_dealer.hand.push(blackjack_dealer.hand[0])
					io.to(room_name).emit('blackjack_read', ['pause', blackjack_players, hidden_dealer]);
				}
				break;
			case 'hit':
				hitMe();
				io.to(room_name).emit('blackjack_read', ['hit', blackjack_players, hidden_dealer, blackjack_deck.length-1]);
				break;
			case 'stay':
				stay();
				io.to(room_name).emit('blackjack_read', ['stay', blackjack_players, hidden_dealer, blackjack_deck.length-1]);
				break;
		  }	
		  
		function createDeck(suits, values, turns){
			blackjack_deck = new Array();
			for (var i = 0 ; i < values.length; i++){
				for(var j = 0; j < suits.length; j++){
					var weight = parseInt(values[i]);
					if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
						weight = 10;
					if (values[i] == "A")
						weight = 11;
					var card = { Value: values[i], Suit: suits[j], Weight: weight };
					blackjack_deck.push(card);
				}
			}		
			return shuffle(turns);
		}
		
		function shuffle(turns){        
			for (var i = 0; i < turns; i++){
				var a = Math.floor((Math.random() * blackjack_deck.length));
				var b = Math.floor((Math.random() * blackjack_deck.length));
				var tmp = blackjack_deck[a];
		
				blackjack_deck[a] = blackjack_deck[b];
				blackjack_deck[b] = tmp;
			}
		
			return blackjack_deck;
		}
		
		function dealHands(){
			blackjack_dealer = {id: "dealer", hand: []}
			for(var i = 0; i < 2; i++){	
				var card = blackjack_deck.pop();	
				blackjack_dealer.hand.push(card);		
				for (var j = 0; j < blackjack_players.length; j++){
					var card = blackjack_deck.pop();
					if(i === 0){
						blackjack_players[j].hand = [];
					}	
					blackjack_players[j].hand.push(card);			
				}
			}
			points();
			check('blackjack');
		}
		
		function hitMe(){
			var card = blackjack_deck.pop();
			blackjack_players[blackjack_current_player].hand.push(card);
			points();
			check('busted');
		}
		
		function points(){
			for(var i in blackjack_players){
				var points = 0;
				for(var j in blackjack_players[i].hand){
					points = points + blackjack_players[i].hand[j].Weight;
				}
				blackjack_players[i].points = points;
				blackjack_players[i].lose = false;
				blackjack_players[i].win = false;
			}
		}
		
		function check(reason){
			switch (reason) {
				case 'busted':
					if(blackjack_players[blackjack_current_player].points > 21){				
						blackjack_players[blackjack_current_player].lose = true;
					} 				
					break;
				case 'blackjack':
					for(var i in blackjack_players){
						if(blackjack_players[i].points === 21){
							blackjack_players[blackjack_current_player].win = true;
						} 
					}	
					break;				
			  }		
		}
		
		function stay(){
			if(blackjack_current_player != blackjack_players.length-1){
				blackjack_current_player++;
			} else {
				blackjack_win_lose();
			}
		}
		
		function blackjack_win_lose(){
			dealer_hand();

			var winner = -1;
			var score = 0;
			for(var i in blackjack_players){
				if(blackjack_players[i].lose){
					if(blackjack_players[i].points > score){
						winner = i;
						score = blackjack_players[i].points;
					}
				}
			}
			blackjack_players[winner].win = true;
		}

		function dealer_hand(){

		}
	});

	socket.on('disconnect', function(username) {		
		var k = sockets.indexOf(socket); 		
		if(k !== -1){
			if(typeof user_join[k].user !== "undefined"){
				var user_table = user_join[k].user_table.split(' ').join('_');				
				var room_name = user_table + '_' + user_type;
				if(typeof user_join[k].user_type !== "undefined"){
					var user_type = user_join[k].user_type;	
					room_name = room_name + '_' + user_type;
				}				
				//console.log('username2--- ', k, username, room_name, user_join[k]);
				
				io.to(room_name).emit('is_online', '<p class="user_join">' + user_join[k].user + ' left the chat...</p>');
				//io.emit('is_online', '<p class="user_join">' + user_join[k].user + ' left the chat...</p>');
				
				sockets.splice(k, 1);			
				user_join.splice(user_join.indexOf(k), 1);	
			}			
		}
    });
});

function chatMessage(from, text){
	if(text === text01 || text === text02){
		return {from, text};
	} else {
		return {from: from, text:text, time: new Date().getTime()};
	}    
};

http.listen(port, () => console.log("Server started on port " + app.get("port") + " on dirname " + __dirname));




// var mysql = require('mysql');
// var con = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'root',
// 	password : '',
// 	database : 'my_db'
// });
// con.connect(function(err) {
// 	if (err) {
// 		console.log('err1--> ', err);
// 		throw err;
// 	}
// 	console.log('connection');
// 	con.query("SELECT * FROM users", function (err, result, fields) {
// 	  	if (err) {
// 			console.log('err2--> ', err);
// 		  	throw err;
// 	  	}
// 	  	console.log(result);
// 	});
// }); 

// con.end();