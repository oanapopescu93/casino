import React, { useEffect } from 'react'
import { translate } from '../../../../translations/translate'
import { draw_rect } from '../../../../utils/games'
import { decryptData } from '../../../../utils/crypto'

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
	self.text_bg = config.text_bg
	self.font_bold_10 = config.font_bold_10
	self.font_bold_12 = config.font_bold_12	
    self.space_between_cards = config.space_between_cards
	
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

		let header_x = self.x+self.player_nr[0]
		let header_y = self.y - self.player_nr[0]
		let header_width = self.width-self.player_nr[0]
		let header_height = self.player_nr[1]
		let header_width_text = self.x + self.width/2 + self.player_nr[0]/2
		let header_height_text = self.y - 5
		if(self.id === -1){
			//dealer
			header_x = self.x
			header_width = self.width
			header_width_text = self.x + self.width/2
		}

		ctx.beginPath()
		ctx.fillStyle = self.text_bg
		ctx.rect(header_x, header_y, header_width, header_height)
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
		ctx.fillText(value_hand, header_width_text, header_height_text)
		ctx.closePath()
	}

	self.draw_card_number = function(ctx, text, x, y, w){	
		ctx.beginPath()
		ctx.fillStyle = self.text_bg
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
				switch (hand[i].Suit){ 					
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
				switch (hand[i].Value){
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
				ctx.drawImage(img[img_index].src, 0, 0, size.width, size.height, x + i * self.space_between_cards, y + i * self.space_between_cards + space, w, h)
			}
		}
	}
}

function blackjack_game(props){
    let self = this	
    let images = props.images ? props.images : []
	let canvas
	let ctx	
	let card_list = []
	let card_base = {}
	let card = {}
	let card_img = {width: 237, height: 365}
	let player_nr = [20, 20]
    let space_between_cards = 12
	let howManyPlayers = props.howManyPlayers ? props.howManyPlayers : 5
    let blackjack_data = props.gameData ? props.gameData : null

	let theme = props.settings.theme
    let text_color = "#b39800"
    let text_bg = "#fff7cc"
    switch(theme){
		case "purple":
            text_color = "#3e0d3f"
            text_bg = "#ffccd5"
			break
		case "black":
            text_color = "#0f3e0f"
            text_bg = "#ccffcc"
			break
		case "blue":
			text_color = "#324A63"
            text_bg = "#ffe6cc"
			break
		case "green":
		default:
            text_color = "darkgreen"
            text_bg = "#fff7cc"
			break
	}

    this.ready = function(){
		self.draw()
	}

    this.draw = function(){
		self.createCanvas()
        self.draw_background()
        self.create_cards()
        self.draw_cards()
	}

	this.createCanvas = function() {
		canvas = document.getElementById("blackjack_canvas")
		ctx = canvas.getContext("2d")
	
		// Default canvas and card settings
		canvas.width = 740
		canvas.height = 460
		card_base = {
			x: 20, 
			y: 260, 
			width: 120, 
			height: 180, 
			fillStyle: 'transparent', 
			lineWidth: 2, 
			strokeStyle: text_bg, 
			dealer_y: 40
		}
		card = { width: 100, height: 150 }
		player_nr = [20, 20]
        space_between_cards = 12
	
		if (window.innerWidth <= 800 || window.innerHeight <= 600) {
			// Big
			canvas.width = 620
			canvas.height = 400
			card_base = {
				x: 20, 
				y: 240, 
				width: 100, 
				height: 150, 
				fillStyle: 'transparent', 
				lineWidth: 2, 
				strokeStyle: text_bg, 
				dealer_y: 40
			}
			card = { width: 80, height: 120 }
			player_nr = [20, 20]
            space_between_cards = 12
		}
	
		if (window.innerWidth <= 768 || window.innerHeight <= 600) {
			// Medium
			canvas.width = 550
			canvas.height = 300
			card_base = {
				x: 5, 
				y: 160, 
				width: 80, 
				height: 120, 
				fillStyle: 'transparent', 
				lineWidth: 1, 
				strokeStyle: text_bg, 
				dealer_y: 20
			}
			card = { width: 60, height: 90 }
			player_nr = [12, 12]
            space_between_cards = 12
		}

        if (window.innerWidth <= 600 || window.innerHeight <= 480) {
			// Medium
			canvas.width = 400
			canvas.height = 250
			card_base = {
				x: 5, 
				y: 140, 
				width: 70, 
				height: 95, 
				fillStyle: 'transparent', 
				lineWidth: 1, 
				strokeStyle: text_bg, 
				dealer_y: 20
			}
			card = { width: 43, height: 60 }
			player_nr = [12, 12]
            space_between_cards = 9
		}
	
		if (window.innerWidth <= 480 || window.innerHeight <= 320) {
			// Small
			canvas.width = 300
			canvas.height = 210
			card_base = {
				x: 5, 
				y: 120, 
				width: 46, 
				height: 70, 
				fillStyle: 'transparent', 
				lineWidth: 1, 
				strokeStyle: text_bg, 
				dealer_y: 20
			}
			card = { width: 33, height: 50 }
			player_nr = [12, 12]
            space_between_cards = 7
		}
	}

    this.draw_background = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

    this.create_cards = function(){
        card_list=[]

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
			text: text_color,
			text_bg,
			font_bold_12: 'bold 10px sans-serif',
			font_bold_14: 'bold 12px sans-serif',
            space_between_cards
		}))	

		// create players
		let a = 0
		let b = 0
		for(let i=0 ;i < howManyPlayers; i++){
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
				text: text_color,
				text_bg: text_bg,
				font_bold_12: 'bold 10px sans-serif',
				font_bold_14: 'bold 12px sans-serif',
                space_between_cards
			}))
		}
	}

	this.draw_cards = function(){        
        for(let i in card_list){
            card_list[i].draw_box(ctx)
            if(blackjack_data){                
                card_list[i].show_cards(ctx, blackjack_data)
            }
        }
	}

    this.action = function(){
		blackjack_data = props.gameData
        self.draw()
        self.check_win_lose()
    }

    this.check_win_lose = function(){        
        if(blackjack_data && blackjack_data.game_end){
            let index = blackjack_data.players.findIndex((x) => x.uuid === props.user.uuid)
			let player = blackjack_data.players[index]
            
            let game = null	
            if(props.page && props.page.game){
                game = props.page.game
            }
            let money = props.user.money ? decryptData(props.user.money) : 0		

            let blackjack_payload = {
                uuid: props.user.uuid,
                game: game,
                status: 'lose',
                bet: props.bets,
                money: money - props.bets
            }
            
            let result = blackjack_data.result
            
            if(result && result.player && result.player.uuid === player.uuid){
                blackjack_payload.status = 'win'
                blackjack_payload.money = money + props.bets
            }

            console.log(blackjack_payload, blackjack_data)
            //props.getResults(blackjack_payload)
        }
	}
}

function BlackjackGame(props){
	const {settings, images, gameData, width} = props
	const {lang} = settings
    
    let options = {...props}
    let my_blackjack = new blackjack_game(options)

    function ready(){
        if(my_blackjack && document.getElementById("blackjack_canvas")){
            my_blackjack.ready()
        }
    }

	useEffect(() => {
        if(images){
            ready()
        }
    }, [images])

    useEffect(() => {
        if(my_blackjack){
            my_blackjack.action()
        }
    }, [gameData])

    useEffect(() => {
        ready()
    }, [width])

    return <>
        <p>{translate({lang: lang, info: "under_construction"})}</p>
        <canvas id="blackjack_canvas" />
    </>
}

export default BlackjackGame