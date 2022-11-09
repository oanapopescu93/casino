var express = require("express")
const app = express()

var http = require('http').createServer(app)
var io = require('socket.io')(http,{
    pingInterval: 10000,
    pingTimeout: 5000,
})
const port = process.env.PORT || 5000
app.set("port", port)

const fs = require('fs')
const { encrypt, decrypt } = require('./utils/crypto')

var constants = require('./var/constants')
var career = require('./var/career')
var question = require('./var/questions')
var routes = require("./routes")

const crypto = require('crypto')

const { roulette } = require("./server_games/roulette")
const { blackjack } = require("./server_games/blackjack")
const { slots } = require("./server_games/slots")
const { craps } = require("./server_games/craps")
const { race } = require("./server_games/race")
const { keno } = require("./server_games/keno")
const { get_room_name, get_user_from_uuid, get_device, check_streak, chatMessage, get_extra_data } = require("./utils/other")

var user_join = []
var default_money = 100
var account_type = 1

var sockets = []
let how_lucky = 7
let cleanDays = 10 // each 10 days I will clean all the jsons

app.use(routes)

function cleanJsons() {
	let payload = JSON.stringify([])
	fs.writeFileSync('./json/history_user.json', payload)
	fs.writeFileSync('./json/login_user.json', payload)
}
setInterval(cleanJsons, cleanDays * 86400000)

io.on('connection', function(socket) {
	socket.on('signin_send', function(data) {
		let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))
        let login_user = JSON.parse(fs.readFileSync('./json/login_user.json', 'utf8'))
		let uuid = crypto.randomBytes(20).toString('hex')
		let device = get_device(socket.request.headers)
		let exists = false
        let obj = {}
		let pass01 = data.pass

        for(let i in users_json){
            let pass02 = decrypt(JSON.parse(users_json[i].pass))
            if((data.user === users_json[i].user || data.user === users_json[i].email) && pass01 === pass02){
                //the user exists and the password was correct
                exists = true
                obj = {id: users_json[i].id, uuid: uuid, user: users_json[i].user, email: users_json[i].email, money: users_json[i].money}
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
            io.to(socket.id).emit('signin_read', [exists, obj])
        }catch(e){
            console.log('[error]','signin_read2 :', e)
        }
	})
	socket.on('signup_send', function(data){
        let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))
        let login_user = JSON.parse(fs.readFileSync('./json/login_user.json', 'utf8'))
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
                let pass = JSON.stringify(encrypt(data.pass))
                let uuid = crypto.randomBytes(20).toString('hex')

                get_extra_data().then(function(data1) {				
                    let extra_data = {
                        city: data1.data.city ? data1.data.city : "",
                        country: data1.data.country ? data1.data.country : "",
                        ip_address: data1.data.ip_address? data1.data.ip_address : "",
                    }
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

                        let obj = {id: id, uuid:uuid, user: data.user, email: data.email, account_type: account_type, money: default_money}
                        try{
                            io.to(socket.id).emit('signup_read', [false, obj])
                        }catch(e){
                            console.log('[error]','signup_read1 :', e)
                        }
                    }
                })
            } else {
                try{
					// the user already exists
					io.to(socket.id).emit('signup_read', [true, {}])
				}catch(e){
					console.log('[error]','signup_read2 :', e)
				}
            }
        }
	})

	socket.on('salon_send', function(uuid){
		if(uuid){
			let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8')) 
            let user_found = get_user_from_uuid(uuid, users_json)

            if(user_found){
				let first_enter_salon = false		
                let id = user_found.id
                let user = user_found.user
                let money = user_found.money
                let signup = user_found.signup
				let account_type = user_found.account_type
                let timestamp = new Date().getTime()
				let profile_pic = user_found.profile_pic
				let profiles = constants.SERVER_PROFILES
				let profile_animal = profiles.filter(a => a.id === parseInt(profile_pic))
                
                let login_user = JSON.parse(fs.readFileSync('./json/login_user.json', 'utf8'))                
                let latest = null
                for(let i in login_user){
                    if(login_user[i].user_id == id){
                        latest = login_user[i]
                    }
                }
                if(latest){
                    //check first time player
                    if(latest.login_date === signup && (timestamp - parseInt(latest.login_date))/60000 < 0.25){ 
                        first_enter_salon = true
                    }
                }

				let career_array = career.CAREER_ARRAY
				let question_array = question.QUESTION_ARRAY
				let server_tables = constants.SERVER_TABLES
				let market = constants.SERVER_MARKET
				let contact_details = constants.CONTACT
				let streak = check_streak(login_user)

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
					account_type: account_type
				}
				try{				
					io.to(socket.id).emit('salon_read', obj)
				}catch(e){
					console.log('[error]','salon_read1 :', e)
				}
			}
		} else {
			try{				
				io.to(socket.id).emit('salon_read', false)
			}catch(e){
				console.log('[error]','salon_read0--> ', e)
			}
		}		
	})

	socket.on('user_page_send', function(data){
		if(data.uuid){
			let choice = data.choice
			let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8')) 
			let uuid = data.uuid
            let user_found = get_user_from_uuid(uuid, users_json)
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
		} else {
			try{
				io.to(socket.id).emit('user_page_read', null)
			}catch(e){
				console.log('[error]','user_page_send1--> ', e)
			}
		}			
	})

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
		let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8')) 
		let user_found = get_user_from_uuid(data.uuid, users_json)
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
	socket.on('change_pic_send', function(data) {
		let uuid = data.uuid
		let pic = data.pic	
        let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))

        for(let i in users_json){
            if(users_json[i].uuid == uuid){
				users_json[i].profile_pic = pic
				break
			}
        }

        let payload = JSON.stringify(users_json)
        fs.writeFileSync('./json/casino_user.json', payload)
	})
	socket.on('change_username_send', function(data) {
		let uuid = data.uuid
		let user_new = data.user_new
        let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))
        
        for(let i in users_json){
            if(users_json[i].uuid == uuid){
                users_json[i].user = user_new
                break
            }
        }			

        let payload = JSON.stringify(users_json)
        fs.writeFileSync('./json/casino_user.json', payload)
	})
	socket.on('change_password_send', function(data) {
		let uuid = data.uuid
		let pass_old = data.pass_old
		let pass_new = data.pass_new
        let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8'))

        for(let i in users_json){
            if(users_json[i].uuid == uuid){
				let pass = decrypt(JSON.parse(users_json[i].pass))
				if(pass_old == pass){
					users_json[i].pass = JSON.stringify(encrypt(pass_new))
					break
				}
			}
        }
        let payload = JSON.stringify(users_json)
        fs.writeFileSync('./json/casino_user.json', payload)
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

	// result infos after a game
	socket.on('results_send', function(data) {
		if(data.user_uuid){
			let users_json = JSON.parse(fs.readFileSync('./json/casino_user.json', 'utf8')) 			
			let uuid = data.user_uuid
			let game_name = data.game_choice.table_name ? data.game_choice.table_name : data.game_choice
			let game_id = data.game_choice.table_id ? data.game_choice.table_id : game_name
			let game_type = data.game_choice.table_type ? data.game_choice.table_type : game_name
			let money = data.money
			let status = data.status
			let bet = Math.abs(data.bet)
			let timestamp = new Date().getTime()

			// update money
			let user_found
			for(let i in users_json){
				if(users_json[i].uuid == uuid){
					user_found = users_json[i]	
                    users_json[i].money = money									
					break
				}
			}
			let payload = JSON.stringify(users_json)
        	fs.writeFileSync('./json/casino_user.json', payload)

			// history_users
			let history_user = JSON.parse(fs.readFileSync('./json/history_user.json', 'utf8')) 
            let history_id = 0
            if(history_user && history_user.length > 0){
                history_id = history_user.length-1
            }
            let new_history = {
                id: history_id,
                user_id: user_found.id,
                date: timestamp,
                game_name: game_name,
                game_id : game_id,
                game_type: game_type,
                status: status,
                sum: bet,
            }
            history_user.push(new_history)
                
            payload = JSON.stringify(history_user)
            fs.writeFileSync('./json/login_user.json', payload) 
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