var nodemailer = require('nodemailer')
var constants = require('../var/constants')

const transports = {
    // gmail: nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: constants.GMAIL_USER,
    //         pass: constants.GMAIL_PASS
    //     }
    // }),
    // yahoo: nodemailer.createTransport({
    //     host: 'smtp.mail.yahoo.com',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: constants.YAHOO_USER,
    //         pass: constants.YAHOO_PASS
    //     }
    // }),
    default: nodemailer.createTransport({
        host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: constants.AUTH_USER,
			pass: constants.AUTH_PASS
		}
    })
}

function getTransport(email) {
    const domain = email.split('@')[1]
    if(domain){
        if (domain.includes('gmail.com')){
            return transports.default
        } else if (domain.includes('yahoo.com')) {
            return transports.default
        } else {
            return transports.default
        }
    } else {
        return transports.default
    }
}

function sendEmail(reason, e, data){ //send an email with instructions to reset token
	return new Promise((resolve, reject)=>{
		if(!e.email){
			resolve({send: "email_no_send"})
		}		
		let user = e.user
		let email = e.email
		const transport = getTransport(email)

		let subject = ''
		let html = ''
        let success_message = "email_send"
        switch (reason) {
            case "forgot_password":
                let lang = data.lang || 'ENG'
                switch (lang) {
                    case "DE":
                        subject = 'BunnyBet Passwort zurücksetzen'
                        html = html + "<p>Hallo " + user + "</p>"
                        html = html + "<p>Sie haben eine Passwortrücksetzung angefordert.</p>"
                        html = html + "<p>Ihr neues Passwort ist: <b>Password001!</b></p>"
                        html = html + "<p>Nachdem Sie sich angemeldet haben, setzen Sie bitte dieses Passwort auf Ihr eigenes zurück.</p>"
                        break
                    case "ES":
                        subject = 'BunnyBet restablecer contraseña'
                        html = html + "<p>Hola " + user + "</p>"
                        html = html + "<p>Has solicitado restablecer tu contraseña.</p>"
                        html = html + "<p>Su nueva contraseña es: <b>Password001!</b></p>"
                        html = html + "<p>Después de iniciar sesión, por favor restablezca esta contraseña con la suya propia.</p>"
                        break
                    case "FR":
                        subject = 'BunnyBet réinitialiser le mot de passe'
                        html = html + "<p>Bonjour " + user + "</p>"
                        html = html + "<p>Vous avez demandé à réinitialiser votre mot de passe.</p>"
                        html = html + "<p>Votre nouveau mot de passe est : <b>Password001!</b></p>"
                        html = html + "<p>Après vous être connecté, veuillez réinitialiser ce mot de passe avec le vôtre.</p>"
                        break
                    case "IT":
                        subject = 'BunnyBet reimposta password'
                        html = html + "<p>Ciao " + user + "</p>"
                        html = html + "<p>Hai richiesto di resettare la tua password.</p>"
                        html = html + "<p>La tua nuova password è: <b>Password001!</b></p>"
                        html = html + "<p>Dopo aver effettuato l'accesso, si prega di reimpostare questa password con la propria.</p>"
                        break
                    case "PT":
                        subject = 'BunnyBet redefinir senha'
                        html = html + "<p>Olá " + user + "</p>"
                        html = html + "<p>Você solicitou a redefinição de sua senha.</p>"
                        html = html + "<p>Sua nova senha é: <b>Password001!</b></p>"
                        html = html + "<p>Depois de fazer login, por favor redefina esta senha com a sua própria.</p>"
                        break
                    case "RO":
                        subject = 'BunnyBet resetare parolă'
                        html = html + "<p>Bună " + user + "</p>"
                        html = html + "<p>Ai cerut resetarea parolei tale.</p>"
                        html = html + "<p>Noua ta parolă este: <b>Password001!</b></p>"
                        html = html + "<p>După autentificare, vă rugăm să resetați această parolă cu cea proprie.</p>"
                        break
                    case "RU":
                        subject = 'BunnyBet сброс пароля'
                        html = html + "<p>Привет " + user + "</p>"
                        html = html + "<p>Вы запросили сброс пароля.</p>"
                        html = html + "<p>Ваш новый пароль: <b>Password001!</b>.</p>"
                        html = html + "<p>После входа в систему, пожалуйста, сбросьте этот пароль на свой собственный.</p>"
                        break
                    case "ENG":
                    default:
                        subject = 'BunnyBet reset password'
                        html = html + "<p>Hi " + user + "</p>"
                        html = html + "<p>You requested to reset your password.</p>"
                        html = html + "<p>You new password is: <b>Password001!</b>.</p>"
                        html = html + "<p>After you login, please reset this password with your own.</p>"
                        break
                }
                success_message = "email_send_mailtrap"
                break
            case "contact":
                subject = e.subject
                html = html + "<p><b>About: </b> " + e.about + "</p>"
                html = html + "<p><b>Message: </b> " + e.message + "</p>"
                success_message = "email_send"
        }			

		let mailOptions = {
			from: constants.AUTH_FROM,
			to: email,
			subject: subject,
			html: html
		}
        
		transport.sendMail(mailOptions, (error, info)=>{
			if (error) {
			    console.log('error--> ', error, mailOptions)
				resolve({send: "email_no_send"})
			} else {
				resolve({send: success_message})
			}
		})
    })
}

module.exports = {
	sendEmail,
}