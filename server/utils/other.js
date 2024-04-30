const axios = require('axios')
var nodemailer = require('nodemailer')
var constants = require('../var/constants')
var transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
	  user: constants.AUTH_USER,
	  pass: constants.AUTH_PASS
	}
})

function sort_array_obj(array, sort_by){
	let sorted = false
	switch (typeof sort_by) {
		case 'string': // sort array of objects
			while (!sorted){
				sorted = true				
				for(let i=0; i<array.length-1; i++){
					if (array[i][sort_by] > array[i+1][sort_by]) {
						let t = array[i+1]
						array[i+1] = array[i]
						array[i] = t
						sorted = false
					  }
				}
			}			
			break
		case 'undefined': // sort a simple array
			while (!sorted){
				sorted = true
				for(let i=0; i<array.length-1; i++){
					if (array[i] > array[i+1]) {
						let t = array[i+1]
						array[i+1] = array[i]
						array[i] = t
						sorted = false
					  }
				}
			}
			break			
	}
  	return array
}
function get_device(headers){
	let device = 0 // 0 = computer, 1 = mobile, 2 = other
	if(headers){
		if (headers && typeof headers["user-agent"] === "string" && headers["user-agent"].trim() !== "") {
			const userAgent = headers["user-agent"].toLowerCase()
			if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile safari|windows phone|silk-accelerated/i.test(userAgent)) {
				device = 1; // Mobile
			} else if (/tablet|ipad|android(?!.*mobile)/i.test(userAgent)) {
				device = 1; // Tablet
			} else {
				device = 0; // Assuming non-mobile devices as computers
			}
		} else {
			device = 2; // Other or undefined
		}
	}
	return device
}
function check_streak(result){
	const DAYS = 2
	const DAY_SPAN = DAYS * 24
	let streak = 1

	for(let i = 0; i < result.length-1; i++){
		let date01 = new Date(parseInt(result[i].login_date))
		var day01 = date01.getDate()			
		let date02 = new Date(parseInt(result[i+1].login_date))
		var day02 = date02.getDate()
		let period = parseInt(result[i+1].login_date)-parseInt(result[i].login_date)
		let hours = period / 3600000

		if(hours < DAY_SPAN && day01 != day02){
			// less then two days span, but not the same day
			streak++
		} else if(hours < DAY_SPAN && day01 == day02){
			// he logged again in the same day
		} else {
			// he missed a day or more
			streak = 1
		}
	}
	return streak
}

function get_geolocation(apiKey) {
	return "https://api.ipgeolocation.io/ipgeo?apiKey=" + apiKey
}
function get_extra_data(){
	return new Promise(function(resolve, reject){
		let url = get_geolocation('3b154170258741fb81976e7f34d61938')
		axios.get(url).then(response => {
			resolve(response)	
		}).catch(error => {
			console.log('get_extra_data_error--> ', error)
			resolve(false)
		})
	})
}

function sendEmail(data){ //send an email with instructions to reset token
    let lang = data.lang ? data.lang : 'ENG'
    let user = data.user
    let email = data.email

    let subject = ''
    let html = ''
	switch (lang) {
		case "DE":
			subject = 'BunnyBet Passwort zurücksetzen'
			html = html + '<p>Hallo ' + user + '</p>'
			html = html + '<p>Sie haben eine Passwortrücksetzung angefordert.</p>'
			break
		case "ES":
			subject = 'BunnyBet restablecer contraseña'
			html = html + '<p>Hola ' + user + '</p>'
			html = html + '<p>Has solicitado restablecer tu contraseña.</p>'
			break
		case "FR":
			subject = 'BunnyBet réinitialiser le mot de passe'
			html = html + '<p>Bonjour ' + user + '</p>'
			html = html + '<p>Vous avez demandé à réinitialiser votre mot de passe.</p>'
			break
		case "IT":
			subject = 'BunnyBet reimposta password'
			html = html + '<p>Ciao ' + user + '</p>'
			html = html + '<p>Hai richiesto di resettare la tua password.</p>'
			break
		case "RO":
			subject = 'BunnyBet resetare parola'
			html = html + '<p>Buna ' + user + '</p>'
			html = html + '<p>Ai cerut resetarea parolei tale.</p>'
			break
		case "ENG":
		default:
			subject = 'BunnyBet reset password'
			html = html + '<p>Hi ' + user + '</p>'
			html = html + '<p>You requested to reset your password.</p>'
			break
	}

    let mailOptions = {
      from: constants.AUTH_FROM,
      to: email,
      subject: subject,
      html: html
    }
    return new Promise(function(resolve, reject){
      transport.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log('error--> ', error, mailOptions)
          resolve({send: "email_no_send"})
        } else {
          resolve({send: "email_send"})
        }
      })
    })
}

module.exports = {
	sort_array_obj,
	get_device,
	check_streak,
	get_extra_data,
	sendEmail,
}