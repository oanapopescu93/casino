var express = require("express")
const app = express()

var http = require('http').createServer(app)
var io = require('socket.io')(http,{
    pingInterval: 10000,
    pingTimeout: 5000,
})
const port = process.env.PORT || 5000
app.set("port", port)

const database = require('./utils/mysql')
const { encrypt, decrypt, encrypt_jwt, decrypt_jwt } = require('./utils/crypto')

var constants = require('./var/constants')
var career = require('./var/career')
var question = require('./var/questions')
var routes = require("./routes")

const axios = require('axios')
const crypto = require('crypto')

const { roulette } = require("./server_games/roulette")
const { blackjack } = require("./server_games/blackjack")
const { slots } = require("./server_games/slots")
const { craps } = require("./server_games/craps")
const { race } = require("./server_games/race")
const { keno } = require("./server_games/keno")
const { get_room_name, get_user_from_uuid, get_device, check_streak, chatMessage, get_extra_data } = require("./utils/other")

var users_array
var user_join = []
var user_money = 100
var account_type = 1
var database_config = constants.DATABASE[0]

var sockets = []
let how_lucky = 7
let sign_in_up = false

app.use(routes)

io.on('connection', function(socket) {
	socket.on('signin_send', function(data) {
		sign_in_up = false
		let uuid = crypto.randomBytes(20).toString('hex')
		let device = get_device(socket.request.headers)
		
		database_config.sql = "SELECT * FROM casino_users"
		database(database_config).then(function(result){
			users_array = result
			let exists = false
			let obj = {}
			let pass01 = data.pass
			for(let i in users_array){
				let pass02 = decrypt(JSON.parse(users_array[i].pass))
				if((data.user === users_array[i].user || data.user === users_array[i].email) && pass01 === pass02){
					//the user exists and the password was correct
					exists = true
					sign_in_up = true
					get_extra_data().then(function(data1){	
						let extra_data = {
							city: data1.data.city ? data1.data.city : "",
							country: data1.data.country ? data1.data.country : "",
							ip_address: data1.data.ip_address? data1.data.ip_address : "",
						}
						let timestamp = new Date().getTime() + ""
						
						database_config.sql = "UPDATE casino_users SET uuid='" + uuid + "' WHERE id=" + users_array[i].id + "; "
						database_config.sql += "INSERT INTO login_history (user_id, login_date, device, ip_address, city, country) VALUES (?, ?, ?, ?, ?, ?)"
						let payload =  [users_array[i].id, timestamp, device, extra_data.ip_address, extra_data.city, extra_data.country]
						database(database_config, payload).then(function(){
							users_array[i].ip_address = extra_data.ip_addres
							users_array[i].city = extra_data.city
							users_array[i].country = extra_data.country
							users_array[i].device = device
							users_array[i].uuid = uuid
							obj = {id: users_array[i].id, uuid: uuid, user: users_array[i].user, email: users_array[i].email, money: users_array[i].money}
							try{
								io.to(socket.id).emit('signin_read', [exists, obj])
							}catch(e){
								console.log('[error]','signin_read1--> ', e)
							}
						})
					})
					break
				} else if((data.user === users_array[i].user || data.user === users_array[i].email) && pass01 !== pass02){
					//the user exists but the password was not correct
					exists = true
					try{
						io.to(socket.id).emit('signin_read', [exists, obj])	
					}catch(e){
						console.log('[error]','signin_read2--> ', e)
					}
					break
				}
			}
			if(!exists){
				try{
					io.to(socket.id).emit('signin_read', [exists, obj])
				}catch(e){
					console.log('[error]','signin_read2--> ', e)
				}
			}
		})
	})
	socket.on('signup_send', function(data) {
		sign_in_up = false
		let device = get_device(socket.request.headers)
		database_config.sql = 'SELECT * FROM casino_users WHERE user = "' + data.user + '" AND email = "' + data.email + '"'
		database(database_config).then(function(result){
			if(result && result.length == 0){
				sign_in_up = true	
				let pass = JSON.stringify(encrypt(data.pass))
				let uuid = crypto.randomBytes(20).toString('hex')

				get_extra_data().then(function(data1) {				
					let extra_data = {
						city: data1.data.city ? data1.data.city : "",
						country: data1.data.country ? data1.data.country : "",
						ip_address: data1.data.ip_address? data1.data.ip_address : "",
					}
					let timestamp = new Date().getTime() + ""

					database_config.sql = "INSERT INTO casino_users (uuid, user, email, pass, account_type, money, signup) VALUES (?, ?, ?, ?, ?, ?, ?)"
					let payload =  [uuid, data.user, data.email, pass, account_type, user_money, timestamp]
					database(database_config, payload).then(function(result){
						let insertId = result.insertId
						database_config.sql = 'INSERT INTO login_history (user_id, login_date, device, ip_address, city, country) VALUES (' + insertId + ', "' + timestamp + '", ' + device + ', "' + extra_data.ip_address + '", "' + extra_data.city + '", "' + extra_data.country + '");'
						database_config.sql += 'SELECT * FROM casino_users;'
						database(database_config).then(function(result){
							users_array = result[1]
							obj = {id: insertId, uuid:uuid, user: data.user, email: data.email, account_type: account_type, money: user_money}
							try{
								io.to(socket.id).emit('signup_read', [false, obj])
							}catch(e){
								console.log('[error]','signup_read1--> ', e)
							}
						})
					})
				})
			} else {
				try{
					// the user already exists
					io.to(socket.id).emit('signup_read', [true, {}])
				}catch(e){
					console.log('[error]','signup_read2--> ', e)
				}
			}
		})
	})

	socket.on('salon_send', function(uuid) {
		if(uuid){
			if(sign_in_up){
				check_user_salon(uuid)
			} else {
				database_config.sql = "SELECT * FROM casino_users; "
				database(database_config).then(function(data){
					users_array = data
					check_user_salon(uuid)
				})
			}
		} else {
			try{				
				io.to(socket.id).emit('salon_read', false)
			}catch(e){
				console.log('[error]','salon_read0--> ', e)
			}
		}		
	})
	function check_user_salon(uuid){
		let user_found = get_user_from_uuid(uuid, users_array)
		if(user_found){				
			let first_enter_salon = false		
			let id = user_found.id
			let user = user_found.user
			let money = user_found.money
			let signup = user_found.signup
			let profile_pic = user_found.profile_pic
			let profiles = constants.SERVER_PROFILES
			let profile_animal = profiles.filter(a => a.id === parseInt(profile_pic))
			let timestamp = new Date().getTime()
			
			database_config.sql = "SELECT * FROM login_history"
			database(database_config).then(function(data){
				let latest =[]
				let logs =[]
				for(let i in data){
					if(data[i].user_id == id){
						latest = data[i]
						logs.push(data[i])			
					}
				}
				let streak = check_streak(logs)

				//check first time player
				if(latest.login_date === signup && (timestamp - parseInt(latest.login_date)/60000 < 0.25)){ 
					first_enter_salon = true
				}				
				
				let career_array = career.CAREER_ARRAY
				let question_array = question.QUESTION_ARRAY
				let server_tables = constants.SERVER_TABLES
				let market = constants.SERVER_MARKET
				let profiles = constants.SERVER_PROFILES
				let contact_details = constants.CONTACT
				let obj = {
					uuid: uuid, 
					first_enter_salon: first_enter_salon, 
					streak: streak,
					user: user, 
					money: money, 
					profile_pic: [profile_pic, profile_animal],				
					profiles: profiles,
					contact: contact_details,
					questions: question_array,
					career: career_array,
					market:market, 
					server_tables: server_tables, 
				}			
				sign_in_up = false	

				try{				
					io.to(socket.id).emit('salon_read', obj)
				}catch(e){
					console.log('[error]','salon_read1--> ', e)
				}
			})
		} else {
			try{
				io.to(socket.id).emit('salon_read', null)
			}catch(e){
				console.log('[error]','user_page_send1--> ', e)
			}
		}
	}

	socket.on('user_page_send', function(data) {
		if(data.uuid){
			let choice = data.choice
			let uuid = data.uuid	
			if(typeof users_array !== "undefined" && users_array !== "null" && users_array !== null && users_array !== ""){
				check_user_page(uuid, choice)
			} else {
				database_config.sql = "SELECT * FROM casino_users"
				database(database_config).then(function(result){						
					users_array = result
					check_user_page(uuid, choice)
				})
			}	
		} else {
			try{
				io.to(socket.id).emit('user_page_read', null)
			}catch(e){
				console.log('[error]','user_page_send1--> ', e)
			}
		}			
	})

	function check_user_page(uuid, choice){
		let user_found = get_user_from_uuid(uuid, users_array)
		if(user_found){
			let id = user_found.id		
			let user = user_found.user	
			socket.user_id = id
			socket.user_uuid = uuid
			socket.user = user

			let room_name = get_room_name({game_choice: choice})
			socket.room_name = room_name

			let exists = false
			for (let i in user_join) {
				if (user_join[i].uuid === uuid) {
					let last_room = user_join[i].room_name
					socket.leave(last_room)
					exists = true
					user_join[i].room_name = room_name
					user_join[i].time = new Date().getTime()
					socket.join(room_name)
					sockets.push(socket)
					break
				}
			}
			if(!exists){
				user_join.push({uuid: uuid, user: user, room_name: room_name, time: new Date().getTime()})	
				socket.join(room_name)
				sockets.push(socket)
			}
			
			try{				
				io.to(socket.id).emit('user_page_read' , true)
			}catch(e){
				console.log('[error]','join room :',e)
			}
		} else {
			try{
				io.to(socket.id).emit('user_page_read', null)
			}catch(e){
				console.log('[error]','user_page_send1--> ', e)
			}
		}
	}

	// other pages
	socket.on('donate_send', function(data){
		let donations = constants.DONATIONS
		try{
			io.to(socket.id).emit('donate_read', donations)	
		}catch(e){
			console.log('[error]','donate_read--> ', e)
		}	
	})
	socket.on('contact_send', function(data){
		let contact_details = constants.CONTACT
		try{
			io.emit('contact_read', contact_details)
		}catch(e){
			console.log('[error]','contact_read--> ', e)
		}
	})
	socket.on('support_send', function(data){
		if(data.lang === "ro"){
			try{
				io.to(socket.id).emit('support_read', "Mesajul a fost trimis")
			}catch(e){
				console.log('[error]','support_send1--> ', e)
			}
		} else {
			try{
				io.to(socket.id).emit('support_read', "Message has been sent")
			}catch(e){
				console.log('[error]','support_send2--> ', e)
			}
		}			
	})

	//chat
	socket.on('chatlist_send', function(data){	
		let room_name = get_room_name(data)
		let list = []
		for(let i in user_join){
			if(user_join[i].room_name == room_name){
				list.push(user_join[i])
			}
		}
		try{
			io.to(room_name).emit('chatlist_read', list)
		}catch(e){
			console.log('[error]','chatlist_read--> ', e)
		}
	})
	socket.on('chat_message_send', function(data){	
		let room_name = get_room_name(data)
		try{
			io.to(room_name).emit('chat_message_read', chatMessage(data.user, data.message))
		}catch(e){
			console.log('[error]','chat_message_read--> ', e)
		}
	})
	socket.on('join_leave_chat_send', function(data){	
		let room_name = data.game_choice
		let user_found = get_user_from_uuid(data.uuid, users_array)
		if(user_found){
			if(data.reason === "leave"){
				for(let i in sockets){
					if(sockets[i].user != user_found.user && sockets[i].room_name != room_name){
						try{
							io.to(room_name).emit('join_leave_chat_read', {from: user_found.user, reason: data.reason})
						}catch(e){
							console.log('[error]','join_leave_chat_read--> ', e)
						}
					}
				}
			} else {
				try{
					io.to(room_name).emit('join_leave_chat_read', {from: user_found.user, reason: data.reason})
				}catch(e){
					console.log('[error]','join_leave_chat_read--> ', e)
				}
			}
		}
	})

	// changes in dashboard
	socket.on('change_username_send', function(data) {
		if(data.uuid){
			let uuid = data.uuid
			let user_new = data.user_new
			let user_found
			for(let i in users_array){
				if(users_array[i].uuid == uuid){
					users_array[i].user = user_new
					user_found = users_array[i]					
					break
				}
			}
			if(user_found){
				database_config.sql = "UPDATE casino_users SET user='" + user_new + "' WHERE id=" + user_found.id + '; '
				database_config.sql += "SELECT * FROM casino_users"
				database(database_config).then(function(){
					try{
						io.to(socket.id).emit('change_username_read', true)
					}catch(e){
						console.log('[error]','change_username_read--> ', e)
					}
				})
			}
		}
	})
	socket.on('change_password_send', function(data) {
		if(data.uuid){
			let uuid = data.uuid
			let pass_old = data.pass_old
			let pass_new = data.pass_new
			let new_pass_encrypt = JSON.stringify(encrypt(pass_new))
			let user_found
			for(let i in users_array){
				if(users_array[i].uuid == uuid){
					let pass = decrypt(JSON.parse(users_array[i].pass))
					if(pass_old == pass){
						users_array[i].pass = new_pass_encrypt
						user_found = users_array[i]	
						break
					}
				}
			}
			if(user_found){
				database_config.sql = "UPDATE casino_users SET pass='" + new_pass_encrypt + "' WHERE id=" + user_found.id + '; '
				database_config.sql += "SELECT * FROM casino_users"
				database(database_config).then(function(){
					try{
						io.to(socket.id).emit('change_password_read', true)
					}catch(e){
						console.log('[error]','change_password_read--> ', e)
					}
				})
			}
		}
	})
	socket.on('change_pic_send', function(data) {
		if(data.uuid){
			let uuid = data.uuid
			let pic = data.pic	
			let user_found
			for(let i in users_array){
				if(users_array[i].uuid == uuid){
					users_array[i].profile_pic = pic
					user_found = users_array[i]	
					break
				}
			}
			if(user_found){
				database_config.sql = "UPDATE casino_users SET profile_pic='" + pic + "' WHERE id=" + user_found.id
				database(database_config).then(function(){
					try{
						io.to(socket.id).emit('change_pic_read', true)
					}catch(e){
						console.log('[error]','change_pic_read--> ', e)
					}
				})
			}
		}
	})

	// games
	socket.on('roulette_spin_send', function(data) {
		if(data.uuid && data.spin_click === 1){
			let payload = roulette(data, how_lucky)
			let room_name = get_room_name(data)
			try{
				io.to(room_name).emit('roulette_spin_read', payload)
			} catch(e){
				console.log('[error]','roulette_spin_read--> ', e)
			}
		}
	})	
	socket.on('blackjack_get_users_send', function(data) {
		if(data.uuid){
			let room_name = get_room_name(data)
			try{
				io.to(room_name).emit('blackjack_get_users_read', user_join)
			} catch(e){
				console.log('[error]','blackjack_get_users_read--> ', e)
			}
		}
	})	
	socket.on('blackjack_send', function(data) {
		if(data[1].uuid){
			let payload = blackjack(data, how_lucky, user_join)
			let room_name = get_room_name(data[1])
			try{
				io.to(room_name).emit('blackjack_read', payload)		
			} catch(e){
				console.log('[error]','blackjack_read--> ', e)
			}	
		}
	})
	socket.on('slots_send', function(data) {
		if(data.uuid){
			let payload = slots(data, how_lucky, user_join, sockets)
			try{
				io.to(socket.id).emit('slots_read', payload)				
			} catch(e){
				console.log('[error]','slots_read--> ', e)
			}
		}
	})
	socket.on('craps_send', function(data) {
		if(data.uuid){
			let room_name = get_room_name(data)
			let payload = craps(data, how_lucky)		
			try{
				io.to(room_name).emit('craps_read', payload)				
			} catch(e){
				console.log('[error]','craps_read--> ', e)
			}
		}
	})
	socket.on('race_board_send', function(data) {
		if(data.uuid){
			let payload = race(data, user_join)
			try{
				io.to(socket.id).emit('race_board_read', payload)		
			} catch(e){
				console.log('[error]','race_board_read--> ', e)
			}
		}
	})
	socket.on('keno_send', function(data) {
		if(data === "winnings"){
			let keno_winnings = [
				[1, 1, 2], [2, 2, 10], [3, 3, 25], [3, 2, 2], [4, 4, 50], [4, 3, 5], [4, 2, 1], [5, 5, 500], [5, 4, 15], [5, 3, 2], [6, 6, 1500], [6, 5, 50], [6, 4, 5], [6, 3, 1], [7, 7, 5000], [7, 6, 150], [7, 5, 15], [7, 4, 2], [7, 3, 1], [8, 8, 15000], [8, 7, 400], [8, 6, 50], [8, 5, 10], [8, 4, 2], [9, 9, 25000], [9, 8, 2,500], [9, 7, 200], [9, 6, 25], [9, 5, 4], [9, 4, 1], [10, 10, 200000], [10, 9, 10000], [10, 8, 500], [10, 7, 50], [10, 6, 10], [10, 5, 3], [10, 4, 2], 
			]
			io.to(socket.id).emit('keno_read', keno_winnings)
		} else {
			let payload = keno(data, how_lucky, user_join)
			try{
				io.to(socket.id).emit('keno_read', payload)
			} catch(e){
				console.log('[error]','race_board_read--> ', e)
			}
		}
	})

	// result info after a game
	socket.on('results_send', function(data) {
		let uuid = data.user_uuid
		let game_name = data.game_choice.table_name ? data.game_choice.table_name : data.game_choice
		let game_id = data.game_choice.table_id ? data.game_choice.table_id : game_name
		let game_type = data.game_choice.table_type ? data.game_choice.table_type : game_name
		let money = data.money
		let status = data.status
		let bet = Math.abs(data.bet)
		if(uuid){
			let user_found
			for(let i in users_array){
				if(users_array[i].uuid == uuid){
					users_array[i].money = money
					user_found = users_array[i]										
					break
				}
			}
			if(user_found){
				let id = user_found.id
				database_config.sql = "UPDATE casino_users SET money="+money+" WHERE id="+id
				database(database_config).then(function(data){
					let timestamp = new Date().getTime()
					database_config.sql = 'INSERT INTO history_users (user_id, game_name, game_id, game_type, date, status, sum) '
					database_config.sql += ' VALUES ('
					database_config.sql += id + ', '
					database_config.sql += '"' + game_name + '", '
					database_config.sql += '"' + game_id + '", '
					database_config.sql += '"' + game_type + '", '
					database_config.sql += '"' + timestamp + '", '
					database_config.sql += '"' + status + '", '
					database_config.sql += bet
					database_config.sql += ')'		
					database(database_config).then(function(){})
				})
			}
		}
	})

	// other
	socket.on('disconnect', function(reason) {		
		let k = sockets.indexOf(socket)
		console.log('disconnect111', k, socket.room_name)
		if(k !== -1){
			if(typeof user_join[k] !== "undefined"){
				if(typeof user_join[k].user !== "undefined"){
					console.log('disconnect222 ', reason, k, user_join[k], socket.room_name)
				}
			}			
		}
    })
	socket.on('disconnecting', function(reason) {
		let k = sockets.indexOf(socket)
		console.log('disconnecting111', k, socket.room_name)
		if(k !== -1){
			if(typeof user_join[k] !== "undefined"){
				if(typeof user_join[k].user !== "undefined"){
					console.log('disconnecting222 ', reason, k, user_join[k], socket.room_name)
				}
			}
		}
    })
	socket.on("connect_error", function(err){
		console.log('connect_error --> ', err)
		socket.emit("error", "Connect error")
	})
	socket.on("connect_failed", function(err){
		console.log('connect_failed --> ', err)
		socket.emit("error", "Connect failed")
	})
	socket.on("error", function(err){
		console.log('error --> ', err)
		socket.emit("error", "Something bad happened")
	})
	socket.on('heartbeat', function(data) {
		console.log('heartbeat', data)
	})
})

http.listen(port, () => console.log("Server started on port " + app.get("port") + " on dirname " + __dirname))