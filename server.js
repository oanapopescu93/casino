var express = require("express");
var session = require('express-session');
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
var clients = [];
var monkey = [];

var blackjack_deck = new Array();
var hidden_dealer = {};
var blackjack_current_player = 0
var blackjack_players = [];
var blackjack_dealer = {};
var game_start = false;

var server_tables = constants.SERVER_TABLES;
var market = constants.SERVER_MARKET;
var my_session;

//SESSION
// const SESS_LIFETIME = 1000 * 60 * 60 * constants.SESS_HOURS;
// const SESS_PROD = constants.NODE_ENV === "production";
// const SESS_NAME = "sid"
// const SESS_SECRET = "secret001"
// app.use(session({
// 	name: SESS_NAME,
// 	resave: false,
// 	saveUninitialized: false,
// 	secret: SESS_SECRET,
// 	cookie:{
// 		maxAge: SESS_LIFETIME,
// 		sameSite: true,
// 		secure: SESS_PROD,
// 	}
// }));

app.use(routes);

io.on('connection', function(client) {		
	client.on('signin_send', function(data) {	
		var exists = false;	
		for(var i in sess_users){
			if(data.user === sess_users[i].user && data.pass === sess_users[i].pass){
				exists = true;
				user = data.user;
				pass = data.pass;
			}
		}		
		io.to(client.id).emit('signin_read', exists);		
	});

	client.on('signup_send', function(data) {		
		var exists = false;	
		for(var i in sess_users){	
			if(data.user === sess_users[i].user && data.email === sess_users[i].email && data.pass === sess_users[i].pass){
				exists = true;
				user = data.user;
				email = data.user;
				pass = data.pass;
			}
		}	
		io.to(client.id).emit('signup_read', exists);
	});

	client.on('username', function(payload) { 		
		user_id++	
		payload.id = user_id;
		var username = payload.user;
		var user_table = payload.user_table.split(' ').join('_');
		
		client.user_id = user_id;
		client.username = username;
		client.user_table = user_table;

		var room_name = user_table;
		if(typeof payload.user_type !== "undefined"){
			var user_type = payload.user_type;	
			client.user_type = user_type;
			room_name = room_name + '_' + user_type;
		}
		client.join(room_name);
		
		user_join.push(payload);		
		clients.push(client);
		users[client.username] = client;

		console.log('AAA00 ', user) 
		console.log('AAA00 ', username) 
		console.log('AAA00 ', user_join) 
		console.log('AAA00 ', payload) 	
		
		if(typeof username !== "undefined" && username !== ""){
			io.to(room_name).emit('is_online', '<p class="user_join">' + username + ' join the chat...</p>');
			io.to(room_name).emit('user_id', user_id);
			io.to(room_name).emit('chatlist', user_join);
		}		
    });	
	
	client.on('disconnect', function(username) {		
		var k = clients.indexOf(client); 
		
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
				
				clients.splice(k, 1);			
				user_join.splice(user_join.indexOf(k), 1);	
			}			
		}
    });
	
	client.on('chat_message_send', function(data) {
		//console.log('chat_message_send', data, user_join);
		var user_table = data.user_table.split(' ').join('_');
		var room_name = user_table;
		if(typeof data.user_type !== "undefined"){
			var user_type = data.user_type;	
			room_name = room_name + '_' + user_type;
		}

		io.to(room_name).emit('chat_message_read', chatMessage(data.user, data.message));
		//io.emit('chat_message_read', chatMessage(data.user, data.message))	
		
	});		

	client.on('salon_send', function(data) {
		io.emit('salon_read', {server_tables: server_tables, server_user: user });
	});

	client.on('choose_table_send', function(data) {
		var my_table = data.table_name + '_' +data.table_id;
		if(data.table_type !== "" && typeof data.table_type !== "undefined" && data.table_type !== null){
			my_table = my_table + '_' + data.table_type;
		} 
		io.emit('choose_table_read', my_table);
	});

	client.on('user_page_send', function(data) {
		var my_table = data;
		var game = my_table.split('_')[0]
		var server_user = {user: user, money: user_money, user_table: my_table, game: game}
		console.log('AAA01 ', user, user_join)
		io.to(client.id).emit('user_page_read', server_user);
	});

	client.on('market_send', function(data) {
		//console.log('market_send1', data)		
		var this_user = data.id;
		for(var i in clients){
			if(clients[i].user_id === this_user){
				//console.log('market_send2', clients[i].user_id, this_user)
				clients[i].emit('market_read', market);
			} 
		}
	});

	client.on('roulette_spin_send', function(data) {
		//console.log('roulette_spin_send', data)
		if(data.spin_click === 1){
			var spin_time = Math.floor(Math.random() * (1000 - 500)) + 500;
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

	client.on('blackjack_send', function(data) {
		console.log('blackjack_send', data)	
		var user_table = data[1].user_table.split(' ').join('_');
		var room_name = user_table;
		if(typeof data[1].user_type !== "undefined"){
			var user_type = data[1].user_type;	
			room_name = room_name + '_' + user_type;
		}

		switch (data[0]) {
			case 'start':
				if(!game_start){
					var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
					var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

					blackjack_deck = createDeck(suits, values, 10000);

					blackjack_players = user_join
					dealHands();
					updatePoints();

					
					hidden_dealer.id = blackjack_dealer.id;
					hidden_dealer.hand = [];
					hidden_dealer.hand.push(blackjack_dealer.hand[0])
					io.to(room_name).emit('blackjack_read', ['start', blackjack_players, hidden_dealer]);
					game_start = true;
				} else {
					io.to(room_name).emit('blackjack_read', text03);
				}				
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
				break;
			case 'stay':
				break;
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
	// alternate handing cards to each player
	// 2 cards each
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
}

function hitMe(){
	// pop a card from the deck to the current player
	// check if current player new points are over 21
	var card = deck.pop();
	user_join[blackjack_current_player].hand.push(card);
	updatePoints();
	check();
}

function stay(){
	// move on to next player if any
}

function updatePoints(){
	for (var i = 0; i < user_join.length; i++){
		getPoints(i);
	}
}

function getPoints(x){
	var points = 0;
	for(var i = 0; i < user_join[x].hand.length; i++){
		points += user_join[x].hand[i].Weight;
	}
	user_join[x].points = points;
}

function check(){
	
}

function stay(){
	
}

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