var express = require("express")
const app = express()

var http = require('http').createServer(app)
var io = require('socket.io')(http,{
    pingInterval: 10000,
    pingTimeout: 5000,
})
const port = process.env.PORT || 5000
app.set("port", port)

const fs = require('fs');
// let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))
// let login_user = JSON.parse(fs.readFileSync('./json/login_user.json', 'utf8'))
// let history_user = JSON.parse(fs.readFileSync('./json/history_user.json', 'utf8'))

const { encrypt, decrypt, encrypt_jwt, decrypt_jwt } = require('./utils/crypto')
var constants = require('./var/constants')
var career = require('./var/career')
var question = require('./var/questions')
var routes = require("./routes")
const axios = require('axios')
const e = require("express")
const crypto = require('crypto')

var user_join = []
var default_money = 100
var account_type = 1

var career_array = career.CAREER_ARRAY
var question_array = question.QUESTION_ARRAY
var rabbit_race = constants.SERVER_RABBITS
var slot_prize = constants.SLOT_PRIZE
var server_tables = constants.SERVER_TABLES
var market = constants.SERVER_MARKET
var profiles = constants.SERVER_PROFILES
var donations = constants.DONATIONS
var contact_details = constants.CONTACT
var database_config = constants.DATABASE[0]

var text01 = 'The user is offline or does not exist'
var text02 = 'Please type a user ( /w username message )'
var text03 = "Game has begun. Please wait for the next round."

var users = []
var sockets = []
var monkey_roulette = []
var monkey_blackjack = false
var monkey_slots = false
var monkey_craps = false
var monkey_race = false
var monkey_craps = false

var blackjack_deck = new Array()
var hidden_dealer = {}
var blackjack_current_player = 0
var blackjack_players = []
var blackjack_dealer = {}

var rabbit_speed = [3, 1] //max, min
var rabbit_delay = [40, 20] //max, min

let sign_in_up = false
app.use(routes)

io.on('connection', function(socket) {
    function get_device(headers){
        let device = 0; // 0 = computer, 1 = mobile, 2 = something went wrong
        if(typeof headers["user-agent"] !== "undefined" || headers["user-agent"] !== "null" || headers["user-agent"] !== null || headers["user-agent"] !== ""){
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(headers["user-agent"]) ) {
                device = 1
            }
        } else {
            device = 2
        }
        return device
    }

	socket.on('signin_send', function(data) {
		let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))
        let login_user = JSON.parse(fs.readFileSync('./json/login_user.json', 'utf8'))
        sign_in_up = false;
        let uuid = crypto.randomBytes(20).toString('hex');
        let pass01 = data.pass;

        let headers = socket.request.headers
        let device = get_device(headers)

        let exists = false
        let obj = {}

        for(let i in users_json){
            let pass02 = decrypt(JSON.parse(users_json[i].pass));
            if((data.user === users_json[i].user || data.user === users_json[i].email) && pass01 === pass02){
                //the user exists and the password was correct
                exists = true;	
                sign_in_up = true;
                obj = {id: users_json[i].id, uuid: uuid, user: users_json[i].user, email: users_json[i].email, money: users_json[i].money};
                get_extra_data().then(function(data1) {	
                    let extra_data = {
                        city: data1.data.city ? data1.data.city : "",
                        country: data1.data.country ? data1.data.country : "",
                        ip_address: data1.data.ip_address? data1.data.ip_address : "",
                    }
                    let timestamp = new Date().getTime() + ""

                    //update uuid
                    users_json[i].uuid = uuid

                    let payload = JSON.stringify(users_json)
                    fs.writeFileSync('./json/casino_user.json', payload)

                    if(login_user){
                        let login_id = 0
                        if(login_user.length > 0){
                            login_id = login_user.length-1
                        }                     
                        
                        let new_login = {
                            id: login_id,
                            user_id: users_json[i].id,
                            login_date: timestamp,
                            device: device,
                            ip_address: extra_data.ip_address,
                            city: extra_data.city,
                            country: extra_data.city,
                        }
                        login_user.push(new_login)
                            
                        let payload = JSON.stringify(login_user)
                        fs.writeFileSync('./json/login_user.json', payload)
                        login_user = JSON.parse(fs.readFileSync('./json/login_user.json', 'utf8'))                        
                    }
                })
                break
            } else if((data.user === users_json[i].user || data.user === users_json[i].email) && pass01 !== pass02){
                //the user exists but the password was not correct
                exists = true
                break
            }
        }

        try{
            io.to(socket.id).emit('signin_read', [exists, obj]);	
        }catch(e){
            console.log('[error]','signin_read2 :', e);
        }
	})
	socket.on('signup_send', function(data) {
        let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))
        let login_user = JSON.parse(fs.readFileSync('./json/login_user.json', 'utf8'))
		sign_in_up = false

        let headers = socket.request.headers
        let device = get_device(headers)

        if(users_json){
            let id = 0
            let user_found = false
            if(users_json.length > 0){
                id = users_json.length-1
                for(let i in users_json){
                    if(users_json[i].user && users_json[i].email && (users_json[i].user === data.user && users_json[i].email === data.email)){
                        user_found = true
                        break
                    }
                }
            }

            if(!user_found){
                sign_in_up = true
                let pass = JSON.stringify(encrypt(data.pass))
                let uuid = crypto.randomBytes(20).toString('hex')

                get_extra_data().then(function(data1) {				
                    let extra_data = {
                        city: data1.data.city ? data1.data.city : "",
                        country: data1.data.country ? data1.data.country : "",
                        ip_address: data1.data.ip_address? data1.data.ip_address : "",
                    };
                    let timestamp = new Date().getTime() + ""               

                    let new_user = {
                        id: id,
                        uuid: uuid,
                        user: data.user, 
                        email: data.email,
                        pass: pass,
                        account_type: account_type,
                        money: default_money,
                        signup: timestamp
                    }
                    users_json.push(new_user)
                        
                    let payload = JSON.stringify(users_json)
                    fs.writeFileSync('./json/casino_user.json', payload)
                    users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))

                    if(login_user){
                        let login_id = 0
                        if(login_user.length > 0){
                            login_id = login_user.length-1
                        }                     
                        
                        let new_login = {
                            id: login_id,
                            user_id: id,
                            login_date: timestamp,
                            device: device,
                            ip_address: extra_data.ip_address,
                            city: extra_data.city,
                            country: extra_data.city,
                        }
                        login_user.push(new_login)
                            
                        let payload = JSON.stringify(login_user)
                        fs.writeFileSync('./json/login_user.json', payload)
                        login_user = JSON.parse(fs.readFileSync('./json/login_user.json', 'utf8'))

                        let obj = {id: id, uuid:uuid, user: data.user, email: data.email, account_type: account_type, money: default_money};
                        try{
                            io.to(socket.id).emit('signup_read', [false, obj]);
                        }catch(e){
                            console.log('[error]','signup_read1 :', e);
                        }
                    }
                })
            } else {
                try{
					// the user already exists
					io.to(socket.id).emit('signup_read', [true, {}]);
				}catch(e){
					console.log('[error]','signup_read2 :', e);
				}
            }
        }
	})
	socket.on('salon_send', function(uuid) {
        if(uuid){
			let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))  

            let user_found;
            for(let i in users_json){
                if(users_json[i].uuid == uuid){
                    user_found = users_json[i];											
                    break;
                }
            }

            if(user_found){				
                let first_enter_salon = false;		
                let id = user_found.id;
                let user = user_found.user;
                let money = user_found.money;
                let signup = user_found.signup;
                let timestamp = new Date().getTime();
                
                let login_user = JSON.parse(fs.readFileSync('./json/login_user.json', 'utf8'))                
                let latest = null;
                for(let i in login_user){
                    if(login_user[i].user_id == id){
                        latest = login_user[i];
                    }
                }
                if(latest){
                    //check first time player
                    if(latest.login_date === signup && (timestamp - parseInt(latest.login_date))/60000 < 0.25){ 
                        first_enter_salon = true;
                    }
                }

                let obj = {server_tables: server_tables, uuid: uuid, user: user, money: money, first_enter_salon: first_enter_salon, contact: contact_details }
				try{				
					io.to(socket.id).emit('salon_read', obj);
				}catch(e){
					console.log('[error]','salon_read1 :', e);
				}
            } else {
                try{				
                    io.to(socket.id).emit('salon_read', {});
                }catch(e){
                    console.log('[error]','salon_read0 :', e);
                }
            }
		} else {
			try{				
				io.to(socket.id).emit('salon_read', false);
			}catch(e){
				console.log('[error]','salon_read0 :', e);
			}
		}
	})
	socket.on('user_page_send', function(data) {
        if(data.uuid){
            let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8')) 
			let table = data.table;
			let uuid = data.uuid;	
			
            let user_found;
            for(let i in users_json){
                if(users_json[i].uuid == uuid){
                    user_found = users_json[i];											
                    break;
                }
            }

            if(user_found){	
                let id = user_found.id;
                let user = user_found.user;
                let money = user_found.money;
                let game = table.split('_')[0];
                let type = table.split('_')[2];
                let profile_pic = user_found.profile_pic;
                let profile_animal = profiles.filter(a => a.id === parseInt(profile_pic));
                let server_user = {id: id, uuid: uuid, user: user, money: money, profile_pic: [profile_pic, profile_animal], market:market, profiles: profiles, user_table: table, game: game, contact: contact_details}		
                
                socket.user_id = id;
                socket.user_uuid = uuid;
                socket.user = user;
                socket.user_table = table;	

                let login_user = JSON.parse(fs.readFileSync('./json/login_user.json', 'utf8'))           
                let logs =[];
				for(let i in login_user){
					if(login_user[i].user_id == id){
						logs.push(login_user[i]);							
					}
				}
                server_user.streak = check_streak(logs);
				let room_name = table;	
                
                try{
					socket.join(room_name);
					
					let exists = false;
					for (let i in user_join) { // list of user who join a room
						if (user_join[i].id === id) {
							exists = true;
							user_join[i] = {id: id, uuid: uuid, user: user, user_table: table, user_type: type, time: new Date().getTime()};
							break;
						}
					}
					if(!exists){
						user_join.push({id: id, uuid: uuid, user: user, user_table: table, user_type: type, time: new Date().getTime()});	
					}
						
					sockets.push(socket);
					users[socket.user] = socket;			
					
					io.to(socket.id).emit('user_page_read', server_user);
					io.to(room_name).emit('chatlist', user_join);			
				}catch(e){
					console.log('[error]','join room :',e);
				}
            } else {
                try{
                    io.to(socket.id).emit('user_page_read', null);
                }catch(e){
                    console.log('[error]','user_page_send1 :', e);
                }
            }
		} else {
			try{
				io.to(socket.id).emit('user_page_read', null);
			}catch(e){
				console.log('[error]','user_page_send1 :', e);
			}
		}
    })

	socket.on('donate_send', function(data) {
		try{
			io.to(socket.id).emit('donate_read', donations);	
		}catch(e){
			console.log('[error]','donate_read :', e);
		}	
	})
	socket.on('contact_send', function(data) {
		try{
			io.emit('contact_read', contact_details);	
		}catch(e){
			console.log('[error]','contact_read :', e);
		}
	})
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
	})
	socket.on('career_send', function(data) {
		try{
			io.to(socket.id).emit('career_read', career_array);	
		}catch(e){
			console.log('[error]','career :', e);
		}	
	})
	socket.on('questions_send', function(data) {
		try{
			io.to(socket.id).emit('questions_read', question_array);	
		}catch(e){
			console.log('[error]','question :', e);
		}	
	})	
	
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
	})
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
	})

	socket.on('change_username_send', function(data) {
		let uuid = data.uuid;
		let user_new = data.user_new;
        let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))
        
        for(let i in users_json){
            if(users_json[i].uuid == uuid){
                users_json[i].user = user_new;										
                break;
            }
        }
        let payload = JSON.stringify(users_json)
        fs.writeFileSync('./json/casino_user.json', payload)
	})
	socket.on('change_password_send', function(data) {
		let uuid = data.uuid;
		let pass_old = data.pass_old;
		let pass_new = data.pass_new;
        let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))

        for(let i in users_json){
            
        }
        let payload = JSON.stringify(users_json)
        fs.writeFileSync('./json/casino_user.json', payload)
	})
	socket.on('change_pic_send', function(data) {
		let uuid = data.uuid;
		let pic = data.pic;		
        let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))

        for(let i in users_json){
            
        }
        let payload = JSON.stringify(users_json)
        fs.writeFileSync('./json/casino_user.json', payload)
	})

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
	})

	socket.on('blackjack_get_users_send', function(data) {
		let room_name = data.user_table;
		io.to(room_name).emit('blackjack_get_users_read', user_join);
	})
	
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
	})

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
	})

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
	})

	socket.on('results_send', function(data) {
		
	})

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
    })
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
	})
});

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