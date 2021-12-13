var express = require("express");
const app = express();
const fs = require('fs');
const database = require('./utils/mysql');
const md5 = require('md5');
var constants = require('./var/constants');
var routes = require("./routes");

var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 5000;
app.set("port", port);

var users_json
var user_join = [];
var user_money = 100;
var account_type = 1;

var rabbit_race = constants.SERVER_RABBITS;
var slot_prize = constants.SLOT_PRIZE;
var server_tables = constants.SERVER_TABLES;
var market = constants.SERVER_MARKET;
var donations = constants.DONATIONS;
var contact_details = constants.CONTACT;
var database_config = constants.DATABASE[0];

var text01 = 'The user is offline or does not exist';
var text02 = 'Please type a user ( /w username message )';
var text03 = "Game has begun. Please wait for the next round."

var users = [];
var sockets = [];
var monkey_roulette = [];
var monkey_blackjack = false;
var monkey_slots = false;

var blackjack_deck = new Array();
var hidden_dealer = {};
var blackjack_current_player = 0
var blackjack_players = [];
var blackjack_dealer = {};
var game_start = false;

var rabbit_speed = [3, 1] //max, min
var rabbit_delay = [40, 20] //max, min

database(database_config).then(function(data){
	users_json = data;
});

app.use(routes);

io.on('connection', function(socket) {	
	socket.on('signin_send', function(data) {	
		var exists = false;	
		var obj = {};
		var pass = md5(data.pass);
		for(var i in users_json){
			if(data.user === users_json[i].user && pass === users_json[i].pass){
				exists = true;	
				obj = {id: users_json[i].id, user: users_json[i].user, email: users_json[i].email, money: users_json[i].money};
				io.to(socket.id).emit('signin_read', [exists, obj]);	
				break;
			}
		}
		if(!exists){
			io.to(socket.id).emit('signin_read', [exists, obj]);	
		}			
	});
	socket.on('signup_send', function(data) {
		var exists = false;	
		var pass = md5(data.pass);
		var obj = {};
		for(var i in users_json){	
			if(data.user === users_json[i].user && data.email === users_json[i].email && pass === users_json[i].pass){
				exists = true;
				break;
			}
		}
		if(!exists){
			sort_array_obj(users_json, "id");	
			database_config.sql = "INSERT INTO casino_users (user, email, pass, account_type, money) VALUES ('" + data.user + "', '" + data.email + "', '" + pass + "', '" + account_type + "', '" + user_money + "')";
			database(database_config).then(function(result1){
				database_config.sql = "SELECT * FROM casino_users";
				database(database_config).then(function(result2){
					users_json = result2;			
					for(var i in users_json){						
						if(users_json[i].email === data.email){
							obj = {id: users_json[i].id, user: users_json[i].user, email: users_json[i].email, pass: users_json[i].pass, account_type: users_json[i].account_type, money: user_money};
							io.to(socket.id).emit('signup_read', [exists, obj]);
							break;
						}
					}
				});
			});
		} else {
			io.to(socket.id).emit('signup_read', [exists, obj]);	
		}
	});
	socket.on('salon_send', function(data) {
		io.emit('salon_read', {server_tables: server_tables, server_user: data });
	});
	socket.on('user_page_send', function(data) {
		var my_table = data[0];
		var game = my_table.split('_')[0]
		var id = data[1];
		var user = data[2];
		var money = 0;
		var server_user = null;
		if((id !== "" && id !== "indefined") || (user !== "" && user !== "indefined")){
			for(var i in users_json){	
				if(id === users_json[i].id){
					exists = true;
					money = users_json[i].money;
					break;
				}
			}
			server_user = {id: id, user: user, money: money, user_table: my_table, game: game, contact: contact_details}
			io.to(socket.id).emit('user_page_read', server_user);
		} else {
			io.to(socket.id).emit('user_page_read', server_user);
		}		
	});	
	socket.on('username', function(payload) {
		var username = payload.user;
		var user_table = payload.user_table.split(' ').join('_');
		
		socket.user_id = payload.id;
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
			io.to(room_name).emit('chatlist', user_join);
		}		
    });	
	socket.on('logout_send', function(data) {	
		if (socket.handshake.session.userdata) {
            delete socket.handshake.session.userdata;
            socket.handshake.session.save();
        }
		io.to(socket.id).emit('logout_read', data);
	});

	socket.on('donate_send', function(data) {
		io.to(socket.id).emit('donate_read', donations);		
	});
	socket.on('contact_send', function(data) {
		//io.to(socket.id).emit('contact_read', contact_details);	
		io.emit('contact_read', contact_details);	
	});
	socket.on('support_send', function(data) {
		if(data.lang === "ro"){
			io.to(socket.id).emit('support_read', "Mesajul a fost trimis");	
		} else {
			io.to(socket.id).emit('support_read', "Message has been sent");	
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
	socket.on('market_send', function(data) {
		var this_user = data.id;
		for(var i in sockets){
			if(sockets[i].user_id === this_user){
				io.to(socket.id).emit('market_read', market);
			} 
		}
	});

	socket.on('roulette_spin_send', function(data) {
		if(data.spin_click === 1){
			var spin_time = Math.floor(Math.random() * (1000 - 500)) + 500;
			//var spin_time = 100;
			var ball_speed = 0.06;
			
			var user_table = data.user_table.split(' ').join('_');
			var user_type = data.user_type;
			var room_name = user_table + '_' + user_type;
			
			var k = data.my_click;
			var payload = {arc: 0.05, spin_time: spin_time, ball_speed: ball_speed, monkey: monkey_roulette[k]}
			
			io.to(room_name).emit('roulette_spin_read', payload);
			//io.emit('roulette_spin_read', payload);
		}
	});
	socket.on('roulette_results_send', function(data) {
		var money = data.money;
		var id = parseInt(data.user_id);
		database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id = "+id;
		database(database_config).then(function(result){
			for(var i in users_json){	
				if(data.user_id === users_json[i].id){
					users_json[i].money = money;
					break;
				}
			}
		});
	});

	socket.on('blackjack_get_users_send', function(data) {
		var room_name = data.user_table.split(' ').join('_');
		io.to(room_name).emit('blackjack_get_users_read', user_join);
	});
	socket.on('blackjack_send', function(data) {
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
					
					hidden_dealer.id = blackjack_dealer.id;
					hidden_dealer.hand = [];
					hidden_dealer.hand.push(blackjack_dealer.hand[0])
					io.to(room_name).emit('blackjack_read', ['start', blackjack_players, hidden_dealer, blackjack_deck.length-1]);
					game_start = true;
				} else {
				 	io.to(room_name).emit('blackjack_read', text03);
				}				
				break;
			case 'pause':
				if(!game_start){
					io.to(room_name).emit('blackjack_read', "pause");
				} else {					
					hidden_dealer.id = blackjack_dealer.id;
					hidden_dealer.hand = [];
					hidden_dealer.hand.push(blackjack_dealer.hand[0])
					io.to(room_name).emit('blackjack_read', ['pause', blackjack_players, hidden_dealer]);
				}
				break;
			case 'hit':
				hitMe();
				//console.log('hit--> ', ['stay', blackjack_players, hidden_dealer, blackjack_deck.length-1])
				io.to(room_name).emit('blackjack_read', ['hit', blackjack_players, hidden_dealer, blackjack_deck.length-1]);
				break;
			case 'stay':
				if(blackjack_current_player != blackjack_players.length-1){
					blackjack_current_player++;
					io.to(room_name).emit('blackjack_read', ['stay', blackjack_players, hidden_dealer, blackjack_deck.length-1]);
					//console.log('stay--> ', ['stay', blackjack_players, hidden_dealer, blackjack_deck.length-1])
				} else {
					blackjack_win_lose();
					io.to(room_name).emit('blackjack_read', ['stay', blackjack_players, blackjack_dealer, blackjack_deck.length-1]);
					//console.log('stay--> ', ['stay', blackjack_players, blackjack_dealer, blackjack_deck.length-1])
				}				
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
					} else {
						if(data[1].user_id == blackjack_players[j].id){
							blackjack_players[j].bets = data[1].bets;
						}	
					}	
					blackjack_players[j].hand.push(card);
				}
			}
			points('deal_hands');
			check('blackjack');
		}		
		function hitMe(){
			var card = blackjack_deck.pop();
			blackjack_players[blackjack_current_player].hand.push(card);
			points('hit_me');
			check('busted');
		}		
		function points(reason){
			switch (reason) {
				case 'deal_hands':
					for(var i in blackjack_players){
						var points = 0;
						for(var j in blackjack_players[i].hand){
							points = points + blackjack_players[i].hand[j].Weight;
						}
						blackjack_players[i].points = points;
						blackjack_players[i].lose = false;
						blackjack_players[i].win = false;
					}	
					break;
				case 'hit_me':
					var points = 0;
					for(var j in blackjack_players[blackjack_current_player].hand){
						points = points + blackjack_players[blackjack_current_player].hand[j].Weight;
					}
					blackjack_players[blackjack_current_player].points = points;
					blackjack_players[blackjack_current_player].lose = false;
					blackjack_players[blackjack_current_player].win = false;
					break;	
				case 'dealer':
					var points = 0;
					for(var i in blackjack_dealer.hand){
						points = points + blackjack_dealer.hand[i].Weight;
					}
					blackjack_dealer.points = points;
					break;				
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
		function blackjack_win_lose(){
			points('dealer');

			var winner = -1;
			var score = 0;
			for(var i in blackjack_players){
				if(blackjack_players[i].points > score){
					winner = i;
					score = blackjack_players[i].points;
				}
			}
				
			if(winner !== -1){
				if(blackjack_players[winner].points > blackjack_dealer.points){
					blackjack_players[winner].win = true;
					//console.log('zzz01a--> ', blackjack_players[winner].points, blackjack_dealer.points, blackjack_players[winner].points > blackjack_dealer.points)	
				} else {
					blackjack_dealer.win = true;
					//console.log('zzz01b--> ', blackjack_players[winner].points, blackjack_dealer.points, blackjack_players[winner].points > blackjack_dealer.points)	
				}
			} else {				
				blackjack_dealer.win = true;
				//console.log('zzz02--> ', blackjack_dealer.points)	
			}
		}
	});
	socket.on('blackjack_results_send', function(data) {
		var money = data.money;
		var id = parseInt(data.user_id);
		database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id = "+id;
		database(database_config).then(function(result){
			for(var i in users_json){	
				if(data.user_id === users_json[i].id){
					users_json[i].money = money;
					break;
				}
			}
		});
	});

	var array_big = [];	
	socket.on('slots_send', function(data) {
		var this_user = data.id;
		var reel = data.reel;
		var items = data.items;
		var matrix = [];
		var reason = data.reason;

		for(var i=0; i<19; i++){
			matrix.push(slot_matrix(i, [reel, 3]));
		}

		if(reason != "resize"){
			for(var i=0; i<reel; i++){
				var array_small = Array.from(Array(items).keys());
				array_small = shuffleArray(array_small);
				array_big.push(array_small)
			}	
		}
			
		for(var i in sockets){
		 	if(sockets[i].user_id === this_user){
				var is_lucky = Math.floor(Math.random() * 100);
				var how_lucky = 7;
				if(is_lucky % how_lucky === 0){
					monkey_slots = true;
				}
		 		io.to(socket.id).emit('slots_read', [array_big, matrix, monkey_slots]);
		 	} 
		}
	});
	socket.on('slot_results_send', function(data) {
		var money = data.money;
		var id = parseInt(data.user_id);
		database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id = "+id;
		database(database_config).then(function(result){
			for(var i in users_json){	
				if(data.user_id === users_json[i].id){
					users_json[i].money = money;
					break;
				}
			}
		});
	});

	socket.on('race_board_send', function(data) {
		var id = data.id;
		var race_user = data.user;
		var money = 0;
		if(id != -1){
		 	for(var i in users_json){	
				if(id === users_json[i].id){
					money = users_json[i].money;
					break;
				}
		 	}
		}
		for(var i in rabbit_race){
			var random_delay = Math.floor(Math.random() * rabbit_delay[0]) + rabbit_delay[1];
			rabbit_race[i].delay = random_delay;
			rabbit_race[i].max_speed = rabbit_speed[0];
			rabbit_race[i].min_speed = rabbit_speed[1];
		}
		var server_user = {id: id, user: race_user, money: money, rabbit_race: rabbit_race}
		io.to(socket.id).emit('race_board_read', server_user);
	});

	socket.on('disconnect', function(username) {		
		var k = sockets.indexOf(socket); 		
		if(k !== -1){
			if(typeof user_join[k].user !== "undefined"){
				var user_table = user_join[k].user_table.split(' ');		
				user_table = user_table.join('_');				
				var room_name = user_table;

				if(typeof user_join[k].user_type !== "undefined"){
					var user_type = user_join[k].user_type;	
					room_name = room_name + '_' + user_type;				
				}	
				
				io.to(room_name).emit('is_online', '<p class="user_join">' + user_join[k].user + ' left the chat...</p>');
				
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

function sort_array_obj(array, sort_by){
	var sorted = false;
	switch (typeof sort_by) {
		case 'string': // sort array of objects
			while (!sorted){
				sorted = true;
				for(var i=0; i<array.length-1; i++){
					if (array[i][sort_by] > array[i+1][sort_by]) {
						var t = array[i+1];
						array[i+1] = array[i];
						array[i] = t;
						sorted = false;
					  }
				}
			}			
			break;
		case 'undefined': // sort a simple array
			while (!sorted){
				sorted = true;
				for(var i=0; i<array.length-1; i++){
					if (array[i] > array[i+1]) {
						var t = array[i+1];
						array[i+1] = array[i];
						array[i] = t;
						sorted = false;
					  }
				}
			}
			break;				
	}
  	
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
		var j = parseInt(Math.random() * i)
		var tmp = array[i];
		array[i] = array[j]
		array[j] = tmp;
    }
	return array;
}

function slot_matrix(x, size){
	var matrix = [];
	var t = 0;	
	var my_prize = slot_prize[x];
	var length01 = size[0];
	var length02 = size[1];
	switch (x) {
		case 0:
		case 1:
		case 2:				
			for(var i=0; i<length01; i++){
				matrix.push([x, i]);
			}
			break; 
		case 3:	
		case 4:				
			for(var i=0; i<length01; i++){
				if(i === 2){
					t  = Math.round((length02-1) / 2);
				} else {
					if(x===3){
						if(i===3 || i===4){
							t = length02-1;
						}
					} else {
						t=length02-1;
						if(i === 3 || i === 4){
							t=0;
						}
					}
				}					
				
				matrix.push([t, i]);
			}
			break; 	
		case 5:	
		case 6:				
			for(var i=0; i<length01; i++){
				t = 0
				if(x === 5){
					if(i%2 !== 0){
						t = length02-1;
					}
				} else {
					if(i%2 === 0){
						t = length02-1;
					}
				}
				matrix.push([t, i]);
			}
			break; 
		case 7:	
		case 8:				
			for(var i=0; i<length01; i++){
				t = 0
				if(x === 7){
					if(i%2 !== 0){
						t  = Math.round((length02-1) / 2);
					}
				} else{
					if(i%2 === 0){
						t  = Math.round((length02-1) / 2);
					}
				}
				matrix.push([t, i]);
			}
			break; 	
		case 9:	
		case 10:				
			for(var i=0; i<length01; i++){
				t = 1
				if(x === 9){
					if(i%2 !== 0){
						t = 2;
					}
				} else{
					if(i%2 === 0){
						t  = 0;
					}
				}
				matrix.push([t, i]);
			}
			break; 	
		case 11:	
		case 12:	
			t = (length01-1)/2+1; //3			
			for(var i=0; i<length01; i++){					
				if(x === 11){
					if(i <= (length01-1)/2){
						t = i;
					} else {
						t--;
					}						
				} else{
					if(i > (length01-1)/2){
						t++;
					} else {
						t--;
					}
				}
				matrix.push([t, i]);
			}
			break; 	
		case 11:	
		case 12:	
			t = (length01-1)/2+1; //3			
			for(var i=0; i<length01; i++){					
				if(x === 11){
					if(i <= (length01-1)/2){
						t = i;
					} else {
						t--;
					}						
				} else{
					if(i > (length01-1)/2){
						t++;
					} else {
						t--;
					}
				}
				matrix.push([t, i]);
			}
			break; 	
		case 13:	
		case 14:		
			for(var i=0; i<length01; i++){
				t = 1;	
				if(i === (length01-1)/2){
					if(x === 13){
						t = 0;		
					} else{
						t = (length01-1)/2;	
					}	
				}
				matrix.push([t, i]);
			}
			break; 	
		case 15:	
		case 16:
		case 17:
		case 18:		
			for(var i=0; i<length01; i++){					
				if(x === 15 || x === 16){
					t = (length01-1)/2;
					if(i === (length01-1)/2){
						t = 0;
						if(x === 16){
							t = 1
						}
					}			
				} else{
					t = 0;
					if(i === (length01-1)/2){
						t = 1;
						if(x === 18){
							t = (length01-1)/2
						}
					}		
				}
				
				matrix.push([t, i]);
			}
			break; 	
	} 
	return {matrix_id: x, matrix:matrix, prize:my_prize};
}

http.listen(port, () => console.log("Server started on port " + app.get("port") + " on dirname " + __dirname));