const express = require("express")
const PORT = process.env.PORT || 1111
const app = express()

var http = require('http').createServer(app)
var io = require('socket.io')(http)

var routes = require("./routes")
app.use(routes) 
var stripePayment = require("./payments/stripePayment")
app.use(stripePayment)
var paypalPayment = require("./payments/paypalPayment")
app.use(paypalPayment) 
var cryptoPayment = require("./payments/cryptoPayment")
app.use(cryptoPayment) 

const path = require("path")
const fs = require('fs')

const { encrypt, decrypt } = require('./utils/crypto')
const { get_device, get_extra_data, sendEmail, check_streak} = require("./utils/other")
const crypto = require('crypto')
const stripe = require('stripe')("sk_test_51Mdvu1CWq9uV6YuM2iH4wZdBXlSMfexDymB6hHwpmH3J9Dm7owHNBhq4l4wawzFV9dXL3xrYGbhO74oc8OeQn5uJ00It2XDg9U")

const { roulette } = require("./games/roulette")
const { blackjack } = require("./games/blackjack")
const { slots } = require("./games/slots")
const { craps } = require("./games/craps")
const { race } = require("./games/race")
const { keno } = require("./games/keno")
const { poker } = require("./games/poker")

var coupons = require('./var/home').COUPONS

const account_type = 1
const profile_pic = 0
const user_money = 100
const how_lucky = 7

var users_array = null
var login_user = null
var chatroom_users = []

const database = require('./database/mysql')
var constants = require('./var/constants')
var database_config = constants.DATABASE[0]

io.on('connection', function(socket) {
  socket.on('signin_send', (data) => {  
    database_config.sql = "SELECT * FROM casino_user;"
    database_config.sql += "SELECT * FROM login_user;"
    database_config.name = "db01"
		database(database_config).then(function(result){
      if(result && result[0] && result[1]){
        users_array = result[0] 
        login_user = result[1]
        let user_found = users_array.filter(function(x){
          return (x.user === data.user || x.email === data.email) && decrypt(JSON.parse(x.pass)) === data.pass
        })
        if(user_found && user_found.length>0){
          //the user exists --> we sign him in
          let uuid = crypto.randomBytes(20).toString('hex')
          let device = get_device(socket.request.headers) // 0 = computer, 1 = mobile, 2 = other

          let logs = login_user.filter((x) => {
            let date01 = new Date().setHours(0, 0, 0, 0)
            let date02 = new Date(parseInt(x.login_date)).setHours(0, 0, 0, 0)
            return x.user_id === user_found[0].id && date01 === date02
          })   
  
          //emit
          let obj = {
            uuid, 
            user: user_found[0].user, 
            email: user_found[0].email, 
            account_type: user_found[0].account_type, 
            money: user_found[0].money, 
            device,
            profile_pic: user_found[0].profile_pic,
            logs: logs.length
          }
          try{
            io.to(socket.id).emit('signin_read', {exists: true, obj: obj})
          } catch(e){
            console.log('[error]','signin_read :', e)
          }
  
          get_extra_data().then(function(res) {          
            let extra_data = {}
            if(res && res.data){
              extra_data = {
                city: res.data.city ? res.data.city : "",
                country: res.data.country_name ? res.data.country_name : "",
                ip_address: res.data.ip? res.data.ip : "",
              }            
            }   				
            let timestamp = new Date().getTime() + ""
            
            //update user and login tables
            database_config.sql = "UPDATE casino_user SET uuid='" + uuid + "' WHERE id=" + user_found[0].id + "; "
						database_config.sql += "INSERT INTO login_user (user_id, login_date, device, ip_address, city, country) VALUES (?, ?, ?, ?, ?, ?)"
						let payload =  [user_found[0].id, timestamp, device, extra_data.ip_address, extra_data.city, extra_data.country]
						database(database_config, payload).then(function(){})
          })
        } else {
          //the user doesn't exist
          try{
            io.to(socket.id).emit('signin_read', {exists: false, obj: {}})
          }catch(e){
            console.log('[error]','signin_read2--> ', e)
          }
        }
      } else {
          try{
            io.to(socket.id).emit('signin_read', {exists: false, obj: {}})
          }catch(e){
            console.log('[error]','signin_read2--> ', e)
          }
      }
    }) 
  })
  socket.on('signup_send', (data) => {  
    database_config.sql = 'SELECT * FROM casino_user WHERE user = "' + data.user + '" AND email = "' + data.email + '"'
    database_config.name = "db02"
		database(database_config).then(function(result){
      if(result && result.length == 0){
        //no user was found --> new user --> he must sign up
        users_array = result
        login_user = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./json/login.json")))
        let uuid = crypto.randomBytes(20).toString('hex')
        let device = get_device(socket.request.headers) // 0 = computer, 1 = mobile, 2 = other
  
        //emit
        let obj = {
          uuid: uuid, 
          user: data.user, 
          email: data.email, 
          account_type: account_type, 
          money: user_money, 
          device: device,
          profile_pic: profile_pic
        }
        try{
          io.to(socket.id).emit('signup_read', {exists: false, obj: obj})
        } catch(e){
          console.log('[error]','signup_read :', e)
        } 
  
        get_extra_data().then(function(res) {  
          let extra_data = extra_data = {city: "", country: "", ip_address: ""} 
          if(res && res.data){
            extra_data = {
              city: res.data.city ? res.data.city : "",
              country: res.data.country_name ? res.data.country_name : "",
              ip_address: res.data.ip? res.data.ip : "",
            }            
          }  
          let timestamp = new Date().getTime() + ""   
          let pass = JSON.stringify(encrypt(data.pass))   

          //insert new user in users and login tables
          database_config.sql = "INSERT INTO casino_user (uuid, user, email, pass, account_type, money, signup) VALUES (?, ?, ?, ?, ?, ?, ?)"
					let payload = [uuid, data.user, data.email, pass, account_type, user_money, timestamp] 
          database_config.name = "db03"
          database(database_config, payload).then(function(result){
						let insertId = result.insertId
            database_config.sql = 'INSERT INTO login_user (user_id, login_date, device, ip_address, city, country) VALUES (' + insertId + ', "' + timestamp + '", ' + device + ', "' + extra_data.ip_address + '", "' + extra_data.city + '", "' + extra_data.country + '");'
            database_config.name = "db04"
            database(database_config).then(function(result){})
          })                           
        })
      } else {
        //the user already exists --> old user --> he must sign in
        try{
          io.emit('signup_read', {exists: false, obj: {}})
        } catch(e){
          console.log('[error]','signup_read :', e)
        }
      }  
    }) 
  })
  socket.on('forgotPassword_send', (data) => {    
    database_config.sql = "SELECT * FROM casino_user"
    database_config.name = "db05"
		database(database_config).then(function(result){
      if(result && result.length>0){
        users_array = result
        let user = users_array.filter(function(x){
          return x.email === data.email
        })
        if(user && user.length>0){
          sendEmail(user, data).then(function(res){
            try{
              io.to(socket.id).emit('forgotPassword_read', res)
            }catch(e){
              console.log('[error]','forgotPassword_read2--> ', e)
            }
          }) 
        } else {
          try{
            io.to(socket.id).emit('forgotPassword_read', {send: "no_user"})
          } catch(e){
            console.log('[error]','forgotPassword_read3--> ', e)
          }
        }
      } else {
        try{
          io.to(socket.id).emit('forgotPassword_read', {send: "no_user"})
        } catch(e){
          console.log('[error]','forgotPassword_read3--> ', e)
        }
      }
    })
  })

  // GAMES
  socket.on('game_send', function(data){
		if(data.uuid){
      database_config.sql = "SELECT * FROM casino_user;"
      database_config.sql += "SELECT * FROM login_user;"
      database_config.name = "db06"
      database(database_config).then(function(result){     
        let payload = {streak: 1, prize: 0}
        if(result){
          users_array = result[0]
          login_user = result[1]
          if(users_array && users_array.length>0 && login_user && login_user.length>0){            
            try{
              let user_found = users_array.filter((x) => x.uuid === data.uuid) 
              payload = updateStreak(user_found, login_user)        
              io.to(socket.id).emit('game_read', payload)
              updateMoney(user_found, payload)
            } catch(e){
              console.log('[error]','roulette_read--> ', e)
            }            
          }
        }
      })
    }
	})
  function updateStreak(user_found, login_user){
    let streak = 1
    if(user_found[0]){
      let logs = login_user.filter((x) => x.user_id === user_found[0].id)   
      streak = check_streak(logs)
    }
    let prize = 0
    if(streak>0){
      if(streak % 10 === 0){ //each 10 days the user gets a bigger prize
        prize = 10
      } else {
        prize = 1
      }
    }
    return {streak, prize}
  }
  function updateMoney(user_found, payload){
    if(user_found[0]){            
      database_config.sql = "UPDATE casino_user SET money="+payload.prize+" WHERE id="+user_found[0].id
      database_config.name = "db07"
      database(database_config).then(function(data){
        let table_name = 'streak_prize'
        let game_id = 'streak_prize'
        let game_type = 'streak_prize'
        let status = 1
        let timestamp = new Date().getTime()

        database_config.sql = 'INSERT INTO history_user (user_id, game_name, game_id, game_type, date, status, sum) '
        database_config.sql += ' VALUES ('
        database_config.sql += user_found[0].id + ', '
        database_config.sql += '"' + table_name + '", '
        database_config.sql += '"' + game_id + '", '
        database_config.sql += '"' + game_type + '", '
        database_config.sql += '"' + timestamp + '", '
        database_config.sql += '"' + status + '", '
        database_config.sql += payload.prize
        database_config.sql += ')'
        database_config.name = "db08"
        database(database_config).then(function(){})
      })
    }
  }

	socket.on('roulette_send', function(data){
		if(data.uuid){
      let room = data.room
			let payload = roulette(data, how_lucky)
			try{
				io.to(room).emit('roulette_read', payload)
			} catch(e){
				console.log('[error]','roulette_read--> ', e)
			}
		}
	})
  socket.on('blackjack_send', function(data){
		if(data.uuid){
      let room = data.room
      let payload = blackjack(data, chatroom_users)
			try{
				io.to(room).emit('blackjack_read', payload)
			} catch(e){
				console.log('[error]','roulette_read--> ', e)
			}
		}
	})
  socket.on('poker_send', function(data){
		if(data.uuid){
      let room = data.room
      let payload = poker(data, chatroom_users)
			try{
				io.to(room).emit('poker_read', payload)
			} catch(e){
				console.log('[error]','roulette_read--> ', e)
			}
		}
	})
  socket.on('slots_send', function(data){    
		if(data.uuid){
      let room = data.room
			let payload = slots(data)
			try{
				io.to(room).emit('slots_read', payload)
			} catch(e){
				console.log('[error]','slots_read--> ', e)
			}
		}
	})
  socket.on('craps_send', function(data){
		if(data.uuid){
      let room = data.room
			let payload = craps(data, how_lucky)
			try{
				io.to(room).emit('craps_read', payload)
			} catch(e){
				console.log('[error]','craps_read--> ', e)
			}
		}
	})
  socket.on('race_send', function(data){
		if(data.uuid){
			let payload = race(data, how_lucky)
			try{
        io.emit('race_read', payload)
			} catch(e){
				console.log('[error]','race_read--> ', e)
			}
		}
	})
  socket.on('keno_send', function(data){
		if(data.uuid){
			let payload = keno(data, how_lucky)
			try{
        io.emit('keno_read', payload)
			} catch(e){
				console.log('[error]','keno_read--> ', e)
			}
		}
	})

  socket.on('game_results_send', function(data){
    if(data.uuid){
      database_config.sql = "SELECT * FROM casino_user;"
      database_config.name = "db09"
      database(database_config).then(function(result){
        if(result && result.length>0){
          users_array = result
          let user_found = users_array.filter((x) => x.uuid === data.uuid)  
          if(user_found && user_found.length>0){
            let table_name = data.game.table_name ? data.game.table_name : ""
            let table_id = data.game.table_id ? data.game.table_id : table_name
            let table_type = data.game.table_type ? data.game.table_type : table_name
            let status = data.status == "win" ? 1 : 0 
            let timestamp = new Date().getTime()
            database_config.sql = "UPDATE casino_user SET money='" + data.money + "' WHERE id=" + data.uuid + '; '
            database_config.sql = 'INSERT INTO history_user (user_id, game_name, game_id, game_type, date, status, sum) '
            database_config.sql += ' VALUES ('
            database_config.sql += user_found[0].id + ', '
            database_config.sql += '"' + table_name + '", '
            database_config.sql += '"' + table_id + '", '
            database_config.sql += '"' + table_type + '", '
            database_config.sql += '"' + timestamp + '", '
            database_config.sql += '"' + status + '", '
            database_config.sql += data.bet
            database_config.sql += ')'
          }
        }
      })
    } 
	})

  // DASHBOARD, CART, CHECKOUT
  socket.on('dashboardChanges_send', function(data){
    if(data.uuid){
        switch(data.type) {
          case "pic":            
            database_config.sql = "UPDATE casino_user SET profile_pic='" + data.value + "' WHERE id=" + data.uuid + '; '
            break
          case "user":
            database_config.sql = "UPDATE casino_user SET user='" + data.value + "' WHERE id=" + data.uuid + '; '
            break
          case "pass":
            let new_pass = JSON.stringify(encrypt(data.value))
            database_config.sql = "UPDATE casino_user SET pass='" + new_pass + "' WHERE id=" + data.uuid + '; '
            break
        }
        database_config.name = "db010"
        database(database_config).then(function(){})
    }   
  })  
  socket.on('promo_send', function(text){
    let coupon = {}
    for(let i in coupons){
      if(coupons[i].name === text){
        coupon = coupons[i]
        break
      }
    }
    try{				
      io.to(socket.id).emit('promo_read', coupon)
    }catch(e){
      console.log('[error]','homepage_read--> ', e)
    }
  })

  // CHATROOM
  socket.on('join_room', function(data){
    let room = data.room
    console.log('join_room ', room)
    socket.join(data.room)

    let timestamp = new Date().getTime()
    let message = {text: 'join', timestamp: timestamp, user: data.user} 
    
    let index = chatroom_users.findIndex((x) => x.uuid === data.uuid)
    if(index === -1){
      //new user in the room
      chatroom_users.push({uuid: data.uuid, user: data.user, room: room, timestamp: timestamp})
    } else {
      //the user exists and he just changed rooms
      chatroom_users[index].room = room
      chatroom_users[index].timestamp = timestamp
    }

    try{
      io.to(room).emit('message_read', message)
      io.to(room).emit('chatroom_users_read', chatroom_users)
    } catch(e){
      console.log('[error]','message_read--> ', e)
    }
  })
  socket.on('leave_room', function(data){
    let room = data.room
    console.log('leave_room ', room)
    socket.leave(room)
    let timestamp = new Date().getTime()
    let message = {text: 'leave', timestamp: timestamp, user: data.user}
    
    let new_chatroom_users = chatroom_users.filter((x) => x.uuid !== data.uuid)
    chatroom_users = new_chatroom_users

    try{
      io.to(room).emit('message_read', message)
      io.to(room).emit('chatroom_users_read', chatroom_users)
    } catch(e){
      console.log('[error]','message_read--> ', e)
    }
  })
  socket.on('message_send', function(data){
    let room = data.room
    console.log('message_send ', room)
    let timestamp = new Date().getTime()
    let message = {text: data.text, timestamp: timestamp, user: data.user}
		try{
      io.to(room).emit('message_read', message)
    } catch(e){
      console.log('[error]','message_read--> ', e)
    }
	}) 

  socket.on('heartbeat', function(data) {
		console.log('heartbeat', data)
	})
  socket.on('disconnect', function() {  
    console.log('Got disconnect!')
  })
})

http.listen(PORT, () => {console.log(`Server listening on ${PORT}`)})