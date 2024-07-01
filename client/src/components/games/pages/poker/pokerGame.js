import { draw_rect, getMousePos, get_cards, isInside } from '../../../../utils/games'
import { decryptData } from '../../../../utils/crypto'
import $ from "jquery"

function Card(config){
	let self = this
	self.id = config.id
    self.uuid = config.uuid
	self.name = config.name
	self.user = config.user
    self.props = config.props
	
	self.x = config.x
	self.y = config.y
	self.width = config.width
	self.height = config.height
	self.card = config.card //The size of the clipped image
	self.card_img = config.card_img //The size of the image to use
	self.images = config.images
    self.space = config.space
    self.text_color = config.text_color
    self.text_bg = config.text_bg
	self.text_font = config.text_font
    self.text_x = config.text_x
    self.text_y = config.text_y

    self.hand = config.hand
    self.selectedCards = []
    self.fold = config.fold ? config.fold : false
    self.bet = config.bet ? config.bet : 0
    self.last_choice = config.last_choice ? config.last_choice : null

	self.show_cards = function(ctx, data, template){
        if(self.id !== -1){
            //player
            if(self.fold){ //if the player folded, his cards will be grey
                ctx.filter = 'grayscale(1)'
            } 

            let title = self.user
            if(self.bet > 0){
                title = title + " (Bet: " + self.bet + ")"
            } else if(self.last_choice){
                title = title + " (" + self.last_choice + ")"
            }

            if(self.uuid === self.props.user.uuid){
                //user
                let cards_number = self.hand.length
                let hand_length = (cards_number-1) * self.card.width + (cards_number-2) * self.space
                self.draw_card(ctx, self.x-hand_length/2, self.y, self.card.width, self.card.height, self.card_img, self.hand)
                self.draw_card_text(ctx, title, self.text_x-hand_length/2, self.text_y, 90, 12)
            } else {
                //bot
                self.draw_card(ctx, self.x, self.y, self.card.width, self.card.height, self.card_img, self.hand)
                self.draw_card_text(ctx, title, self.text_x, self.text_y, 90, 12)
            }

            ctx.filter = 'grayscale(0)'
        } else {
            //dealer
            if(template !== "poker_5_card_draw"){ //in texas hold'em we have community cards, in 5 card draw we don't
                let cards_number = data.dealer.hand.length
                let hand_length = (cards_number-1) * self.card.width + (cards_number-2) * self.space
                self.draw_card(ctx, self.x-hand_length/2, self.y, self.card.width, self.card.height, self.card_img, data.dealer.hand, "dealer")
            }
        }
			
	}

	this.draw_card = function(ctx, x, y, w, h, size, hand){
		let img = self.images
		let img_index = 0
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
                default:
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
                default:
                    break		
            }
            
            if(self.id !== -1){
                //player
                if(self.uuid === self.props.user.uuid){
                    ctx.drawImage(img[img_index].src, 0, 0, size.width, size.height, x + i * (self.space + w), y, w, h)
                    self.updateHand(i, x + i * (self.space + w), y, w, h)
                } else {
                    ctx.drawImage(img[img_index].src, 0, 0, size.width, size.height, x + i * self.space, y, w, h)
                    self.updateHand(i, x + i * self.space, y, w, h)
                }
            } else {
                //dealer
                ctx.drawImage(img[img_index].src, 0, 0, size.width, size.height, x + i * (self.space + w), y, w, h)
                self.updateHand(i, x + i * (self.space + w), y, w, h)
            }
        }
	}

    self.draw_card_text = function(ctx, text, x, y, w, h){	
		ctx.beginPath()
		ctx.fillStyle = self.text_bg
        ctx.fillRect(x, y, w, h)
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = self.text_color
		ctx.font = self.text_font
		ctx.fillText(text, x+5, y+8)
		ctx.closePath()
	}

    self.updateHand = function(i, x, y, w, h){
        self.hand[i].x = x
        self.hand[i].y = y
        self.hand[i].width = w
        self.hand[i].height = h
    }

    self.updateSelected = function(x){ 
        let index = self.selectedCards.findIndex((i) => i === x)
        if(index === -1){
            self.selectedCards.push(x)
        } else {
            self.selectedCards.splice(index, 1)
        }
    }
}

export const poker_game = function(props){
    let self = this
    let images = []

	let canvas
	let ctx

    let poker_data = null
    let card_list = [] 
	
	let card = {}
	let card_img = {width: 237, height: 365}
    let card_base = {width: 120, height: 180, space: 35}
    let space = 12
    let positions = []
    let how_many_players = 6
    let how_many_cards = 5
    
    let items = get_cards()
    let game_status = false

    this.ready = function(r){
        self.createCanvas()
        self.drawBackground()
        self.handleClick()
        if(r !== "resize"){ //first time entering
            let promises = []
            for(let i in items){				
                promises.push(self.preaload_images(items[i]))
            }
            Promise.all(promises).then(function(result){
                images = result
            })
        } else {
            self.create_cards()
            self.draw_cards()
        }
    }

    this.action = function(data){
		if(data && data.action){
            poker_data = data
            self.drawBackground()
            if(data.action !== "fold"){
                self.create_cards()
                self.draw_cards()
                game_status = true
                if(data.action === "showdown"){
                    self.showdown()
                }
            } else {
                self.fold()
            }
		}
    }

    this.createCanvas = function(){		
        canvas = document.getElementById("poker_canvas")
		ctx = canvas.getContext("2d")	

		if(window.innerWidth <= 480){
            card = {width: 33, height: 50}
            card_base = {width: 46, height: 70, space: 25}
            space = 8
			if(window.innerHeight < window.innerWidth){
				//extra small landscape				
				canvas.width = 400
				canvas.height = 220	
			} else {
				//extra small portrait
				canvas.width = 300
				canvas.height = 220
			}			
		} else if (window.innerWidth <= 960){
            card = {width: 40, height: 60}
            card_base = {width: 53, height: 80, space: 25}
            space = 10
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 480
				canvas.height = 240	
			} else {
				//small portrait
				canvas.width = 300
				canvas.height = 240
			}
		} else if (window.innerWidth <= 1200){
			//big
			canvas.width = 900
			canvas.height = 450			
			card = {width: 70, height: 105}
            card_base = {width: 120, height: 180, space: 25}
            space = 10
		} else {
			//extra big
			canvas.width = 1200
			canvas.height = 500			
			card = {width: 70, height: 105}
            card_base = {width: 80, height: 120, space: 25}
            space = 10
            
		}

        positions = [
            {x: canvas.width/2 - card.width/2, y: canvas.height - card.height - card_base.space, width: card_base.width, height: card_base.height}, //bottom            
            {x: card_base.space, y: canvas.height/2 - card.height/2 + (card.height/2 + card_base.space), width: card_base.width, height: card_base.height}, //left-bottom
            {x: card_base.space, y: (canvas.height - card.height)/2 - (card.height/2 + card_base.space), width: card_base.width, height: card_base.height}, //left-top
            {x: canvas.width/2 - card.width/2, y: card_base.space, width: card_base.width, height: card_base.height}, //top
            {x: canvas.width - card.width - 2 * card_base.space, y: (canvas.height - card.height)/2 - (card.height/2 + card_base.space), width: card_base.width, height: card_base.height}, //right-top
            {x: canvas.width - card.width - 2 * card_base.space, y: (canvas.height - card.height)/2 + (card.height/2 + card_base.space), width: card_base.width, height: card_base.height}, //right-top
        ] 
	}

    this.drawBackground = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "darkgreen"
        ctx.shadowBlur = 20
        ctx.shadowColor = "black"
        ctx.shadowOffsetY = 10
        ctx.beginPath()
        ctx.ellipse(canvas.width/2, canvas.height/2, canvas.width/2-2*card_base.space, canvas.height/2-2*card_base.space, 0, 0, 2 * Math.PI) 
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.shadowColor = "transparent"
        ctx.shadowOffsetY = 0
        ctx.fillStyle = "green"
        ctx.beginPath()
        ctx.ellipse(canvas.width/2, canvas.height/2, canvas.width/2-4*card_base.space, canvas.height/2-3*card_base.space, 0, 0, 2 * Math.PI)
        ctx.fill()
    }

    this.handleClick = function(){
        if(props.template === "poker_5_card_draw" && $('#poker_canvas')){
            $('#poker_canvas').off('click').on('click', function(event) {
                let mousePos = getMousePos(canvas, event)
                self.canvas_click(mousePos)
            })
        }		
    }

    this.canvas_click = function(mouse){ 
        for(let i in card_list){
			let hand = card_list[i].hand
            if(card_list[i].uuid === props.user.uuid){
                for(let j in hand){
                    if(isInside(mouse, hand[j])){
                        card_list[i].updateSelected(j) 
                        self.drawBackground()
                        self.draw_cards()
                        let selectedCards = card_list[i].selectedCards
                        for(let k in selectedCards){
                            let t = selectedCards[k]
                            let card = card_list[i].hand[t]
                            draw_rect(ctx, card.x, card.y, card.width, card.height, "transparent", 3, "red")
                        }
                    }
                }
                if(typeof props.getCardList === "function"){
                    props.getCardList(card_list[i].selectedCards)
                }
            }
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

    this.create_cards = function(){
        card_list = []
        if(poker_data){
            // create dealer
            if(props.template !== "poker_5_card_draw" && poker_data.dealer){
                card_list.push(new Card({
                    id: -1,
                    name: 'dealer',
                    x: canvas.width/2 - card.width/2, 
                    y: canvas.height/2 - card.height/2, 
                    width: positions[0].width, 
                    height: positions[0].height, 
                    card: card,
                    card_img: card_img,
                    images: images,
                    space: space,
                    hand: poker_data.dealer.hand,
                    bet: null
                }))	
            }
            
            //players
            for(let i = 0; i < how_many_players; i++){
                if(positions[i] && poker_data.players[i]){ 
                    let uuid = null 
                    let user = 'player_'+i
                    let evaluateHand = null
                    if(poker_data.players && poker_data.players[i] && props.user.uuid === poker_data.players[i].uuid){
                        uuid = poker_data.players[i].uuid
                        user = poker_data.players[i].user ? decryptData(poker_data.players[i].user) : "-"
                        evaluateHand = poker_data.players[i].evaluateHand
                    } 
                    let hand = []
                    if(poker_data.players[i].hand){
                        //the player with visible hands
                        hand = poker_data.players[i].hand
                    } else {
                        //the other players with hidden hands
                        switch(props.template){
                            case "poker_texas_holdem":
                                how_many_cards = 2
                                break
                            default: //ex: poker_5_card_draw
                                how_many_cards = 5
                        }

                        hand = []
                        for(let i = 0; i < how_many_cards; i++){
                            hand.push({Value: null})
                        }
                    }
                    card_list.push(new Card({
                        id: i,
                        name: 'player',
                        uuid: uuid,
                        user: user,
                        x: positions[i].x, 
                        y: positions[i].y,
                        width: positions[i].width, 
                        height: positions[i].height, 
                        card: card,
                        card_img: card_img,
                        images: images,
                        space: space,
                        text_color: "black",
                        text_bg: "white",
                        text_font: 'bold 10px sans-serif',
                        text_x: positions[i].x,
                        text_y: positions[i].y - 2*space,
                        props: props,
                        evaluateHand: evaluateHand,
                        hand: hand,
                        fold: poker_data.players[i].fold ? true : false,
                        bet: poker_data.players[i].bet,
                        last_choice: poker_data.players[i].last_choice,
                        type: poker_data.players[i].type
                    }))
                }
            }
        }
	}

    this.draw_cards = function(){
		if(poker_data){
			for(let i in card_list){
				card_list[i].show_cards(ctx, poker_data, props.template)
			}
		}
	} 

    this.fold = function(){
        let player = poker_data.players.filter(function(x){
            return x.uuid === props.user.uuid
        })
        if(player && player[0] && player[0].bet){
            game_status = false

            let bet = player[0].bet
            let pot = poker_data.pot
            let status = 'lose'
            let game = props.page.game
            let money = props.user.money ? decryptData(props.user.money) : 0 
            let money_history = money - bet 

            let poker_payload = {
                uuid: props.user.uuid,
                game,
                money: money_history,
                status,
                bet,
                pot
            }
            
            if(typeof props.getResults === "function"){
                props.getResults(poker_payload)
            }
        }
    }

    this.get_status_game = function(){
        return game_status
    }

    this.leave = function(){
        self.fold() // if the user leaves the game, if he bet, he will lose the bets
    }

    this.showdown = function(){
        let winner = self.determineWinner(poker_data.players)
        let player = poker_data.players.filter(function(x){
            return x.uuid === props.user.uuid
        })
        
        if(player && player[0] && player[0].bet){
            game_status = false

            let bet = player[0].bet
            let pot = poker_data.pot
            let game = props.page.game
            let money = props.user.money ? decryptData(props.user.money) : 0 
            let money_history = money

            let status = 'lose'
            if(winner.uuid === props.user.uuid){
                status = 'win'
                money_history = money_history + pot
            } else {
                money_history = money_history - bet
            }

            let poker_payload = {
                uuid: props.user.uuid,
                game,
                money: money_history,
                status,
                bet,
                winner,
                pot
            }
            
            if(typeof props.getResults === "function"){
                props.getResults(poker_payload)
            }
        }
    }

    this.determineWinner = function(players){
        players = players.filter(player => !player.fold) // Filter out folded players
        players.sort((a, b) => b.handStrength.strength - a.handStrength.strength)
        let winners = [players[0]] // Initialize with the first player
        for (let i = 1; i < players.length; i++){
            if (players[i].handStrength.strength === winners[0].handStrength.strength) {
                // Compare kickers
                let isTie = true
                for (let j = 0; j < winners[0].handStrength.info.Value.length; j++) {
                    const winnerKicker = winners[0].handStrength.info.Value.charCodeAt(j)
                    const currentKicker = players[i].handStrength.info.Value.charCodeAt(j)
                    if (currentKicker > winnerKicker) {
                        winners.push(players[i])
                        isTie = false
                        break
                    } else if (currentKicker < winnerKicker) {
                        isTie = false
                        break
                    }
                }
                if (isTie) {
                    winners.push(players[i]) // Add tied player to the winners array
                }
            } else {
                break // No tie, exit loop
            }
        }
        return winners
    }
}