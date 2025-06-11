import React, {useEffect} from 'react'
import { useDispatch} from 'react-redux'
import { translate } from '../../../../translations/translate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarrot } from '@fortawesome/free-solid-svg-icons'

function Card(config){
	let self = this
	self.type = config.type
	self.name = config.name
	
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
	self.space_between_cards = config.space_between_cards	
	self.title = config.title
	self.images = config.images
	self.text = config.text
	self.text_bg = config.text_bg
	self.font = config.font
	self.lang = config.lang
	
	self.draw_title = (ctx)=>{
		self.draw_card_text(ctx, self.name, self.x + self.width/2, self.y - self.title[0], self.title[0])
	}	

	self.show_cards = (ctx, data, type)=>{		
		const {banker, player} = data
		let value_text = translate({lang: self.lang, info: "value"}) + ": "
		switch(type){
			case "banker":
				self.draw_card(ctx, self.x, self.y, self.card.width, self.card.height, self.card_img, banker.hand)
				self.draw_card_text(ctx, value_text + banker.value_hand, self.x + self.width/2, self.y + self.height + self.title[0], self.title[0])
				break
			case "player":
				self.draw_card(ctx, self.x, self.y, self.card.width, self.card.height, self.card_img, player.hand)
				self.draw_card_text(ctx, value_text + player.value_hand, self.x + self.width/2, self.y + self.height + self.title[0], self.title[0])
				break
		}		
	}

	self.draw_card_text = (ctx, text, x, y, h)=>{
		ctx.font = self.font
		const boxWidth = self.width + 5
		const boxHeight = h
		const boxX = x - boxWidth / 2
		const boxY = y - boxHeight / 2
		
		ctx.beginPath()
		ctx.fillStyle = self.text_bg
		ctx.fillRect(boxX, boxY, boxWidth, boxHeight)
		ctx.closePath()	
		
		ctx.beginPath()
		ctx.fillStyle = self.text
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.fillText(text, x, y)
		ctx.closePath()
	}

	this.draw_card = (ctx, x, y, w, h, size, hand)=>{
		let img = self.images
		let space = 5
		let img_index = 0
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

function baccarat_game(props){
    let self = this	
	const {settings, gameData, choice, images, page, user, money, endGame} = props
	const {lang, theme} = settings

    let canvas
    let ctx	
	
	let card_list = []
	let card_base = {}
	let card = {}
	let card_img = {width: 237, height: 365}
	let title = [20, 20]
	let space_between_cards = 16    
    
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

    this.ready = ()=>{
        self.createCanvas()
		self.draw_background()
		self.create_cards()
		self.draw_cards()
    }

    this.createCanvas = ()=>{
		canvas = document.getElementById("baccarat_canvas")
		ctx = canvas.getContext("2d")
		
		canvas.width = 600
		canvas.height = 300
		card_base = {
			x: 24,
			y: 50,
			width: 140,
			height: 210,
			fillStyle: 'transparent',
			lineWidth: 3,
			strokeStyle: text_bg,
		}
		card = { width: 120, height: 180 }
		title = [25, 25]
		space_between_cards = 16
	
		if (window.innerWidth <= 768 || window.innerHeight <= 480) {
			// Medium
			canvas.width = 450
			canvas.height = 300
			card_base = {
				x: 24,
				y: 50,
				width: 120,
				height: 180,
				fillStyle: 'transparent',
				lineWidth: 3,
				strokeStyle: text_bg,
			}
			card = { width: 96, height: 144 }
			title = [25, 25]
			space_between_cards = 16
		}
	
		if (window.innerWidth <= 480 || window.innerHeight <= 320) {
			// Small
			canvas.width = 300
			canvas.height = 200
			card_base = {
				x: 6,
				y: 25,
				width: 85,
				height: 140,
				fillStyle: 'transparent',
				lineWidth: 2,
				strokeStyle: text_bg,
			}
			card = { width: 72, height: 108 }
			title = [15, 15]
			space_between_cards = 12
		}
	}	

	this.preaload_images = (item)=>{
		return new Promise((resolve)=>{
			let image = new Image()
			image.src = item.src
			image.addEventListener("load", ()=>{
				resolve({suit: item.suit, value: item.value, src: image})
			}, false)
		})
	}

	this.draw_background = ()=>{
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	this.create_cards = ()=>{
		card_list = []
		let space = (canvas.width - (card_base.width*7 + card_base.x*6))/2
		
		//player
		card_list.push(new Card({
			type: 'player',
			name: translate({lang, info: 'player'}),
			x: space + 2 * (card_base.width + card_base.x), 
			y: card_base.y, 
			width: card_base.width, 
			height: card_base.height, 
			fillStyle: card_base.fillStyle, 
			lineWidth: card_base.lineWidth, 
			strokeStyle: card_base.strokeStyle, 
			card,
			card_img,
			space,
			space_between_cards,
			title,
			images,
			text: text_color,
			text_bg,
			font: 'bold 12px sans-serif',
			lang
		}))

		//banker
		card_list.push(new Card({
			type: 'banker',
			name: translate({lang, info: 'banker'}),
			x: space + 4 * (card_base.width + card_base.x), 
			y: card_base.y, 
			width: card_base.width, 
			height: card_base.height, 
			fillStyle: card_base.fillStyle, 
			lineWidth: card_base.lineWidth, 
			strokeStyle: card_base.strokeStyle, 
			card,
			card_img,
			space,
			space_between_cards,
			title,
			images,
			text: text_color,
			text_bg,
			font: 'bold 12px sans-serif',
			lang
		}))
	}

	this.draw_cards = ()=>{		
		if(gameData){
			for(let i in card_list){
				let type = card_list[i].type
				card_list[i].draw_title(ctx)
				card_list[i].show_cards(ctx, gameData, type)
			}
		} else {
			for(let i in card_list){
				card_list[i].draw_title(ctx)
			}
		}
	}

	this.action = ()=>{	
		self.draw_cards()
		self.check_win_lose()
    }

	this.check_win_lose = ()=>{
		if(!gameData){
			return
		}
		const {banker, player} = gameData
		if((player.win && banker.win) || (player.value_hand === banker.value_hand)){ 
			self.result("tie") // we have a tie
			return
		}
		if(player.win){ // player wins
			self.result("player")
			return
		}
		if(banker.win){ // banker wins
			self.result("banker")
			return
		}

		//check card values
		if(player.value_hand > banker.value_hand){
			self.result("player")
		} else {
			self.result("banker")
		}
	}

	this.result = (x)=>{
		let baccarat_payload = {
			uuid: user.uuid,
			game: page.game,
			status: 'lose',
			bet: choice.bet,
			money: money - choice.bet
		}

		if(x === choice.type){ // you chose well -> you won		
			baccarat_payload.money = money + choice.bet
			baccarat_payload.status = 'win'
		}
		
		setTimeout(()=>{
            endGame(baccarat_payload)
       	}, 1000)
	}
}

function BaccaratGame(props){
	const {settings, gameData, images, width, choice} = props
	const {lang} = settings

    let dispatch = useDispatch()

    let options = {...props, dispatch}

    let my_baccarat = new baccarat_game(options)

    function ready(){
		if(my_baccarat && document.getElementById("baccarat_canvas")){
            my_baccarat.ready()
        }
	}

    useEffect(() => {
		if(images && gameData){
			ready()
		}
    }, [images, gameData, width])

	useEffect(() => {
		if(my_baccarat && document.getElementById("baccarat_canvas")){
			my_baccarat.action()
		}
    }, [gameData])

    return <div className="baccarat_canvas_container">		
		<div className="baccarat_subtitles">
			{choice && choice.type ? <>
				<div>
					<p>{translate({lang, info: "bet_type"})}: </p>
					<p>{translate({lang, info: choice.type})}</p>
				</div>
				<div>
					<p>{translate({lang, info: "bet"})}: {choice.bet} <FontAwesomeIcon icon={faCarrot} /></p>
				</div>	
			</> : null}
		</div>
		<canvas id="baccarat_canvas" />
	</div>
}

export default BaccaratGame