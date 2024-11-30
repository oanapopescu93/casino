import React, {useEffect} from 'react'
import { useDispatch} from 'react-redux'
import $ from 'jquery'
import { translate } from '../../../../translations/translate'
import { draw_rect, get_cards } from '../../../../utils/games'

function Card(config){
	let self = this
	self.type = config.type
	
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
	
	self.draw_box = function(ctx){
		//draw title	
		self.draw_card_text(ctx, self.type, self.x + self.width/2, self.y, self.player_nr[0])

		//draw rect where the cards will be
		draw_rect(ctx, self.x, self.y + 10, self.width, self.height, self.fillStyle, self.lineWidth, self.strokeStyle)	
	}	

	self.show_cards = function(ctx, data){		
		const {banker, player, value_banker, value_player} = data
		console.log(data, banker, player)
		//player
		self.draw_card(ctx, self.x, self.y, self.card.width, self.card.height, self.card_img, player)
		self.draw_card_text(ctx, value_player, self.x, self.y + self.width + 10)

		//banker
		self.draw_card(ctx, self.x, self.y, self.card.width, self.card.height, self.card_img, banker)
		self.draw_card_text(ctx, value_banker, self.x, self.y + self.width + 10)
	}

	self.draw_card_text = function(ctx, text, x, y){	
		ctx.beginPath()
		ctx.fillStyle = self.text_bg
		ctx.textAlign = "center"
		ctx.font = self.font_bold_14
		ctx.fillText(text, x, y)
		ctx.closePath()
	}

	this.draw_card = function(ctx, x, y, w, h, size, hand){
		console.log('draw_card ', hand)
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
			ctx.drawImage(img[img_index].src, 0, 0, size.width, size.height, x + i*12, y + i*12 + space, w, h)
		}
	}
}

function baccarat_game(props){
    let self = this	
    let canvas
    let ctx	

	let resize = 0
	let baccarat_data = null
	
	let card_list = []
	let card_base = {}
	let card = {}
	let card_img = {width: 237, height: 365}
	let player_nr = [20, 20]
	let images = []
	let items = get_cards()
    
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

    this.ready = function(r){
        self.createCanvas()

		if(r !== "resize"){ //first time entering
            let promises = []
            for(let i in items){				
                promises.push(self.preaload_images(items[i]))
            }
            Promise.all(promises).then(function(result){
                images = result
				self.draw_background()
				self.create_cards()
                self.draw_cards()
            })
        } else {
			self.draw_background()
            self.create_cards()
            self.draw_cards()
        }
    }

    this.createCanvas = function() {
		canvas = document.getElementById("baccarat_canvas")
		ctx = canvas.getContext("2d")
	
		// Default canvas and card settings
		canvas.width = 740
		canvas.height = 460
		card_base = {
			x: 20, 
			y: 40, 
			width: 120, 
			height: 180, 
			fillStyle: 'transparent', 
			lineWidth: 2, 
			strokeStyle: text_bg, 
		}
		card = { width: 100, height: 150 }
		player_nr = [20, 20]
	
		if (window.innerWidth <= 800 || window.innerHeight <= 600) {
			// Big
			canvas.width = 620
			canvas.height = 400
			card_base = {
				x: 20, 
				y: 40, 
				width: 100, 
				height: 150, 
				fillStyle: 'transparent', 
				lineWidth: 2, 
				strokeStyle: text_bg,
			}
			card = { width: 80, height: 120 }
			player_nr = [20, 20]
		}
	
		if (window.innerWidth <= 768 || window.innerHeight <= 400) {
			// Medium
			canvas.width = 400
			canvas.height = 260
			card_base = {
				x: 5, 
				y: 20, 
				width: 70, 
				height: 100, 
				fillStyle: 'transparent', 
				lineWidth: 1, 
				strokeStyle: text_bg,
			}
			card = { width: 60, height: 90 }
			player_nr = [12, 12]
		}
	
		if (window.innerWidth <= 480 || window.innerHeight <= 320) {
			// Small
			canvas.width = 300
			canvas.height = 210
			card_base = {
				x: 5, 
				y: 20, 
				width: 46, 
				height: 70, 
				fillStyle: 'transparent', 
				lineWidth: 1, 
				strokeStyle: text_bg, 
			}
			card = { width: 33, height: 50 }
			player_nr = [12, 12]
		}
	}

	this.preaload_images = function(item){
		return new Promise(function(resolve){
			let image = new Image()
			image.src = item.src
			image.addEventListener("load", function() {
				resolve({suit: item.suit, value: item.value, src: image})
			}, false)
		})
	}

	this.draw_background = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	this.create_cards = function(){
		let space = (canvas.width - (card_base.width*7 + card_base.x*6))/2
		
		//player
		card_list.push(new Card({
			type: 'player',
			x: space + 2 * (card_base.width + card_base.x), 
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
		}))

		//banker
		card_list.push(new Card({
			type: 'banker',
			x: space + 4 * (card_base.width + card_base.x), 
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
		}))
	}

	this.draw_cards = function(){
		if(baccarat_data){
			for(let i in card_list){
				card_list[i].draw_box(ctx)
				card_list[i].show_cards(ctx, baccarat_data)
			}
		} else {
			for(let i in card_list){
				card_list[i].draw_box(ctx)
			}
		}
	}


	this.check_win_lose = function(){
		
	}

	this.action = function(data){
		if(data.action){
			baccarat_data = data
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			if(data.action === "start"){
				resize = 0
			}		
			self.draw_cards()
			self.check_win_lose()
		}
    }
}

function BaccaratGame(props){
	const {settings, gameData, choice} = props
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
        ready()
        $(window).resize(function(){
			ready()
		})
		return () => {
			console.log('we will leave', choice)
		}
    }, [])

	useEffect(() => {        
		if(gameData && my_baccarat){
			my_baccarat.action(gameData)
		}
    }, [gameData])

    return <>
		<p>{translate({lang: lang, info: "under_construction"})}</p>
		<p>
			<span>{translate({lang: lang, info: "type"})}: {choice.type}</span>
			<span>{translate({lang: lang, info: "bet"})}: {choice.bet}</span>
		</p>
		<canvas id="baccarat_canvas" />
	</>
}

export default BaccaratGame