var express = require("express");
const app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http,{
    pingInterval: 10000,
    pingTimeout: 5000,
});
const port = process.env.PORT || 5000;
app.set("port", port);

// const fs = require('fs');
const database = require('./utils/mysql');
const { encrypt, decrypt } = require('./utils/crypto');
// const md5 = require('md5');
var constants = require('./var/constants');
var career = require('./var/career');
var question = require('./var/questions');
var routes = require("./routes");
const axios = require('axios');
const e = require("express");

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

// database_config.sql = "DELETE FROM casino_users WHERE user='mysql001' OR user='mysql002' OR user='mysql003' OR user='mysql004' OR user='mysql005' OR user='mysql006' OR user='mysql007' OR user='mysql008' OR user='mysql009'";
// database(database_config).then(function(data){
// 	database_config.sql = "SELECT * FROM casino_users";
// 	database(database_config).then(function(data){
// 		users_json = data;
// 		console.log('users_json--> ', users_json)
// 	});
// });

// database_config.sql = "SELECT * FROM casino_users";
// database(database_config).then(function(data){
// 	users_json = data;	
// 	for(let i in users_json){
// 		//let pass = decrypt(JSON.parse(users_json[i].pass));
// 		//console.log('users_json--> ', users_json[i].user, users_json[i].email, pass)
// 		if( users_json[i].user === "ccc"){
// 			console.log('users_json--> ', users_json[i])
// 		}
// 	}
// 	// console.log('users_json--> ', users_json)
// });

// database_config.sql = "show tables";
// database(database_config).then(function(data){
// 	console.log('show tables--> ', data)
// 	// show tables--> [ 
// 	// 	RowDataPacket { Tables_in_bunny_bet_casino: 'casino_users' },
// 	// 	RowDataPacket { Tables_in_bunny_bet_casino: 'history_users' } 
// 	// ]
// });

// database_config.sql = "ALTER TABLE casino_users ADD COLUMN profile_pic VARCHAR(15) AFTER device";
// database(database_config).then(function(data){
// 	database_config.sql = "SELECT * FROM casino_users";
// 	database(database_config).then(function(data){
// 		users_json = data;
// 		console.log('users_json--> ', users_json)
// 	});
// });


app.use(routes);

io.on('connection', function(socket) {
	let sign_in_up = false;
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
		database_config.sql = "SELECT * FROM casino_users";
		database(database_config).then(function(result){
			users_json = result;
			let exists = false;	
			let obj = {};
			let pass01 = data.pass;
			for(let i in users_json){
				let pass02 = decrypt(JSON.parse(users_json[i].pass));
				if(data.user === users_json[i].user && pass01 === pass02){
					exists = true;	
					obj = {id: users_json[i].id, user: users_json[i].user, email: users_json[i].email, money: users_json[i].money};
					try{
						io.to(socket.id).emit('signin_read', [exists, obj]);
					}catch(e){
						console.log('[error]','signin_read1 :', e);
					}
					sign_in_up = true;
					get_extra_data().then(function(data1) {				
						let extra_data = {
							city: "",
							country: "",
							ip_address: "",
						};
						if(typeof data1.data.city !== "undefined"){
							extra_data.city = data1.data.city;
						}
						if(typeof data1.data.country !== "undefined"){
							extra_data.country = data1.data.country;
						}
						if(typeof data1.data.ip_address !== "undefined"){
							extra_data.ip_address = data1.data.ip_address;
						}
						let timestamp = new Date().getTime() + "";
						database_config.sql = "UPDATE casino_users SET last_signin='"+timestamp+"', device="+device+", ip_address='"+extra_data.ip_address+"', city='"+extra_data.city+"', country='"+extra_data.country+"' WHERE id="+users_json[i].id;
						database(database_config).then(function(){
							users_json[i].ip_address = extra_data.ip_addres;
							users_json[i].city = extra_data.city;
							users_json[i].country = extra_data.country;
							users_json[i].device = device;
							users_json[i].last_signin = timestamp;
						});
					});
					break;
				}
			}
			if(!exists){
				try{
					io.to(socket.id).emit('signin_read', [exists, obj]);	
				}catch(e){
					console.log('[error]','signin_read2 :', e);
				}
			}
		});	
	});
	socket.on('signup_send', function(data) {
		database_config.sql = "SELECT * FROM casino_users";
		database(database_config).then(function(result){
			users_json = result;
			let exists = false;	
			// let pass = md5(data.pass);
			let pass = JSON.stringify(encrypt(data.pass));
			let obj = {};
			for(let i in users_json){	
				if(data.user === users_json[i].user && data.email === users_json[i].email){
					exists = true;
					break;
				}
			}
			if(!exists){
				sign_in_up = true;
				get_extra_data().then(function(data1) {				
					let extra_data = {
						city: "",
						country: "",
						ip_address: "",
					};
					if(typeof data1.data.city !== "undefined"){
						extra_data.city = data1.data.city;
					}
					if(typeof data1.data.country !== "undefined"){
						extra_data.country = data1.data.country;
					}
					if(typeof data1.data.ip_address !== "undefined"){
						extra_data.ip_address = data1.data.ip_address;
					}
					let timestamp = new Date().getTime() + "";
					
					database_config.sql = "INSERT INTO casino_users (user, email, pass, account_type, money, city, country, ip_address, signup, last_signin, device) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
					let payload =  [data.user, data.email, pass, account_type, user_money, extra_data.city, extra_data.country, extra_data.ip_address, timestamp, timestamp, device];
					
					database(database_config, payload).then(function(){
						database_config.sql = "SELECT * FROM casino_users";
						database(database_config).then(function(result){										
							users_json = result;							
							if(!users_json){
								users_json = [];
							}
							for(let i in users_json){					
								if(data.user === users_json[i].user && data.email === users_json[i].email){
									obj = {id: users_json[i].id, user: users_json[i].user, email: users_json[i].email, account_type: users_json[i].account_type, money: user_money};
									try{
										io.to(socket.id).emit('signup_read', [exists, obj]);
									}catch(e){
										console.log('[error]','signup_read1 :', e);
									}
									break;
								}
							}
						});
					});
				});
			} else {
				try{
					io.to(socket.id).emit('signup_read', [exists, obj]);
				}catch(e){
					console.log('[error]','signup_read2 :', e);
				}
			}
		});
	});
	socket.on('salon_send', function(data) {
		let id = data;
		let money = 0;
		if(sign_in_up){
			check_user(users_json);
			sign_in_up = false;
		} else {
			database_config.sql = "SELECT * FROM casino_users";
			database(database_config).then(function(data){
				users_json = data;
				check_user(users_json)
			});
		}
		
		function check_user(users_json){
			let first_enter_salon = false;
			let found = false;
			let obj = {}
			for(let i in users_json){
				if(users_json[i].id === id){
					money = users_json[i].money;
					if(users_json[i].last_signin-users_json[i].signup === 0){ //has 0 milisecond since first arrived here
						first_enter_salon = true;
					}
					found = true;
					obj = {server_tables: server_tables, money: money, first_enter_salon: first_enter_salon};		
					break;
				}
			}
			if(found){
				try{					
					io.to(socket.id).emit('salon_read', obj);
				}catch(e){
					console.log('[error]','salon_read :', e);
				}
			} else {
				io.to(socket.id).emit('salon_read', found);
			}
		}
	});

	socket.on('user_page_send', function(data) {
		let my_table = data[0];
		let game = my_table.split('_')[0]
		let id = data[1];
		let user = data[2];
		let money = 0;
		let profile_pic = null;
		let server_user = null;
		
		if(typeof users_json !== "undefined" && users_json !== "null" && users_json !== null && users_json !== ""){
			for(let i in users_json){	
				if(id === users_json[i].id){
					money = users_json[i].money;
					profile_pic = users_json[i].profile_pic;
					break;
				}
			}
			let profile_animal = profiles.filter(a => a.id === parseInt(profile_pic));
			server_user = {id: id, user: user, money: money, profile_pic: [profile_pic, profile_animal], profile_animal: profile_animal, user_table: my_table, game: game, contact: contact_details}
			try{
				io.to(socket.id).emit('user_page_read', server_user);
			}catch(e){
				console.log('[error]','user_page_send1 :', e);
			}
		} else {
			database_config.sql = "SELECT * FROM casino_users";
			database(database_config).then(function(result){						
				users_json = result;
				for(let i in users_json){	
					if(users_json[i].id === id){
						money = users_json[i].money;
						profile_pic = users_json[i].profile_pic;
						break;
					}
				}
				let profile_animal = profiles.filter(a => a.id === parseInt(profile_pic));
				server_user = {id: id, user: user, money: money, profile_pic: [profile_pic, profile_animal], user_table: my_table, game: game, contact: contact_details}
				try{
					io.emit('user_page_read', server_user);
				}catch(e){
					console.log('[error]','user_page_send2 :', e);
				}	
			});
		}		
	});	

	socket.on('username', function(payload) {
		let username = payload.user;
		let user_table = payload.user_table.split(' ').join('_');
		user_table = user_table.toLowerCase();
		
		socket.user_id = payload.id;
		socket.username = username;
		socket.user_table = user_table;

		let room_name = user_table;
		if(typeof payload.user_type !== "undefined"){
			let user_type = payload.user_type;	
			socket.user_type = user_type;
			room_name = room_name + '_' + user_type;
		}

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
			users[socket.username] = socket;
			
			if(typeof username !== "undefined" && username !== ""){
				io.to(room_name).emit('is_online', '<p class="user_join">' + username + ' join the chat...</p>');
				io.to(room_name).emit('chatlist', user_join);
			}

			if(!sign_in_up){
				get_extra_data().then(function(data1) {
					let extra_data = {
						city: "",
						country: "",
						ip_address: "",
					};
					if(data1){
						if(data1.data){
							if(typeof data1.data.city !== "undefined"){
								extra_data.city = data1.data.city;
							}
							if(typeof data1.data.country !== "undefined"){
								extra_data.country = data1.data.country;
							}
							if(typeof data1.data.ip_address !== "undefined"){
								extra_data.ip_address = data1.data.ip_address; 
							}
						}
					}
					
					let timestamp = new Date().getTime() + "";					
					database_config.sql = "UPDATE casino_users SET last_signin='"+timestamp+"', device="+device+", ip_address='"+extra_data.ip_address+"', city='"+extra_data.city+"', country='"+extra_data.country+"' WHERE id="+payload.id;
					database(database_config).then(function(){
						for(let i in users_json){
							if(payload.id === users_json[i].id){
								users_json[i].ip_address = extra_data.ip_addres;
								users_json[i].city = extra_data.city;
								users_json[i].country = extra_data.country;
								users_json[i].device = device;
								users_json[i].last_signin = timestamp;
								break;
							}
						}
					});
				});
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
		let user_table = data.user_table.split(' ').join('_');
		user_table = user_table.toLowerCase();
		if(data.user_table === "rabbit_race"){
			user_table = "salon";
		}
		let room_name = user_table;		
		if(typeof data.user_type !== "undefined"){
			let user_type = data.user_type;	
			room_name = room_name + '_' + user_type;
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
	socket.on('market_send', function(data) {
		for(let i in users_json){			
			if(users_json[i].id === data.id){
				try{
					io.to(socket.id).emit('market_read', market);
				}catch(e){
					console.log('[error]','market_read :', e);
				}
			} 
		}
	});
	socket.on('change_username_send', function(data) {
		let id = data.id;
		let user_new = data.user_new;
		for(let i in sockets){
			if(sockets[i].user_id === id){
				database_config.sql = "UPDATE casino_users SET user='"+user_new+"' WHERE id="+id;
				database(database_config).then(function(result){
					for(let i in users_json){	
						if(id === users_json[i].id){
							users_json[i].user = user_new;
							try{
								io.to(socket.id).emit('change_username_read', users_json[i]);
							}catch(e){
								console.log('[error]','change_username_read :', e);
							}
							break;
						}
					}
				});
			} 
		}	
	});
	socket.on('profile_send', function(data) {
		let id = data.id;
		for(let i in sockets){
			if(sockets[i].user_id === id){
				try{
					io.to(socket.id).emit('profile_read', profiles);
				}catch(e){
					console.log('[error]','profile_read :', e);
				}
				break;
			} 
		}	
	});
	socket.on('change_pic_send', function(data) {
		let id = data.id;
		let pic = data.pic;		
		for(let i in sockets){
			if(sockets[i].user_id === id){
				database_config.sql = "UPDATE casino_users SET profile_pic='"+pic+"' WHERE id="+id;
				database(database_config).then(function(result){
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
			
			let user_table = data.user_table.split(' ').join('_');
			let user_type = data.user_type;
			let room_name = user_table + '_' + user_type;
			
			let k = data.my_click;
			let payload = {arc: 0.05, spin_time: spin_time, ball_speed: ball_speed, monkey: monkey_roulette[k]}
			
			io.to(room_name).emit('roulette_spin_read', payload);
			//io.emit('roulette_spin_read', payload);
		}
	});
	socket.on('roulette_results_send', function(data) {
		let money = data.money;
		let id = parseInt(data.user_id);
		database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id;
		database(database_config, [id]).then(function(){
			for(let i in users_json){	
				if(data.user_id === users_json[i].id){
					users_json[i].money = money;
					break;
				}
			}
		});
	});

	socket.on('blackjack_get_users_send', function(data) {
		let room_name = data.user_table.split(' ').join('_');
		io.to(room_name).emit('blackjack_get_users_read', user_join);
	});
	socket.on('blackjack_send', function(data) {
		let game_start = false;
		let user_table = data[1].user_table.split(' ').join('_');
		let room_name = user_table;
		if(typeof data[1].user_type !== "undefined"){
			let user_type = data[1].user_type;	
			room_name = room_name + '_' + user_type;
		}
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
		database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id;
		database(database_config, [id]).then(function(){
			for(let i in users_json){	
				if(data.user_id === users_json[i].id){
					users_json[i].money = money;
					break;
				}
			}
		});
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
		database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id;
		database(database_config, [id]).then(function(){
			for(let i in users_json){	
				if(data.user_id === users_json[i].id){
					users_json[i].money = money;
					break;
				}
			}
		});
	});

	socket.on('craps_send', function(data) {
		let is_lucky = Math.floor(Math.random() * 100);
		let how_lucky = 7;
		if(is_lucky % how_lucky === 0){
			monkey_craps = true;
		}
		//monkey_craps = true;
		try{
			let room_name = data.user_table.split(' ').join('_');
			let how_many_dices = data.how_many_dices;
			let numbers = [];
			let point = data.point;
			let before = data.before;
			let array = [2, 3, 7, 12];

			for(let i=0; i<how_many_dices; i++){
				let number = Math.floor((Math.random() * 6) + 1);
				if(number === before[i]){
					number++;
					if(number>6){
						number = 1;
					}
				}
				numbers.push(number);
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
			console.log('craps', numbers, before)
			io.to(room_name).emit('craps_read', numbers);
			
		}catch(e){
			console.log('[error]','craps :', e);
		}	
	});
	socket.on('craps_results_send', function(data) {
		let money = data.money;
		let id = parseInt(data.user_id);
		database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id;
		database(database_config, [id]).then(function(){
			for(let i in users_json){	
				if(data.user_id === users_json[i].id){
					users_json[i].money = money;
					break;
				}
			}
		});
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
		database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id;
		database(database_config, [id]).then(function(){
			for(let i in users_json){	
				if(data.user_id === users_json[i].id){
					users_json[i].money = money;
					break;
				}
			}
		});
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