var express = require("express");
const app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http,{
    pingInterval: 10000,
    pingTimeout: 5000,
});
const port = process.env.PORT || 5000;
app.set("port", port);

const database = require('./utils/mysql');
const { encrypt, decrypt, encrypt_jwt, decrypt_jwt } = require('./utils/crypto');
var constants = require('./var/constants');
var career = require('./var/career');
var question = require('./var/questions');
var routes = require("./routes");
const axios = require('axios');
const e = require("express");
const crypto = require('crypto');

var users_json
var user_join = [];
var user_money = 100;
var account_type = 1;

var career_array = career.CAREER_ARRAY;
var question_array = question.QUESTION_ARRAY;
var rabbit_race = constants.SERVER_RABBITS;
var slot_prize = constants.SLOT_PRIZE;
var server_tables = constants.SERVER_TABLES;
var market = constants.SERVER_MARKET;
var profiles = constants.SERVER_PROFILES;
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
var monkey_craps = false;
var monkey_race = false;
var monkey_craps = false;

var blackjack_deck = new Array();
var hidden_dealer = {};
var blackjack_current_player = 0
var blackjack_players = [];
var blackjack_dealer = {};

var rabbit_speed = [3, 1] //max, min
var rabbit_delay = [40, 20] //max, min

let sign_in_up = false;
app.use(routes);

function getData(choice=null, id=null, uuid=null){
	return new Promise(function(resolve, reject){
		if(choice == 'user'){
			if(id){
				//get specific user and it's latest login
				database_config.sql = "SELECT * FROM casino_users INNER JOIN login_history ON casino_users.id = login_history.user_id AND casino_users.id = " + id + " "
				database_config.sql += "AND login_history.id = (";
				database_config.sql += "SELECT login_history.id ";
				database_config.sql += "FROM login_history ";
				database_config.sql += "WHERE login_history.user_id = " + id + " ";
				database_config.sql += "ORDER BY login_history.login_date DESC ";
				database_config.sql += "LIMIT 1 ";
				database_config.sql += ")";
			} else if(uuid){
				//get specific user and it's latest login
				database_config.sql = 'SELECT * FROM casino_users INNER JOIN login_history ON casino_users.id = login_history.user_id where casino_users.uuid = "' + uuid + '" ';
				database_config.sql += "ORDER BY login_history.login_date DESC ";
				database_config.sql += "LIMIT 1 ";
			}
		} else if(choice == 'latest' && id){
			//get specific user all latest login
			database_config.sql = "SELECT * FROM casino_users INNER JOIN login_history ON casino_users.id = login_history.user_id AND casino_users.id = " + id + " "
		} else {
			database_config.sql = "SELECT casino_users.*, login_history.* FROM casino_users, login_history ";
		}
		database(database_config).then(function(result){
			resolve(result);			
		});		
	});	
}

io.on('connection', function(socket) {
	let headers = socket.request.headers
	let device = 0; // 0 = computer, 1 = mobile, 2 = something went wrong
	if(typeof headers["user-agent"] !== "undefined" || headers["user-agent"] !== "null" || headers["user-agent"] !== null || headers["user-agent"] !== ""){
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(headers["user-agent"]) ) {
			device = 1
		}
	} else {
		device = 2;
	}
	socket.on('signin_send', function(data) {
		sign_in_up = false;
		let uuid = crypto.randomBytes(20).toString('hex');
		
		database_config.sql = "SELECT * FROM casino_users";
		database(database_config).then(function(result){
			users_json = result;
			let exists = false;	
			let obj = {};
			let pass01 = data.pass;
			for(let i in users_json){
				let pass02 = decrypt(JSON.parse(users_json[i].pass));				
				if((data.user === users_json[i].user || data.user === users_json[i].email) && pass01 === pass02){
					//the user exists and the password was correct
					exists = true;	
					sign_in_up = true;					
					obj = {id: users_json[i].id, uuid: uuid, user: users_json[i].user, email: users_json[i].email, money: users_json[i].money};
					try{
						io.to(socket.id).emit('signin_read', [exists, obj]);
					}catch(e){
						console.log('[error]','signin_read1 :', e);
					}					

					get_extra_data().then(function(data1) {				
						let extra_data = {
							city: data1.data.city ? data1.data.city : "",
							country: data1.data.country ? data1.data.country : "",
							ip_address: data1.data.ip_address? data1.data.ip_address : "",
						};
						let timestamp = new Date().getTime() + "";
						
						database_config.sql = "UPDATE casino_users SET uuid='" + uuid + "' WHERE id=" + users_json[i].id + "; ";
						database_config.sql += "INSERT INTO login_history (user_id, login_date, device, ip_address, city, country) VALUES (?, ?, ?, ?, ?, ?)";
						let payload =  [users_json[i].id, timestamp, device, extra_data.ip_address, extra_data.city, extra_data.country];
						database(database_config, payload).then(function(){
							users_json[i].ip_address = extra_data.ip_addres;
							users_json[i].city = extra_data.city;
							users_json[i].country = extra_data.country;
							users_json[i].device = device;
						});
					});
					break;
				} else if((data.user === users_json[i].user || data.user === users_json[i].email) && pass01 !== pass02){
					//the user exists but the password was not correct
					exists = true;
					break;
				}
			}			
			try{
				io.to(socket.id).emit('signin_read', [exists, obj]);	
			}catch(e){
				console.log('[error]','signin_read2 :', e);
			}
		});	
	});
	socket.on('signup_send', function(data) {
		sign_in_up = false;
		database_config.sql = 'SELECT * FROM casino_users WHERE user = "' + data.user + '" AND email = "' + data.email + '"';
		database(database_config).then(function(result){
			if(result && result.length == 0){
				sign_in_up = true;	
				let pass = JSON.stringify(encrypt(data.pass));
				let uuid = crypto.randomBytes(20).toString('hex');

				get_extra_data().then(function(data1) {				
					let extra_data = {
						city: data1.data.city ? data1.data.city : "",
						country: data1.data.country ? data1.data.country : "",
						ip_address: data1.data.ip_address? data1.data.ip_address : "",
					};
					let timestamp = new Date().getTime() + "";

					database_config.sql = "INSERT INTO casino_users (uuid, user, email, pass, account_type, money, signup) VALUES (?, ?, ?, ?, ?, ?, ?)";
					let payload =  [uuid, data.user, data.email, pass, account_type, user_money, timestamp];
					database(database_config, payload).then(function(result){
						let insertId = result.insertId;
						database_config.sql = 'INSERT INTO login_history (user_id, login_date, device, ip_address, city, country) VALUES (' + insertId + ', "' + timestamp + '", ' + device + ', "' + extra_data.ip_address + '", "' + extra_data.city + '", "' + extra_data.country + '");';
						database_config.sql += 'SELECT * FROM casino_users;';
						database(database_config).then(function(result){
							users_json = result[1];
							obj = {id: insertId, uuid:uuid, user: data.user, email: data.email, account_type: account_type, money: user_money};
							try{
								io.to(socket.id).emit('signup_read', [false, obj]);
							}catch(e){
								console.log('[error]','signup_read1 :', e);
							}
						});
					});
				});
			} else {
				try{
					// the user already exists
					io.to(socket.id).emit('signup_read', [true, {}]);
				}catch(e){
					console.log('[error]','signup_read2 :', e);
				}
			}
		});
	});
	socket.on('salon_send', function(data) {
		let id = data[0];
		let uuid = data[1];
		if(id && uuid){
			if(sign_in_up){
				check_user_salon(id, uuid);
			} else {
				database_config.sql = "SELECT * FROM casino_users; "
				database(database_config).then(function(data){
					users_json = data;
					check_user_salon(id, uuid);
				});
			}
		} else {
			try{				
				io.to(socket.id).emit('salon_read', false);
			}catch(e){
				console.log('[error]','salon_read0 :', e);
			}
		}		
	});	

	socket.on('user_page_send', function(data) {
		let my_table = data[0];
		let id = data[1];
		let uuid = data[2];		
		if(typeof users_json !== "undefined" && users_json !== "null" && users_json !== null && users_json !== ""){
			check_user_page(id, uuid, my_table);
		} else {
			database_config.sql = "SELECT * FROM casino_users";
			database(database_config).then(function(result){						
				users_json = result;
				check_user_page(id, uuid, my_table);
			});
		}		
	});	

	socket.on('join_room', function(payload) {
		let id = payload.id;
		let uuid = payload.uuid;
		let user = payload.user;
		let user_table = payload.user_table.split(' ').join('_');
		user_table = user_table.toLowerCase();
		
		socket.user_id = id;
		socket.user_uuid = id;
		socket.user = user;
		socket.user_table = user_table;
	
		let room_name = user_table;	
		try{
			socket.join(room_name);
			
			let exists = false;
			for (let i in user_join) {
				if (user_join[i].id === payload.id) {
					exists = true;
					user_join[i] = payload;
					break;
				}
			}
			if(!exists){
				user_join.push(payload);	
			}
				
			sockets.push(socket);
			users[socket.user] = socket;			
			
			if(typeof uuid !== "undefined" && typeof uuid !== "null" && typeof uuid !== null && uuid !== ""){
				io.to(room_name).emit('chatlist', user_join);
			}			
		}catch(e){
			console.log('[error]','join room :',e);
		}
	});	

	socket.on('donate_send', function(data) {
		try{
			io.to(socket.id).emit('donate_read', donations);	
		}catch(e){
			console.log('[error]','donate_read :', e);
		}	
	});
	socket.on('contact_send', function(data) {
		try{
			io.emit('contact_read', contact_details);	
		}catch(e){
			console.log('[error]','contact_read :', e);
		}
	});
	socket.on('support_send', function(data) {
		if(data.lang === "ro"){
			try{
				io.to(socket.id).emit('support_read', "Mesajul a fost trimis");
			}catch(e){
				console.log('[error]','support_send1 :', e);
			}
		} else {
			try{
				io.to(socket.id).emit('support_read', "Message has been sent");	
			}catch(e){
				console.log('[error]','support_send2 :', e);
			}
		}			
	});	
	socket.on('career_send', function(data) {
		try{
			io.to(socket.id).emit('career_read', career_array);	
		}catch(e){
			console.log('[error]','career :', e);
		}	
	});	
	socket.on('questions_send', function(data) {
		try{
			io.to(socket.id).emit('questions_read', question_array);	
		}catch(e){
			console.log('[error]','question :', e);
		}	
	});		
	
	socket.on('chat_message_send', function(data) {		
		let room_name = data.user_table;
		if(room_name === "race" || room_name === "keno"){
			room_name = "salon";
			socket.join(room_name);
		}
		try{
			io.to(room_name).emit('chat_message_read', chatMessage(data.user, data.message));
		}catch(e){
			console.log('[error]','chat_message_read :', e);
		}
	});	
	socket.on('choose_table_send', function(data) {
		let my_table = data.table_name + '_' +data.table_id;
		if(data.table_type !== "" && typeof data.table_type !== "undefined" && data.table_type !== null){
			my_table = my_table + '_' + data.table_type;
		} 
		try{
			io.emit('choose_table_read', my_table);
		}catch(e){
			console.log('[error]','choose_table_read :', e);
		}
	});

	socket.on('change_username_send', function(data) {
		let id = data.id;
		let uuid = data.uuid;
		let user_new = data.user_new;
		for(let i in sockets){
			if(sockets[i].id === id){
				database_config.sql = "UPDATE casino_users SET user='"+user_new+"' WHERE id="+id;
				database(database_config).then(function(result){
					for(let i in users_json){	
						if(id === users_json[i].id){
							users_json[i].user = user_new;
							try{
								io.to(socket.id).emit('change_username_read', "success");
							}catch(e){
								console.log('[error]','change_username_read1 :', e);
							}
							break;
						}
					}
				});
			} else {
				try{
					io.to(socket.id).emit('change_username_read', 'error');
				}catch(e){
					console.log('[error]','change_username_read2 :', e);
				}
			}
		}	
	});
	socket.on('change_password_send', function(data) {
		let id = data.id;
		let uuid = data.uuid;
		let pass_old = data.pass_old;
		let pass_new = data.pass_new;
		for(let i in users_json){
			if(id === users_json[i].id){
				if(pass_old === users_json[i].pass){
					database_config.sql = "UPDATE casino_users SET pass='"+pass_new+"' WHERE id="+id;
					database(database_config).then(function(result){
						users_json[i].pass = pass_new;
						try{
							io.to(socket.id).emit('change_password_read', "success");
						}catch(e){
							console.log('[error]','change_password_read2 :', e);
						}
					});
				} else {
					try{
						io.to(socket.id).emit('change_password_read', 'error');
					}catch(e){
						console.log('[error]','change_password_read2 :', e);
					}
				}
			}
		}	
	});
	socket.on('change_pic_send', function(data) {
		let id = data.id;
		let uuid = data.uuid;
		let pic = data.pic;		
		for(let i in sockets){
			if(sockets[i].user_id === id){
				database_config.sql = "UPDATE casino_users SET profile_pic='"+pic+"' WHERE id="+id;
				database(database_config).then(function(result){
					console.log('pic001 ', result, result.profile_pic)
					for(let i in users_json){	
						if(id === users_json[i].id){
							users_json[i].profile_pic = pic;
							try{
								io.to(socket.id).emit('change_pic_read', users_json[i]);
							}catch(e){
								console.log('[error]','change_pic_read :', e);
							}
							break;
						}
					}
				});
			} 
		}	
	});

	socket.on('roulette_spin_send', function(data) {		
		if(data.spin_click === 1){
			let spin_time = Math.floor(Math.random() * (800 - 300)) + 300;
			//let spin_time = 100;
			let ball_speed = 0.06;
			let room_name = data.user_table;			
			let k = data.my_click;
			let payload = {arc: 0.05, spin_time: spin_time, ball_speed: ball_speed, monkey: monkey_roulette[k]}			
			io.to(room_name).emit('roulette_spin_read', payload);
		}
	});
	socket.on('roulette_results_send', function(data) {
		let money = data.money;
		let id = parseInt(data.user_id);
		if(id && money){
			database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id;
			database(database_config, [id]).then(function(){
				for(let i in users_json){	
					if(data.user_id === users_json[i].id){
						users_json[i].money = money;
						break;
					}
				}
			});
		}
	});

	socket.on('blackjack_get_users_send', function(data) {
		let room_name = data.user_table;
		io.to(room_name).emit('blackjack_get_users_read', user_join);
	});
	socket.on('blackjack_send', function(data) {
		let game_start = false;
		let room_name = data[1].user_table;
		switch (data[0]) {
			case 'start':
				if(!game_start){
					let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
					let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

					blackjack_deck = createDeck(suits, values, 10000);
					blackjack_players = [];
					blackjack_players = user_join
					dealHands();
					//buuu
					
					hidden_dealer.id = blackjack_dealer.id;
					hidden_dealer.hand = [];
					hidden_dealer.hand.push(blackjack_dealer.hand[0])
					io.to(room_name).emit('blackjack_read', ['start', blackjack_players, hidden_dealer, blackjack_deck.length-1]);
					game_start = true;
				} else {
				 	io.to(room_name).emit('blackjack_read', text03);
				}				
				break;
			case 'hit':
				hitMe();
				if(blackjack_players[blackjack_current_player].lose !== true){
					io.to(room_name).emit('blackjack_read', ['hit', blackjack_players, hidden_dealer, blackjack_deck.length-1]);
				 	//console.log('hit--> ', ['stay', blackjack_players, hidden_dealer, blackjack_deck.length-1])
				} else {
					io.to(room_name).emit('blackjack_read', ['hit', blackjack_players, blackjack_dealer, blackjack_deck.length-1]);
				 	//console.log('hit--> ', ['stay', blackjack_players, hidden_dealer, blackjack_deck.length-1])
				}				
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
			for (let i = 0 ; i < values.length; i++){
				for(let j = 0; j < suits.length; j++){
					let weight = parseInt(values[i]);
					if (values[i] == "J" || values[i] == "Q" || values[i] == "K"){
						weight = 10;
					}
					if (values[i] == "A"){
						weight = 11;
					}
					let card = { Value: values[i], Suit: suits[j], Weight: weight };
					blackjack_deck.push(card);
				}
			}		
			return shuffle(turns);
		}		
		function shuffle(turns){        
			for (let i = 0; i < turns; i++){
				let a = Math.floor((Math.random() * blackjack_deck.length));
				let b = Math.floor((Math.random() * blackjack_deck.length));
				let tmp = blackjack_deck[a];		
				blackjack_deck[a] = blackjack_deck[b];
				blackjack_deck[b] = tmp;
			}
		
			return blackjack_deck;
		}		
		function dealHands(){
			//buuu
			blackjack_dealer = {id: "dealer", hand: []}
			for(let i = 0; i < 2; i++){	
				let card = blackjack_deck.pop();
				blackjack_dealer.hand.push(card);
				for (let j = 0; j < blackjack_players.length; j++){
					let card = blackjack_deck.pop();
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
			let card = blackjack_deck.pop();
			blackjack_players[blackjack_current_player].hand.push(card);
			points('hit_me');
			check('busted');
		}		
		function points(reason){
			let points = 0;
			switch (reason) {
				case 'deal_hands':
					for(let i in blackjack_players){
						let points = 0;
						for(let j in blackjack_players[i].hand){
							points = points + blackjack_players[i].hand[j].Weight;
						}
						blackjack_players[i].points = points;
						blackjack_players[i].lose = false;
						blackjack_players[i].win = false;
					}	
					break;
				case 'hit_me':					
					for(let j in blackjack_players[blackjack_current_player].hand){
						points = points + blackjack_players[blackjack_current_player].hand[j].Weight;
					}
					blackjack_players[blackjack_current_player].points = points;
					blackjack_players[blackjack_current_player].lose = false;
					blackjack_players[blackjack_current_player].win = false;
					break;	
				case 'dealer':
					for(let i in blackjack_dealer.hand){
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
					for(let i in blackjack_players){
						if(blackjack_players[i].points === 21){
							blackjack_players[blackjack_current_player].win = true;
						} 
					}	
					break;				
			  }		
		}
		function check_dealer(dealer, player){
			//check if dealer has more points than players
			let dealer_points = dealer.points;
			let player_points = player.points;
			if(dealer_points < player_points){
				return false;
			} else {
				return true;
			}
		}		
		function blackjack_win_lose(){
			let max = -1;

			//ger player with max points
			let score = 0;
			for(let i in blackjack_players){
				if(!blackjack_players[i].lose && blackjack_players[i].points > score){
					max = i;
					score = blackjack_players[i].points;
				}
			}

			//check dealer points
			points('dealer');
			let bigger = check_dealer(blackjack_dealer, blackjack_players[max])
			
			//if(!monkey_blackjack){
				while (!bigger) {
					let card = blackjack_deck.pop();
					blackjack_dealer.hand.push(card);
					
					points('dealer');
					bigger = check_dealer(blackjack_dealer, blackjack_players[max])

					if(blackjack_dealer.points > 21){				
						blackjack_dealer.lose = true;
					} 
				}
			//}			
				
			if(max !== -1){
				if(blackjack_players[max].points > blackjack_dealer.points){
					blackjack_players[max].win = true;
				} else {
					if(!blackjack_dealer.lose){
						blackjack_dealer.win = true;
					} else {
						blackjack_players[max].win = true;
					}
				}
			} else {	
				blackjack_dealer.win = true;
			}
		}
	});
	socket.on('blackjack_results_send', function(data) {
		let money = data.money;
		let id = parseInt(data.user_id);
		if(id && money){
			database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id;
			database(database_config, [id]).then(function(){
				for(let i in users_json){	
					if(data.user_id === users_json[i].id){
						users_json[i].money = money;
						break;
					}
				}
			});
		}
	});
	
	socket.on('slots_send', function(data) {
		let array_big = [];
		let this_user = data.id;
		let reel = data.reel;
		let items = data.items;
		let matrix = [];
		let reason = data.reason;

		for(let i=0; i<19; i++){
			matrix.push(slot_matrix(i, [reel, 3]));
		}

		if(reason != "resize"){
			for(let i=0; i<reel; i++){
				let array_small = Array.from(Array(items).keys());
				array_small = shuffleArray(array_small);
				array_big.push(array_small)
			}	
		}
			
		for(let i in sockets){
		 	if(sockets[i].user_id === this_user){
				let is_lucky = Math.floor(Math.random() * 100);
				let how_lucky = 7;
				if(is_lucky % how_lucky === 0){
					monkey_slots = true;
				}
		 		io.to(socket.id).emit('slots_read', [array_big, matrix, monkey_slots]);
		 	} 
		}
	});
	socket.on('slot_results_send', function(data) {
		let money = data.money;
		let id = parseInt(data.user_id);
		if(id && money){
			database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id;
			database(database_config, [id]).then(function(){
				for(let i in users_json){	
					if(data.user_id === users_json[i].id){
						users_json[i].money = money;
						break;
					}
				}
			});
		}
	});

	socket.on('craps_send', function(data) {
		let is_lucky = Math.floor(Math.random() * 100);
		let how_lucky = 7;
		if(is_lucky % how_lucky === 0){
			monkey_craps = true;
		}
		//monkey_craps = true;
		
		let room_name = data.user_table;
		let how_many_dices = data.how_many_dices;
		let numbers = [];
		let point = data.point;
		let before = data.before;
		let array = [2, 3, 7, 12];

		function set_numbers(){
			let my_numbers = [];
			for(let i=0; i<how_many_dices; i++){
				let number = Math.floor((Math.random() * 6) + 1);				
				my_numbers.push(number);
			}
			return my_numbers;
		}
		
		numbers = set_numbers();
		
		while(numbers[0] == before[0] && numbers[1] == before[1]){
			numbers = set_numbers();
		}
		
		if(monkey_craps){
			// it means the player must lose
			if(point){
				//other rolls must be 2, 3, 7, 12
				if(numbers[0] + numbers[1] !== 2 && numbers[0] + numbers[1] !== 3 && numbers[0] + numbers[1] !== 7 && numbers[0] + numbers[1] !== 12){
					let t = Math.floor((Math.random() * 3) + 0);
					let mynumber = array[t];
					numbers[0] = Math.floor(mynumber/2);
					numbers[1] = mynumber-numbers[0];
				}
			} else {
				// first roll must not be 7
				if(numbers[0] + numbers[1] === 7){
					numbers[0]++
					if(numbers[0]>6){
						numbers[0] = 1;
					}
				}
			}
		} 
			
		try{
			//console.log('craps', numbers, before)
			io.to(room_name).emit('craps_read', numbers);
			
		}catch(e){
			console.log('[error]','craps :', e);
		}	
	});
	socket.on('craps_results_send', function(data) {
		let money = data.money;
		let id = parseInt(data.user_id);
		if(id && money){
			database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id;
			database(database_config, [id]).then(function(){
				for(let i in users_json){	
					if(data.user_id === users_json[i].id){
						users_json[i].money = money;
						break;
					}
				}
			});
		}
	});

	socket.on('race_board_send', function(data) {
		let id = data.id;
		let race_user = data.user;
		let money = 0;
		if(id != -1){
		 	for(let i in users_json){	
				if(id === users_json[i].id){
					money = users_json[i].money;
					break;
				}
		 	}
		}
		for(let i in rabbit_race){			
			rabbit_race[i].max_speed = rabbit_speed[0];
			rabbit_race[i].min_speed = rabbit_speed[1];

			let random_delay = Math.floor(Math.random() * (rabbit_delay[0] - rabbit_delay[1]) ) + rabbit_delay[1];
			rabbit_race[i].delay = random_delay;
			
			rabbit_race[i].health_max = 5;
			rabbit_race[i].health = Math.round(random_delay * rabbit_race[i].health_max / rabbit_delay[0] * 10) / 10;
			
			rabbit_race[i].bet = 0;
			rabbit_race[i].place = 1;
		}
		let server_user = {id: id, user: race_user, money: money, rabbit_race: rabbit_race}
		io.to(socket.id).emit('race_board_read', server_user);
	});
	socket.on('race_results_send', function(data) {
		let money = data.money;
		let id = parseInt(data.user_id);
		if(id && money){
			database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id;
			database(database_config, [id]).then(function(){
				for(let i in users_json){	
					if(data.user_id === users_json[i].id){
						users_json[i].money = money;
						break;
					}
				}
			});
		}
	});

	socket.on('results_send', function(data) {
		let money = data.money;
		let id = parseInt(data.user_id);
		let uuid = data.user_uuid;
		console.log('results_send-->  ', data)
		if(uuid){
			getData('user', null, uuid).then(function(data){
				console.log('getData ', data)
			});
		}
	});
	socket.on('history_send', function(data) {
		try{
			io.emit('history_read', 'oana has appleas');	
		}catch(e){
			console.log('[error]','history_send :', e);
		}
	});

	socket.on('disconnect', function(reason) {
		console.log('disconnect', reason)
		let k = sockets.indexOf(socket); 		
		if(k !== -1){
			if(typeof user_join[k] !== "undefined"){
				if(typeof user_join[k].user !== "undefined"){
					let user_table = user_join[k].user_table.split(' ');		
					user_table = user_table.join('_');				
					let room_name = user_table;
	
					if(typeof user_join[k].user_type !== "undefined"){
						let user_type = user_join[k].user_type;	
						room_name = room_name + '_' + user_type;				
					}	
					
					try{
						io.to(room_name).emit('is_online', '<p class="user_join">' + user_join[k].user + ' left the chat...</p>');
						sockets.splice(k, 1);			
						user_join.splice(user_join.indexOf(k), 1);	
						socket.leave(room_name);
					}catch(e){
						console.log('[error]','disconnect :', e);
					}
				}
			}			
		}
    });	
	socket.on("connect_error", function(err){
		console.log('connect_error --> ', err);
		socket.emit("error", "Connect error");
	})
	socket.on("connect_failed", function(err){
		console.log('connect_failed --> ', err);
		socket.emit("error", "Connect failed");
	})
	socket.on("error", function(err){
		console.log('error --> ', err);
		socket.emit("error", "Something bad happened");
	})

	socket.on('heartbeat', function(data) {
		console.log('heartbeat', data)
	});


	function check_user_salon(id, uuid){	
		getData('latest', id).then(function(result){
			if(result && result.length>0){ // the user actually exists
				let latest = result[result.length-1];
				let first_enter_salon = false;				
				let login_date = parseInt(latest.login_date);
				let timestamp = new Date().getTime();
				let money = latest.money ? latest.money : 0;
				user = latest.user;

				//check first time player
				if(login_date === parseInt(latest.signup) && (timestamp - login_date)/60000 < 0.25){ 
					first_enter_salon = true;
				}

				let obj = {server_tables: server_tables, uuid: uuid, user: user, money: money, first_enter_salon: first_enter_salon, contact: contact_details };
				sign_in_up = false;	

				try{				
					io.to(socket.id).emit('salon_read', obj);
				}catch(e){
					console.log('[error]','salon_read1 :', e);
				}
			} else {
				try{				
					io.to(socket.id).emit('salon_read', false);
				}catch(e){
					console.log('[error]','salon_read2 :', e);
				}
			}
		});
	}

	function check_streak(result){
		const DAYS = 2;
		const DAY_SPAN = DAYS * 24;
		let streak = 1;

		for(let i = 0; i < result.length-1; i++){
			let date01 = new Date(parseInt(result[i].login_date));
			var day01 = date01.getDate();			
			let date02 = new Date(parseInt(result[i+1].login_date));
			var day02 = date02.getDate();
			let period = parseInt(result[i+1].login_date)-parseInt(result[i].login_date);
			let hours = period / 3600000

			if(hours < DAY_SPAN && day01 != day02){
				// less then two days span, but not the same day
				streak++;
			} else if(hours < DAY_SPAN && day01 == day02){
				// he logged again in the same day
			} else {
				// he missed a day or more
				streak = 1;
			}
		}
		return streak;
	}

	function check_user_page(id, uuid, my_table){
		getData('latest', id).then(function(result){
			let game = my_table.split('_')[0]
			let latest = result[result.length-1];	
			let user = latest.user ? latest.user : "";
			let money = latest.money ? latest.money : 0;
			let profile_pic = latest.profile_pic;
			let profile_animal = profiles.filter(a => a.id === parseInt(profile_pic));
			let streak = 1;

			if(result && result.length>0){
				streak = check_streak(result);
			}

			let server_user = {id: id, uuid: uuid, user: user, money: money, streak: streak, profile_pic: [profile_pic, profile_animal], market:market, profiles: profiles, user_table: my_table, game: game, contact: contact_details}
			try{
				io.to(socket.id).emit('user_page_read', server_user);
			}catch(e){
				console.log('[error]','user_page_send1 :', e);
			}
		});
	}
});

function chatMessage(from, text){
	if(text === text01 || text === text02){
		return {from, text};
	} else {
		return {from: from, text:text, time: new Date().getTime()};
	}    
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
		let j = parseInt(Math.random() * i)
		let tmp = array[i];
		array[i] = array[j]
		array[j] = tmp;
    }
	return array;
}

function slot_matrix(x, size){
	let matrix = [];
	let t = 0;	
	let my_prize = slot_prize[x];
	let length01 = size[0];
	let length02 = size[1];
	switch (x) {
		case 0:
		case 1:
		case 2:				
			for(let i=0; i<length01; i++){
				matrix.push([x, i]);
			}
			break; 
		case 3:	
		case 4:				
			for(let i=0; i<length01; i++){
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
			for(let i=0; i<length01; i++){
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
			for(let i=0; i<length01; i++){
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
			for(let i=0; i<length01; i++){
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
			for(let i=0; i<length01; i++){					
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
			for(let i=0; i<length01; i++){					
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
			for(let i=0; i<length01; i++){
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
			for(let i=0; i<length01; i++){					
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

function get_extra_data(){
	return new Promise(function(resolve, reject){
		axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=2813994f865540fe848c8bcb293ec74c')
		.then(response => {
			resolve(response);	
		})
		.catch(error => {
			resolve(error);
		});
	});
}

http.listen(port, () => console.log("Server started on port " + app.get("port") + " on dirname " + __dirname));