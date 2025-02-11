const express = require("express")
const app = express()
const bodyParser = require('body-parser')

var http = require('http').createServer(app)
var io = require('socket.io')(http)

app.use(bodyParser.json({ limit: '50mb' })); // Allow JSON bodies up to 50MB
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' })); // Allow URL-encoded bodies up to 50MB

const dotenv = require('dotenv')
const path = require('path')
var NODE_ENV = (process.env.NODE_ENV || 'development').trim() 
dotenv.config({
  path: path.resolve(__dirname, `.env.${NODE_ENV}`)
})

const PORT = process.env.PORT || 1111

var routes = require("./routes")
app.use(routes) 
var stripePayment = require("./payments/stripePayment")
app.use(stripePayment)
var paypalPayment = require("./payments/paypalPayment")
app.use(paypalPayment) 
var googlePayment = require("./payments/googlePayment")
app.use(googlePayment)
var withdrawPayment = require("./payments/withdrawPayment")
app.use(withdrawPayment)

const { encrypt, decrypt } = require('./utils/crypto')
const { get_device, get_extra_data, check_streak } = require("./utils/other")
const { sendEmail, sendVerificationEmail } = require("./utils/mail")
const crypto = require('crypto')

const { roulette } = require("./games/roulette")
const { blackjack } = require("./games/blackjack")
const { slots } = require("./games/slots")
const { craps } = require("./games/craps")
const { race } = require("./games/race")
const { keno } = require("./games/keno")
const { poker } = require("./games/poker")
const { baccarat } = require("./games/baccarat")

var coupons = require('./var/home').COUPONS

const account_type = 1
const user_money = 100
const how_lucky = 7

var users_array = null
var login_array = null
var chatroom_users = []

const database = require('./database/mysql')
var constants = require('./var/constants')
var database_config = constants.DATABASE[0]

// database_config.sql = "SELECT * FROM casino_user;"
// database(database_config).then((result)=>{  
//   if(result){
//     let user_found = result.filter((x)=>{
//       return x.email === "oanapopescu93@gmail.com"
//     })    
//     if(user_found[0]){
//       console.log('user_found ',  user_found[0], decrypt(JSON.parse(user_found[0].pass)))
//     }
//   }  
// })

io.on('connection', (socket)=>{
  socket.on('signin_send', (data) => {
    const { email, pass } = data

    database_config.sql = "SELECT * FROM casino_user; "
    database_config.sql += "SELECT * FROM login_user;"
    database_config.name = "db01"
		database(database_config).then((result)=>{
      if(result && result[0] && result[1]){
        users_array = result[0] 
        login_array = result[1]
        let user_found = users_array.filter((x)=>{
          return x.email === email && decrypt(JSON.parse(x.pass)) === pass
        })
        if(user_found && user_found.length>0){
          //the user exists

          let id = user_found[0].id

          let login_found = login_array.filter((x)=>{
            return x.user_id === id //get all the logins from that user
          })

          let uuid = crypto.randomBytes(20).toString('hex')
          let device = get_device(socket.request.headers) // 0 = computer, 1 = mobile, 2 = other

          let logs = login_found.filter((x) => {
            let date01 = new Date().setHours(0, 0, 0, 0)
            let date02 = new Date(parseInt(x.login_date)).setHours(0, 0, 0, 0)
            return x.user_id === id && date01 === date02
          })

          //emit
          let obj = {
            uuid, 
            user: user_found[0].user, 
            email: user_found[0].email, 
            phone: user_found[0].phone, 
            account_type: user_found[0].account_type, 
            money: user_found[0].money, 
            device,
            profile_pic: user_found[0].profile_pic,
            logs: logs && logs.length ? parseInt(logs.length) : 0,
            logsTotal: login_found && login_found.length ? parseInt(login_found.length) : 0 ,
          }

          if(user_found[0].is_verified === 1){
            // is verified --> we sign him in
            try{
              io.to(socket.id).emit('signin_read', {success: true, exists: true, is_verified: true, obj: obj})
            } catch(e){
              console.log('[error]','signin_read :', e)
            }
  
            get_extra_data().then((res)=>{
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
              database_config.name = "db02"
              let payload = [user_found[0].id, timestamp, device, extra_data.ip_address, extra_data.city, extra_data.country]
              database(database_config, payload).then(()=>{})
            })
          } else {
            //is NOT verified --> we send him a message to go to his mail
            
            try{
              io.to(socket.id).emit('signin_read', {success: false, exists: true, is_verified: false, obj, details: 'token_is_not_verified'})
            } catch(e){
              console.log('[error]','signin_read :', e)
            }
          }
          
        } else {
          //the user doesn't exist
          try{
            io.to(socket.id).emit('signin_read', {success: false, exists: false, obj: {}, details: 'no_user'})
          }catch(e){
            console.log('[error]','signin_read2--> ', e)
          }
        }
      } else {
          try{
            io.to(socket.id).emit('signin_read', {success: false, exists: false, obj: {}, details: 'signin_error'})
          }catch(e){
            console.log('[error]','signin_read2--> ', e)
          }
      }
    }) 
  })
  socket.on('signup_send', (data) => {
    const { user, pass, email, phone, lang } = data
    database_config.sql = 'SELECT * FROM casino_user WHERE email = ?'
    database_config.name = "db03"

		database(database_config, [email]).then((result)=>{
      if(result && result.length == 0){
        //no user was found --> new user --> he must sign up
        users_array = result
        let verificationToken = crypto.randomBytes(20).toString('hex') // Generate a unique verification token

        sendVerificationEmail(email, lang, verificationToken).then((res)=>{
          if(res && res.success_mail){
            try{
              io.to(socket.id).emit('signup_read', {
                ...res,
                exists: false, 
                validate: false, 
                email,
                phone
              })
            } catch(e){
              console.log('[error]','signup_read :', e)
            } 

            get_extra_data().then((res)=>{
              let uuid = crypto.randomBytes(20).toString('hex') 
              if(res && res.data){
                extra_data = {
                  city: res.data.city ? res.data.city : "",
                  country: res.data.country_name ? res.data.country_name : "",
                  ip_address: res.data.ip? res.data.ip : "",
                }
              }
              let timestamp = new Date().getTime() + ""
              let pass_encrypt = JSON.stringify(encrypt(pass))
    
              //insert new user in users and login tables
              database_config.sql = "INSERT INTO casino_user (uuid, user, email, phone, pass, account_type, money, signup, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
              let payload = [uuid, user, email, phone, pass_encrypt, account_type, user_money, timestamp, verificationToken] 
              database_config.name = "db04"
              database(database_config, payload).then(()=>{})
            })
          } else {
            // if the verification email, for some reaon, had a problem. If not, we more foreward.
            try{
              io.to(socket.id).emit('signup_read', {
                ...res, 
                exists: false, 
                validate: false, 
                email,
              })
            } catch(e){
              console.log('[error]','signup_read :', e)
            }
          }
        })
      } else {
        // user tries to signup with an existing email --> we send him to login
        try{
          io.to(socket.id).emit('signup_read', {
            exists: true, 
            validate: true, 
            details: "email_in_use", 
            email,
          })
        } catch(e){
          console.log('[error]','signup_read :', e)
        }
      }
    }) 
  })
  socket.on('forgotPassword_send', (data) => {
    const { email } = data

    database_config.sql = "SELECT * FROM casino_user"
    database_config.name = "db06"
		database(database_config).then((result)=>{
      if(result && result.length > 0){
        users_array = result
        let user = users_array.filter((x)=>{
          return x.email === email
        })
        if(user && user[0]){
          let payload = {...user[0], ...data}
          sendEmail('forgot_password', payload).then((res)=>{
            try{
              resetPassword(user[0])
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
  function resetPassword(user){
    if(user){
      let new_pass_value = "Password001!"
      let new_pass = JSON.stringify(encrypt(new_pass_value))
      database_config.sql = "UPDATE casino_user SET pass='" + new_pass + "' WHERE uuid='" + user.uuid + "'; "
      database_config.name = "db07"
      database(database_config).then(()=>{})
    } else {
      console.log('[error]','resetPassword--> no user ', user)
    }
  }
  socket.on('signup_verification_send', (data) => {
    const { email, lang } = data
    let verificationToken = crypto.randomBytes(20).toString('hex') // Generate a unique verification token

    //update user with the new token

    database_config.sql = 'UPDATE casino_user SET verification_token = "' + verificationToken + '" WHERE email = "' + email + '"'
    database_config.name = "db0003"
    database(database_config).then(()=>{
      sendVerificationEmail(email, lang, verificationToken).then((res)=>{
        try{
          io.to(socket.id).emit('signup_verification_read', res)
        } catch(e){
          console.log('[error]','signup_verification_read :', e)
        }
      }) 
    })
  })
  socket.on('sign_problem_send', (data) => {
    sendEmail('sign_problem', data).then((res)=>{
      try{        
        io.to(socket.id).emit('sign_problem_read', res)
      }catch(e){
        console.log('[error]','sign_problem_read--> ', e)
      }
    })
  })

  // GAMES
  socket.on('game_send', (data)=>{
		if(data.uuid){
      database_config.sql = "SELECT * FROM casino_user; "
      database_config.sql += "SELECT * FROM login_user;"
      database_config.name = "db08"
      database(database_config).then((result)=>{ 
        let payload = {streak: 1, prize: 0}
        if(result){
          users_array = result[0]
          login_user = result[1]
          if(users_array && users_array.length>0 && login_user && login_user.length>0){
            try{
              let user_found = users_array.filter((x) => x.uuid === data.uuid)
              payload = updateStreak(user_found, login_user)
              io.to(socket.id).emit('game_read', payload)
            } catch(e){
              console.log('[error]','game_read--> ', e)
            }
          }
        }
      })
    }
	})

  socket.on('streakClainPrize_send', (data)=>{
		if(data.uuid){
      try{
        io.to(socket.id).emit('streakClainPrize_read', {prize: data.prize})
        // updateMoney(user_found, payload)
      } catch(e){
        console.log('[error]','streakClainPrize_read--> ', e)
      }
    }
	})

  
  function updateStreak(user_found, login_user){
    let streak = 1
    if(user_found[0]){
      let logs = login_user.filter((x) => x.user_id === user_found[0].id)
      streak = check_streak(logs)
    }
    let prize = 0
    if(streak > 0 && streak % 10 === 0){ //each 10 days the user gets a bigger prize
      prize = 10
    }
    return {streak, prize}
  }
  function updateMoney(user_found, x){
    if(user_found[0]){
      database_config.name = "db07"
      let money = user_found.money + x.prize
      let table_name = 'streak_prize'
      let game_id = 'streak_prize'
      let game_type = 'streak_prize'
      let status = 1
      let timestamp = new Date().getTime() 
      database_config.sql = ""
      if(money){
        database_config.sql = "UPDATE casino_user SET money='" + data.money + "' WHERE id="+user_found[0].id
      }
      database_config.sql += "INSERT INTO history_user (user_id, game_name, game_id, game_type, date, status, sum) VALUES (?, ?, ?, ?, ?, ?, ?)"
      database_config.name = "db09"
      let payload =  [user_found[0].id, table_name, game_id, game_type, timestamp, status, x.prize]
      database(database_config, payload).then(()=>{})
    }
  }

	socket.on('roulette_send', (data)=>{
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
  socket.on('blackjack_send', (data)=>{
		if(data.uuid){
      let room = data.room
      let payload = blackjack(data, chatroom_users, how_lucky)
			try{
				io.to(room).emit('blackjack_read', payload)
			} catch(e){
				console.log('[error]','roulette_read--> ', e)
			}
		}
	})
  socket.on('poker_send', (data)=>{
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
  socket.on('slots_send', (data)=>{
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
  socket.on('craps_send', (data)=>{
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
  socket.on('race_send', (data)=>{
		if(data.uuid){
			let payload = race(data, how_lucky)
			try{
        io.emit('race_read', payload)
			} catch(e){
				console.log('[error]','race_read--> ', e)
			}
		}
	})
  socket.on('keno_send', (data)=>{
		if(data.uuid){
			let payload = keno(data, how_lucky)
			try{
        io.emit('keno_read', payload)
			} catch(e){
				console.log('[error]','keno_read--> ', e)
			}
		}
	})
  socket.on('baccarat_send', (data)=>{
		let payload = baccarat(data, how_lucky)
			try{
        io.emit('baccarat_read', payload)
			} catch(e){
				console.log('[error]','baccarat_read--> ', e)
			}
	})

  socket.on('game_results_send', (data)=>{
    if(data.uuid){
      database_config.sql = "SELECT * FROM casino_user;"
      database_config.name = "db10"
      database(database_config).then((result)=>{
        if(result){
          users_array = result
          if(users_array && users_array.length>0){
            try{
              let user_found = users_array.filter((x) => x.uuid === data.uuid) 
              if(user_found && user_found.length>0){
                let table_name = data.game.table_name ? data.game.table_name : ""
                let table_id = data.game.table_id ? data.game.table_id : table_name
                let table_type = data.game.table_type ? data.game.table_type : table_name
                let status = data.status == "win" ? 1 : 0 
                let timestamp = new Date().getTime()

                database_config.sql = "UPDATE casino_user SET money='" + data.money + "' WHERE id=" + user_found[0].id + '; '
                database_config.sql += "INSERT INTO history_user (user_id, game_name, game_id, game_type, date, status, sum) VALUES (?, ?, ?, ?, ?, ?, ?)"
                database_config.name = "db11"
                let payload = [user_found[0].id, table_name, table_id, table_type, timestamp, status, data.bet]
                database(database_config, payload).then(()=>{})
              }
            } catch(e){
              console.log('[error]','game_results_read--> ', e)
            }
          }
        }
      })
    }
  })

  // DASHBOARD, CART, ORDER, WITHDRAW, NEWSLETTERS
  socket.on('dashboardChanges_send', (data)=>{
    const { uuid, value } = data
    if(uuid){
        switch(data.type) {
          case "pic":
            database_config.sql = "UPDATE casino_user SET profile_pic='" + value + "' WHERE uuid='" + uuid + "'; "
            database_config.name = "db012"
            break
          case "user":
            database_config.sql = "UPDATE casino_user SET user='" + value + "'WHERE uuid='" + uuid + "'; "
            database_config.name = "db013"
            break
          case "pass":
            let new_pass = JSON.stringify(encrypt(value))
            database_config.sql = "UPDATE casino_user SET pass='" + new_pass + "' WHERE uuid='" + uuid + "'; "
            database_config.name = "db014"
            break
        }        
        database(database_config).then(()=>{})
    }
  })
  socket.on('promo_send', (text)=>{
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
      console.log('[error]','promo_read--> ', e)
    }
  })
  socket.on('order_send', (details)=>{
    const { uuid, carrots_update, order_date, payment_id, amount, method, description, currency, exchange_rates, currencyExchange } = details
    console.log(details)
    if(uuid){
      database_config.sql = "SELECT * FROM casino_user;"
      database_config.name = "db15"
      database(database_config).then((result)=>{
        if(result){
          users_array = result
          if(users_array && users_array.length>0){
            let user_found = users_array.filter((x) => x.uuid === uuid) 
            if(user_found[0] && user_found[0]){
              let id = user_found[0].id
              let money = user_found[0].money + carrots_update
              let orderDate
              if (typeof order_date === 'number') {
                  orderDate = order_date + ""
              } else {
                  orderDate = new Date(order_date).getTime() + ""
              }

              function getOrDefault(obj, key, defaultValue = '-') {
                return obj[key] !== undefined ? obj[key] : defaultValue
              }

              let exchange_rate = exchange_rates[currencyExchange]

              const payload = [
                  id,
                  payment_id,
                  getOrDefault(details, 'customer_id'),
                  orderDate,
                  amount,
                  method,
                  getOrDefault(details, 'country'),
                  getOrDefault(details, 'city'),
                  getOrDefault(details, 'email'),
                  getOrDefault(details, 'phone'),
                  description,
                  currency,
                  currencyExchange,
                  exchange_rate
              ]

              database_config.sql = "UPDATE casino_user SET money='" + money + "' WHERE id=" + id + '; '
              database_config.sql = `INSERT INTO order_table (user_id, payment_id, customer_id, order_date, amount, method, country, city, email, phone, description, currency, currency_exchange, exchange_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
              database_config.name = "db016"
              console.log('order_table ', details, payload)
              database(database_config, payload).then(()=>{
                try{
                  io.to(socket.id).emit('order_read', {...details, money})
                }catch(e){
                  console.log('[error]','order_read--> ', e)
                }
              })
            } else {
              io.to(socket.id).emit('order_read', {error: 'no_user'})
              console.log('[error]','order_read--> ', user_found)
            }
          }
        }
      })
    } else {
      io.to(socket.id).emit('order_read', {error: 'no_uuid'})
      console.log('[error]','order_read--> ', uuid)
    }   
  })

  socket.on('getOrdersWithdraws_send', (data)=>{
    const { uuid } = data
    if(uuid){
      database_config.sql = "SELECT * FROM casino_user;"
      database_config.name = "db17"
      database(database_config).then((result)=>{
        if(result){
          users_array = result          
          if(users_array && users_array.length > 0){
            let user_found = users_array.filter((x) => x.uuid === uuid)
            if(user_found[0] && user_found[0]){
              let id = user_found[0].id

              database_config.sql = "SELECT * FROM order_table;"
              database_config.sql += "SELECT * FROM withdraw_table;"
              database_config.name = "db018"

              database(database_config).then((result)=>{
                let orders_found = result && result[0] && result[0].length > 0 ? result[0].filter((x)=>{return x.user_id === id}) : []
                let withdraws_found = result && result[1] && result[1].length > 0 ? result[1].filter((x)=>{return x.user_id === id}) : []
                io.to(socket.id).emit('getOrdersWithdraws_read', {orders_found, withdraws_found})
              })
            } else {
              io.to(socket.id).emit('getOrdersWithdraws_read', {error: 'no_user'})
              console.log('[error]','getOrdersWithdraws_read--> ', user_found)
            }
          }
        }
      })
    } else {
      io.to(socket.id).emit('getOrdersWithdraws_read', {error: 'no_uuid'})
      console.log('[error]','getOrdersWithdraws_read--> ', uuid)
    }   
  })


  socket.on('newsletter_send', (data)=>{
    const { uuid, email } = data
    if(uuid && email){
      database_config.sql = "SELECT * FROM casino_user;"
      database_config.name = "db19"
      database(database_config).then((result1)=>{
        if(result1){
          users_array = result1
          if(users_array && users_array.length > 0){
            let user_found = users_array.filter((x) => x.uuid === uuid)
            if(user_found[0] && user_found[0]){
              database_config.sql = "SELECT * FROM newsletters;"
              database_config.name = "db20"
              database(database_config).then((result2)=>{
                if(result2){
                  let email_found = result2.filter((x) => x.email === email)
                  if(email_found && email_found.length > 0){
                    try{				
                      io.to(socket.id).emit('newsletter_read', {success: false, send: "already_subscribed"})
                    }catch(e){
                      console.log('[error]','newsletter_read--> ', e)
                    }
                  } else {
                    database_config.sql = "INSERT INTO newsletters (user_id, email) VALUES (?, ?)"
                    database_config.name = "db21"
                    let payload = [user_found[0].id, email]
                    database(database_config, payload).then(()=>{
                      try{				
                        io.to(socket.id).emit('newsletter_read', {success: false, send: "subscribed"})
                      }catch(e){
                        console.log('[error]','newsletter_read--> ', e)
                      }
                    })
                  }
                }
              })
            } else {
              try{				
                io.to(socket.id).emit('newsletter_read', {success: false, send: "error"})
              }catch(e){
                console.log('[error]','newsletter_read--> ', e)
              }
            }
          } else {
            try{				
              io.to(socket.id).emit('newsletter_read', {success: false, send: "error"})
            }catch(e){
              console.log('[error]','newsletter_read--> ', e)
            }
          }
        } else {
          try{				
            io.to(socket.id).emit('newsletter_read', {success: false, send: "error"})
          }catch(e){
            console.log('[error]','newsletter_read--> ', e)
          }
        }
      })
    } else {
      try{				
        io.to(socket.id).emit('newsletter_read', {success: false, send: "error"})
      }catch(e){
        console.log('[error]','newsletter_read--> ', e)
      }
    }    
  })

  // CHATROOM
  socket.on('join_room', (data)=>{
    let room = data.room
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
  socket.on('leave_room', (data)=>{
    let room = data.room
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
  socket.on('message_send', (data)=>{
    let room = data.room
    let timestamp = new Date().getTime()
    let message = {text: data.text, timestamp: timestamp, user: data.user}
		try{
      io.to(room).emit('message_read', message)
    } catch(e){
      console.log('[error]','message_read--> ', e)
    }
	}) 

  socket.on('heartbeat', (data)=>{
		console.log('heartbeat', data)
	})
  socket.on('disconnect', ()=>{
    console.log('Got disconnect!')
  })
})

http.listen(PORT, () => {console.log(`Server listening on ${PORT}`)})