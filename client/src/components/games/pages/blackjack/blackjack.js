import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import { translate } from '../../../../translations/translate'
import GameBoard from '../other/gameBoard'
import { draw_rect, getRoom, get_cards } from '../../../../utils/games'
import { changePopup } from '../../../../reducers/popup'
import { decryptData } from '../../../../utils/crypto'
import $ from 'jquery'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'

function Card(config){
	let self = this
	self.id = config.id
	self.name = config.name
	self.user = config.user
	self.dealer = config.dealer
	
	self.x = config.x
	self.y = config.y
	self.width = config.width
	self.height = config.height
	self.fillStyle = config.fillStyle
	self.lineWidth = config.lineWidth
	self.strokeStyle = config.strokeStyle
	self.card = config.card //The size of the clipped image
	self.card_img = config.card_img //The size of the image to use
	self.space = config.space
	self.player_nr = config.player_nr
	self.images = config.images
	self.text = config.text
	self.font_bold_10 = config.font_bold_10
	self.font_bold_12 = config.font_bold_12
	
	self.draw_box = function(ctx){
		//draw rect where the cards will be
		draw_rect(ctx, self.x, self.y, self.width, self.height, self.fillStyle, self.lineWidth, self.strokeStyle)		
		//draw square with number
		if(self.id !== -1){
			draw_rect(ctx, self.x, self.y - self.player_nr[1], self.player_nr[0], self.player_nr[1], self.fillStyle, self.lineWidth, self.strokeStyle)
			self.draw_card_number(ctx, self.id, self.x, self.y + 10, self.player_nr[0], self.height)
		}
	}	

	self.show_cards = function(ctx, data){
		if(self.id !== -1){
			//player
			let player = data.players[self.id]
			if(player){
				self.draw_card(ctx, self.x, self.y, self.card.width, self.card.height, self.card_img, player.hand)
				self.show_cards_value(ctx, player.hand)
			}
		} else {
			//dealer
			let dealer = data.dealer
			if(dealer){
				self.draw_card(ctx, self.x, self.y, self.card.width, self.card.height, self.card_img, dealer.hand)
				self.show_cards_value(ctx, dealer.hand)
				if(dealer.hand.length === 1){
					//dealer's hand is still hidden
					self.draw_card(ctx, self.x + 5, self.y + 5, self.card.width, self.card.height, self.card_img, "hidden")
				}
			}
		}		
	}

	self.show_cards_value = function(ctx, hand){
		let value_hand = 0
		for(let i in hand){
			value_hand = value_hand + parseInt(hand[i].Weight)
		}

		ctx.beginPath()
		ctx.fillStyle = "white"
		ctx.rect(self.x+self.player_nr[0], self.y - self.player_nr[0], self.width-self.player_nr[0], self.player_nr[1])
		if(self.strokeStyle !== ""){
			ctx.lineWidth = self.lineWidth
			ctx.strokeStyle = self.strokeStyle
			ctx.stroke()
		}
		ctx.fill()
		ctx.closePath()

		ctx.beginPath()
		ctx.fillStyle = self.text
		ctx.textAlign = "center"
		ctx.font = self.font_bold_12
		ctx.fillText(value_hand, self.x + self.width/2 + self.player_nr[0]/2, self.y - 5)
		ctx.closePath()
	}

	self.draw_card_number = function(ctx, text, x, y, w, h){	
		ctx.beginPath()
		ctx.fillStyle = "white"
		ctx.textAlign = "center"
		ctx.font = self.font_bold_12
		ctx.fillText(text, x+w/2, y-15)
		ctx.font = self.font_bold_14
		ctx.closePath()
	}

	this.draw_card = function(ctx, x, y, w, h, size, hand){
		let img = self.images
		let space = 5
		let img_index = 0
		if(hand === "hidden"){
			ctx.drawImage(img[img_index].src, 0, 0, size.width, size.height, x + 5, y + 5 + space, w, h)
		} else {
			for(let i in hand){		
				switch (hand[i].Suit) { 					
					case "Hearts":
						img_index = 1		
						break				
					case "Spades":
						img_index = 14		
						break
					case "Diamonds":
						img_index = 27	
						break
					case "Clubs":
						img_index = 40							
						break
				}		  
				switch (hand[i].Value) {
					case "A":
						img_index = img_index + 0			
						break
					case "2":
						img_index = img_index + 1					
						break
					case "3":
						img_index = img_index + 2							
						break
					case "4":	
						img_index = img_index + 3				
						break
					case "5":
						img_index = img_index + 4					
						break
					case "6":
						img_index = img_index + 5						
						break
					case "7":
						img_index = img_index + 6				
						break
					case "8":
						img_index = img_index + 7							
						break
					case "9":
						img_index = img_index + 8			
						break
					case "10":
						img_index = img_index + 9					
						break
					case "J":
						img_index = img_index + 10				
						break
					case "Q":	
						img_index = img_index + 11	
						break
					case "K":
						img_index = img_index + 12					
						break			
				}				
				ctx.drawImage(img[img_index].src, 0, 0, size.width, size.height, x + i*12, y + i*12 + space, w, h)
			}
		}
	}
}

function blackjack_game(props){
    let self = this	
    let images = []

	let canvas
	let ctx
	
	let card_list = []
	let card_base = {}
	let card = {}
	let card_img = {width: 237, height: 365}
	let player_nr = [20, 20]
	let font_bold_12 = 'bold 12px sans-serif'
	let font_bold_14 = 'bold 14px sans-serif'
    
    let items = get_cards()
    let resize = 0

    this.ready = function(){
        resize++
		card_list = []
		self.createCanvas()
        if(!blackjack_status && resize === 1){
            //first time entering
            let promises = []
            for(let i in items){				
                promises.push(self.preaload_images(items[i]))
            }
            Promise.all(promises).then(function(result){
                images = result
                self.create_cards()
                self.draw_cards()
            })
        } else {
            // the game started
            self.create_cards()
            self.draw_cards()	
        }
	}

	this.createCanvas = function(){
        canvas = document.getElementById("blackjack_canvas")
		ctx = canvas.getContext("2d")
		canvas.width = 1200
		canvas.height = 500
		card_base = {x: 20, y:260, width: 120, height: 180, fillStyle: 'transparent', lineWidth: 2, strokeStyle: 'white', dealer_y:40}
		card = {width: 100, height: 150}
		player_nr = [20, 20]
		font_bold_12 = 'bold 12px sans-serif'
		font_bold_14 = 'bold 14px sans-serif'
		if (window.innerWidth <= 960){
			font_bold_12 = 'bold 10px sans-serif'
			font_bold_14 = 'bold 12px sans-serif'
		}

		if (window.innerWidth <= 1200){
			//big
			canvas.width = 900
			canvas.height = 450
			card_base = {x: 20, y:240, width: 100, height: 150, fillStyle: 'transparent', lineWidth: 2, strokeStyle: 'white', dealer_y:40}
			card = {width: 80, height: 120}
			player_nr = [20, 20]
		}
		if (window.innerWidth <= 960){
			//medium
			canvas.width = 480
			canvas.height = 220
			card_base = {x: 5, y:120, width: 53, height: 80, fillStyle: 'transparent', lineWidth: 1, strokeStyle: 'white', dealer_y:20}
			card = {width: 40, height: 60}
			player_nr = [12, 12]				
		}
		if(window.innerWidth <= 600){
			//small
			canvas.width = 400
			canvas.height = 200
			card_base = {x: 5, y:120, width: 46, height: 70, fillStyle: 'transparent', lineWidth: 1, strokeStyle: 'white', dealer_y:20}
			card = {width: 33, height: 50}
			player_nr = [12, 12]
		}
		if(window.innerWidth <= 480){
			//extra small
			canvas.width = 300
			canvas.height = 200
			card_base = {x: 5, y:120, width: 38, height: 60, fillStyle: 'transparent', lineWidth: 1, strokeStyle: 'white', dealer_y:30}
			card = {width: 25, height: 38}
			player_nr = [10, 10]
		}
	}

    this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			let image = new Image()
			image.src = item.src
			image.addEventListener("load", function() {
				resolve({suit: item.suit, value: item.value, src: image})
			}, false)
		})
	}

    this.create_cards = function(x){
		let space = (canvas.width - (card_base.width*7 + card_base.x*6))/2

		// create dealer
		card_list.push(new Card({
			id: -1,
			name: 'dealer',
			x: space + 3 * (card_base.width + card_base.x), 
			y: card_base.dealer_y, 
			width: card_base.width, 
			height: card_base.height, 
			fillStyle: card_base.fillStyle, 
			lineWidth: card_base.lineWidth, 
			strokeStyle: card_base.strokeStyle, 
			card: card,
			card_img: card_img,
			space: space,
			player_nr: player_nr,
			images: images,
			text: "black",
			text_bg: "white",
			font_bold_12: 'bold 10px sans-serif',
			font_bold_14: 'bold 12px sans-serif',
		}))	

		// create players
		let a = 0
		let b = 0
		for(let i=0;i<7;i++){
			if(i === 0){
				a = 3
			} else {
				if(i%2 !== 0){
					b++
					a = 3 - b
				} else {
					a = 3 + b
				}				
			}			
			card_list.push(new Card({
				id: i,
				name: 'player',
				user: 'player_'+i,
				x: space + a * (card_base.width + card_base.x), 
				y: card_base.y, 
				width: card_base.width, 
				height: card_base.height, 
				fillStyle: card_base.fillStyle, 
				lineWidth: card_base.lineWidth, 
				strokeStyle: card_base.strokeStyle, 
				card: card,
				card_img: card_img,
				space: space,
				player_nr: player_nr,
				images: images,
				text: "black",
				text_bg: "white",
				font_bold_12: 'bold 10px sans-serif',
				font_bold_14: 'bold 12px sans-serif',	
			}))
		}
	}

	this.draw_cards = function(){
		if(blackjack_data){
			for(let i in card_list){
				card_list[i].draw_box(ctx)
				card_list[i].show_cards(ctx, blackjack_data)
			}
		} else {
			for(let i in card_list){
				card_list[i].draw_box(ctx)
			}
		}
	}

    this.action = function(data){
		if(data.action){
			blackjack_data = data
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			if(data.action === "start"){
				resize = 0
			}		
			self.draw_cards()
			self.check_win_lose()
		}
    }

	this.check_win_lose = function(){
		let finished = false
		let game = null	
		if(props.page && props.page.game){
			game = props.page.game
		}
		let money = props.user.money ? decryptData(props.user.money) : 0

		let dealer = null
		if(blackjack_data && blackjack_data.dealer){
			dealer = blackjack_data.dealer
		}
		let player = null
		if(blackjack_data && blackjack_data.players){
			let index = blackjack_data.players.findIndex((x) => x.uuid === props.user.uuid)
			if(index !== -1){
				player = blackjack_data.players[index]
			}
		}

		let blackjack_payload = {
			uuid: props.user.uuid,
			game: game,
			status: 'lose',
			bet: blackjack_bets
		}

		if(dealer && dealer.win){
			blackjack_status = false
			blackjack_payload.money = money - blackjack_bets
			finished = true								
		} else if(player && player.win){
			blackjack_status = false
			blackjack_payload.money = money + blackjack_bets
			blackjack_payload.status = 'win'
			finished = true
		}

		if(finished && typeof props.getResults === "function"){
			props.getResults(blackjack_payload)
		}
	}
}

var blackjack_data = null
var blackjack_bets = 0
var blackjack_status = false
function Blackjack(props){
	const {page, user, socket, settings} = props
	const {lang} = settings
	let game = page.game
	let money = user.money ? decryptData(user.money) : 0
	let [startGame, setStartGame]= useState(false)
    let dispatch = useDispatch()

	let clear = function(bet){
		blackjack_bets = bet		
		if(bet > 0 && blackjack_status){			
			let blackjack_payload = {
				uuid: user.uuid,
				game,
				status: 'lose',
				bet,
				money: money - bet
			}
			props.results(blackjack_payload)
		}
	}
	let getResults = function(payload){
		props.results(payload)
		setStartGame(false)
	}
    let options = {...props, dispatch, getResults, clear}
    let my_blackjack = new blackjack_game(options)

    function ready(){
        if(my_blackjack && document.getElementById("blackjack_canvas")){
            my_blackjack.ready()
        }
    }	

    useEffect(() => {
        ready()
        $(window).resize(function(){
			ready()
		})
		return () => {
			if(my_blackjack){
				clear(blackjack_bets) // if the user leaves the game, if he bet, he will lose the bets
				my_blackjack = null	
				blackjack_data = null
				blackjack_bets = 0
				blackjack_status = false	
			}
		}
    }, [])

    useEffect(() => {
		const handleBlackjackRead = function(data) {
            if(my_blackjack && data){
				if(data.action === "start" || data.action === "hit" || data.action === "stand" || data.action === "double_down"  || data.action === "surrender"){
					my_blackjack.action(data)
				} else {
					//it means it must be an error
					let payload = {
						open: true,
						template: "error",
						title: "error",
						data: translate({lang: lang, info: data.action})
					}
					dispatch(changePopup(payload))
				}
				
            }
        }
		socket.on('blackjack_read', handleBlackjackRead)
		return () => {
            socket.off('blackjack_read', handleBlackjackRead)
        }
    }, [socket])

    function choice(type){		
        if(type === "start" || type === "hit" || type === "stand" || type === "double_down"  || type === "surrender"){
            let blackjack_payload_server = {
                uuid: user.uuid,
                room: getRoom(game),
                action: type,
                bet: blackjack_bets
            }
			let payload = null
            switch (type) {
                case "start":
					if(blackjack_bets === 0){
						payload = {
							open: true,
							template: "error",
							title: "error",
							data: translate({lang: lang, info: "no_bets"})
						}
						dispatch(changePopup(payload))
					} else {
						if(my_blackjack){
							if(!blackjack_status){
								socket.emit('blackjack_send', blackjack_payload_server)
								blackjack_status = true
								setStartGame(true)
							}
						}
					}
                    break
                case "hit":	
                    if(my_blackjack){
                        if(blackjack_status){
							blackjack_payload_server.players = blackjack_data.players
                            socket.emit('blackjack_send', blackjack_payload_server)
                        }
                    }
                    break	
                case "stand":				
                    if(my_blackjack){
                        if(blackjack_status){
							blackjack_payload_server.players = blackjack_data.players
                            socket.emit('blackjack_send', blackjack_payload_server)
                        }
                    }
                    break
				case "double_down":	//hits once then immediately stands after doubling the bet		
                    if(my_blackjack){
                        if(blackjack_status){
							blackjack_payload_server.players = blackjack_data.players
							blackjack_bets = blackjack_bets * 2
							blackjack_payload_server.bet = blackjack_bets
                            socket.emit('blackjack_send', blackjack_payload_server)
                        }
                    }
                    break
				case "surrender":			
                    if(my_blackjack){
                        if(blackjack_status){	
							blackjack_status = false
                            let blackjack_payload = {
								uuid: user.uuid,
								game: game,
								money: money - blackjack_bets,
								status: "lose",
								bet: Math.round(blackjack_bets/2) //when you surrender you lose half your stake. The amount can only be interger
							}
							if(typeof props.results === "function"){
								props.results(blackjack_payload)
								setStartGame(false)
							}
                        }
                    }
                    break
            }
			if(payload){
				dispatch(changePopup(payload))
			}
        }		
	}

    function updateBets(x){
        blackjack_bets = x
    }

    return <div className="game_container blackjack_container">
        <canvas id="blackjack_canvas" />
        <GameBoard template="blackjack" {...props} startGame={startGame} choice={(e)=>choice(e)} updateBets={(e)=>updateBets(e)} />
		<div className="page_exit">
			<div className="tooltip">
				<Button 
					type="button"
					className="mybutton round button_transparent shadow_convex"
					onClick={()=>props.handleHandleExit()}
				><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
				<span className="tooltiptext">{translate({lang: lang, info: "back"})}</span>
			</div>
		</div>
	</div>
}

export default Blackjack