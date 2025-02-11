var nodemailer = require('nodemailer')
var constants = require('../var/constants')

const transports = {
    gmail: nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: constants.AUTH_FROM,
            pass: constants.GMAIL_PASS
        }
    }),
    default: nodemailer.createTransport({
        host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: constants.AUTH_USER,
			pass: constants.AUTH_PASS
		}
    })
}

function getTransport() {
    // return transports.default
    return transports.gmail
}

function sendEmail(reason, e){
	return new Promise((resolve, reject)=>{
        const { 
            email, user, id, cv, cvName, job, about, message, lang,
            uuid, amount, currency, name, phone, country, city, iban
        } = e

		if(!email){
			resolve({success_mail: false, send: "email_no_send"})
		}		
		const transport = getTransport(email)

		let subject = ''
		let html = ''
        let success_message = "email_send"
        let mailOptions = null
        switch (reason) {
            case "sign_problem":
                subject = "Problem login or sign in"
                html += "<p><b>Email: </b> " + email + "</p>"

                success_message = "email_send"

                mailOptions = {
                    from: email,
                    to: constants.AUTH_FROM,
                    subject,
                    html
                }

                break
            case "forgot_password":
                switch (lang) {
                    case "DE":
                        subject = 'BunnyBet Passwort zurücksetzen'
                        html += "<p>Hallo " + user + "</p>"
                        html += "<p>Sie haben eine Passwortrücksetzung angefordert.</p>"
                        html += "<p>Ihr neues Passwort ist: <b>Password001!</b></p>"
                        html += "<p>Nachdem Sie sich angemeldet haben, setzen Sie bitte dieses Passwort auf Ihr eigenes zurück.</p>"
                        break
                    case "ES":
                        subject = 'BunnyBet restablecer contraseña'
                        html += "<p>Hola " + user + "</p>"
                        html += "<p>Has solicitado restablecer tu contraseña.</p>"
                        html += "<p>Su nueva contraseña es: <b>Password001!</b></p>"
                        html += "<p>Después de iniciar sesión, por favor restablezca esta contraseña con la suya propia.</p>"
                        break
                    case "FR":
                        subject = 'BunnyBet réinitialiser le mot de passe'
                        html += "<p>Bonjour " + user + "</p>"
                        html += "<p>Vous avez demandé à réinitialiser votre mot de passe.</p>"
                        html += "<p>Votre nouveau mot de passe est : <b>Password001!</b></p>"
                        html += "<p>Après vous être connecté, veuillez réinitialiser ce mot de passe avec le vôtre.</p>"
                        break
                    case "IT":
                        subject = 'BunnyBet reimposta password'
                        html += "<p>Ciao " + user + "</p>"
                        html += "<p>Hai richiesto di resettare la tua password.</p>"
                        html += "<p>La tua nuova password è: <b>Password001!</b></p>"
                        html += "<p>Dopo aver effettuato l'accesso, si prega di reimpostare questa password con la propria.</p>"
                        break
                    case "PT":
                        subject = 'BunnyBet redefinir senha'
                        html += "<p>Olá " + user + "</p>"
                        html += "<p>Você solicitou a redefinição de sua senha.</p>"
                        html += "<p>Sua nova senha é: <b>Password001!</b></p>"
                        html += "<p>Depois de fazer login, por favor redefina esta senha com a sua própria.</p>"
                        break
                    case "RO":
                        subject = 'BunnyBet resetare parolă'
                        html += "<p>Bună " + user + "</p>"
                        html += "<p>Ai cerut resetarea parolei tale.</p>"
                        html += "<p>Noua ta parolă este: <b>Password001!</b></p>"
                        html += "<p>După autentificare, vă rugăm să resetați această parolă cu cea proprie.</p>"
                        break
                    case "RU":
                        subject = 'BunnyBet сброс пароля'
                        html += "<p>Привет " + user + "</p>"
                        html += "<p>Вы запросили сброс пароля.</p>"
                        html += "<p>Ваш новый пароль: <b>Password001!</b>.</p>"
                        html += "<p>После входа в систему, пожалуйста, сбросьте этот пароль на свой собственный.</p>"
                        break
                    case "ZH":
                        subject = 'BunnyBet 重置密码'
                        html += "<p>你好 " + user + "</p>"
                        html += "<p>你请求重置密码。</p>"
                        html += "<p>您的新密码是：<b>Password001!</b></p>"
                        html += "<p>登录后，请将此密码更改为您自己的密码。</p>"
                        break
                    case "ENG":
                    default:
                        subject = 'BunnyBet reset password'
                        html += "<p>Hi " + user + "</p>"
                        html += "<p>You requested to reset your password.</p>"
                        html += "<p>You new password is: <b>Password001!</b></p>"
                        html += "<p>After you login, please reset this password with your own.</p>"
                        break
                }

                success_message = "email_send"

                mailOptions = {
                    from: constants.AUTH_FROM,
                    to: email,
                    subject: subject,
                    html: html
                }

                break
            case "apply_job":
                subject = "Casino job apply"
                html += "<p><b>Email: </b> " + email + "</p>"
                html += "<p><b>Job id: </b> " + id + "</p>"
                html += "<p><b>Job title: </b> " + job.title + "</p>"
                html += "<p><b>Job location: </b> " + job.location + "</p>"
                html += "<p><b>Job type: </b> " + job.type + "</p>"

                const attachments = cv ? [
                    {   // encoded string as an attachment
                        filename: cvName,
                        content: cv,
                        encoding: 'base64'
                    },
                ] : []

                success_message = "email_send"

                mailOptions = {
                    from: email,
                    to: constants.AUTH_FROM,
                    subject,
                    html,
                    attachments
                }

                break
            case "contact":
                subject = e.subject
                html += "<p><b>Email: </b> " + email + "</p>"
                html += "<p><b>About: </b> " + about + "</p>"
                html += "<p><b>send: </b> " + message + "</p>"

                success_message = "email_send"

                mailOptions = {
                    from: email,
                    to: constants.AUTH_FROM,
                    subject,
                    html
                }

                break
            case "withdraw":
                subject = reason

                html += "<p><b>id: </b> " + id + "</p>"
                html += "<p><b>uuid: </b> " + uuid + "</p>"
                html += "<p><b>amount: </b> " + amount + "</p>"
                html += "<p><b>currency: </b> " + currency + "</p>"
                html += "<p><b>name: </b> " + name + "</p>"
                html += "<p><b>phone: </b> " + phone + "</p>"
                html += "<p><b>email: </b> " + email + "</p>"
                html += "<p><b>country: </b> " + country + "</p>"
                html += "<p><b>city: </b> " + city + "</p>"
                html += "<p><b>iban: </b> " + iban + "</p>"

                success_message = "withdraw_success"

                mailOptions = {
                    from: email,
                    to: constants.AUTH_FROM,
                    subject,
                    html
                }

                break
        }
        
        if (mailOptions) {
            transport.sendMail(mailOptions, (error, info)=>{
                if (error) {
                    console.log('error1--> ', error, mailOptions)
                    let error_message = "email_no_send"
                    if (error.responseCode === 550) {
                        error_message = "email_not_exist_is_inactive."
                    } else if (error.responseCode === 554) {
                        error_message = "email_blocked_has_restrictions"
                    }   
                    resolve({success_mail: false, send: error_message})
                } else {
                    resolve({success_mail: true, send: success_message})
                }
            })
        } else {
            console.log('error2--> ', mailOptions)
            resolve({success_mail: false, send: "email_no_send"})
        }
    })
}

function sendVerificationEmail(email, lang="ENG", token) {
    return new Promise((resolve, reject) => {
        if (!email && !token) {
            console.log('error0--> ', email, token)
            return resolve({ success_mail: false, send: "email_no_send" })
        }

        // Determine the appropriate transport based on the email domain
        const transport = getTransport(email)

        // Compose the email subject and HTML body
        let subject = ''
        let html = ''
        switch (lang) {
            case "DE":
                subject = 'Bitte verifizieren Sie Ihre E-Mail-Adresse';
                html = "<p>Klicken Sie auf den untenstehenden Link, um Ihre E-Mail-Adresse zu verifizieren:</p>"
                html += "<a href=" + process.env.BASE_URL + "/verify-email?token=" + token + ">E-Mail verifizieren</a>"
                break
            case "ES":
                subject = 'Por favor, verifique su dirección de correo electrónico';
                html = "<p>Haga clic en el enlace a continuación para verificar su dirección de correo electrónico:</p>"
                html += "<a href=" + process.env.BASE_URL + "/verify-email?token=" + token + ">Verificar correo electrónico</a>"
                break
            case "FR":
                subject = 'Veuillez vérifier votre adresse e-mail';
                html = "<p>Cliquez sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>"
                html += "<a href=" + process.env.BASE_URL + "/verify-email?token=" + token + ">Vérifier l'e-mail</a>"
                break
            case "IT":
                subject = 'Si prega di verificare il tuo indirizzo e-mail';
                html = "<p>Clicca sul link qui sotto per verificare il tuo indirizzo e-mail:</p>"
                html += "<a href=" + process.env.BASE_URL + "/verify-email?token=" + token + ">Verifica email</a>"
                break
            case "PT":
                subject = 'Por favor, verifique seu endereço de e-mail';
                html = "<p>Clique no link abaixo para verificar seu endereço de e-mail:</p>"
                html += "<a href=" + process.env.BASE_URL + "/verify-email?token=" + token + ">Verificar e-mail</a>"
                break
            case "RO":
                subject = 'Vă rugăm să verificați adresa dvs. de e-mail';
                html = "<p>Faceți clic pe linkul de mai jos pentru a verifica adresa dvs. de e-mail:</p>"
                html += "<a href=" + process.env.BASE_URL + "/verify-email?token=" + token + ">Verificați e-mailul</a>"
                break
            case "RU":
                subject = 'Пожалуйста, подтвердите ваш адрес электронной почты';
                html = "<p>Щелкните по ссылке ниже, чтобы подтвердить ваш адрес электронной почты:</p>"
                html += "<a href=" + process.env.BASE_URL + "/verify-email?token=" + token + ">Подтвердить электронную почту</a>"
                break
            case "ZH":
                subject = '请验证您的电子邮件地址';
                html = "<p>点击下面的链接验证您的电子邮件地址：</p>"
                html += "<a href=" + process.env.BASE_URL + "/verify-email?token=" + token + ">验证电子邮件</a>"
                break
            case "ENG":
            default:
                subject = 'Please Verify Your Email Address';
                html = "<p>Click the link below to verify your email address:</p>"
                html += "<a href=" + process.env.BASE_URL + "/verify-email?token=" + token + ">Verify Email</a>"
                break
        }


        // Mail options
        const mailOptions = {
            from: constants.AUTH_FROM,
            to: email,
            subject: subject,
            html: html
        }

        // Send the email using the selected transport
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending verification email:', error, mailOptions)
                let error_message = "email_no_send"
                if (error.responseCode === 550) {
                    error_message = "email_not_exist_is_inactive"
                } else if (error.responseCode === 554) {
                    error_message = "email_blocked_has_restrictions"
                }
                resolve({ success_mail: false, details: error_message })
            } else {
                resolve({ success_mail: true, details: "email_send_validation" })
            }
        })
    })
}

module.exports = {
	sendEmail,
    sendVerificationEmail,
}