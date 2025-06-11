import React, { useEffect } from 'react'
import { translate } from '../../../../translations/translate'
import { draw_rect, getMousePos, isInside } from '../../../../utils/games'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarrot } from '@fortawesome/free-solid-svg-icons'
import $ from "jquery"

function Card(config){
	let self = this

    self.id = config.id
    self.uuid = config.uuid
    self.user = config.user
    self.type = config.type
    self.x = config.x
    self.y = config.y
    self.width = config.width
    self.height = config.height
    self.card = config.card //The size of the clipped image
    self.card_img = config.card_img //The size of the image to use
    self.images = config.images
    self.text_color = config.text_color
    self.text_bg = config.text_bg
    self.text_font = config.text_font
    self.text_x = config.text_x
    self.text_y = config.text_y
    self.evaluateHand = config.evaluateHand
    self.hand = config.hand
    self.fold = config.fold
    self.bet = config.bet
    self.last_choice = config.last_choice
    self.selectedCards = []
    self.canvas = config.canvas
    self.ctx = config.ctx
    self.template = config.template
    self.space = config.space

	self.show_cards = ()=>{
        if(self.id !== -1){
            //player
            let title = self.user === "player" ? "you" : self.user
            if(self.bet > 0){
                title = title + " (Bet: " + self.bet + ")"
            } else if(self.last_choice){
                title = title + " (" + self.last_choice + ")"
            }

            if(self.uuid){
                //user
                let cards_number = self.hand.length
                let hand_length = (cards_number-1) * self.card.width + (cards_number-2) * self.space
                self.draw_card(self.x - hand_length/2, self.y, self.card.width, self.card.height, self.card_img, self.hand)
                self.draw_card_text(title, self.text_x - hand_length/2, self.text_y, 90, 12)
            } else {
                //bot                
                self.draw_card(self.x, self.y, self.card.width, self.card.height, self.card_img, self.hand)
                self.draw_card_text(title, self.text_x, self.text_y, 90, 12)
            }
        } else {
            //dealer
            if(self.template !== "poker_5_card_draw"){ //in texas hold'em we have community cards, in 5 card draw we don't
                let cards_number = self.hand.length
                let hand_length = (cards_number - 1) * self.card.width + (cards_number - 2) * self.space
                self.draw_card(self.x - hand_length/2, self.y, self.card.width, self.card.height, self.card_img, self.hand)
            }
        }
			
	}

	this.draw_card = (x, y, w, h, size, hand)=>{
		let index = 0
        if(self.fold){ //if the player folded, his cards will be grey
            self.ctx.filter = 'grayscale(1)'
        }

		for(let i in hand){		
            switch (hand[i].Suit) {
                case "Hearts":
                    index = 1		
                    break				
                case "Spades":
                    index = 14		
                    break
                case "Diamonds":
                    index = 27	
                    break
                case "Clubs":
                    index = 40							
                    break
                default:
                    break
            }		  
            switch (hand[i].Value) {
                case "A":
                    index = index + 0			
                    break
                case "2":
                    index = index + 1					
                    break
                case "3":
                    index = index + 2							
                    break
                case "4":	
                    index = index + 3				
                    break
                case "5":
                    index = index + 4					
                    break
                case "6":
                    index = index + 5						
                    break
                case "7":
                    index = index + 6				
                    break
                case "8":
                    index = index + 7							
                    break
                case "9":
                    index = index + 8			
                    break
                case "10":
                    index = index + 9					
                    break
                case "J":
                    index = index + 10				
                    break
                case "Q":	
                    index = index + 11	
                    break
                case "K":
                    index = index + 12					
                    break
                default:
                    break		
            }

            let isSelected = false
            if(self.template !== "poker_5_card_draw" && self.selectedCards.length > 0){
                isSelected = self.selectedCards.includes(i)
            }
            
            if(self.id !== -1){
                //players
                if(self.uuid){
                    //player
                    let cardY = y
                    if(isSelected){
                        cardY = cardY + self.space
                    }           
                    self.ctx.drawImage(self.images[index].src, 0, 0, size.width, size.height, x + i * (self.space + w), cardY, w, h)
                    self.updateHand(i, x + i * (self.space + w), y, w, h)

                    if(isSelected){                        
                        draw_rect(self.ctx, x + i * (self.space + w), cardY, w, h, "transparent", 3, "red")
                    } 
                } else {
                    //bots
                    self.ctx.drawImage(self.images[index].src, 0, 0, size.width, size.height, x + i * self.space, y, w, h)
                    self.updateHand(i, x + i * self.space, y, w, h)
                }
            } else {
                //dealer
                self.ctx.drawImage(self.images[index].src, 0, 0, size.width, size.height, x + i * (self.space + w), y, w, h)
                self.updateHand(i, x + i * (self.space + w), y, w, h)
            }
        }

        self.ctx.filter = 'grayscale(0)'
	}

    self.draw_card_text = (text, x, y, w, h)=>{
        self.ctx.font = self.text_font
        const textWidth = self.ctx.measureText(text).width
        const adjustedWidth = Math.max(w, textWidth + 10)

        // Draw the box
		self.ctx.beginPath()
        self.ctx.fillStyle = self.text_bg
        self.ctx.fillRect(x, y, adjustedWidth, h)
        self.ctx.closePath()

        // Draw the text
        self.ctx.beginPath();
        self.ctx.fillStyle = self.text_color
        self.ctx.textBaseline = "top"
        self.ctx.fillText(text, x + 5, y)
        self.ctx.closePath()
	}

    self.updateHand = (i, x, y, w, h)=>{
        self.hand[i].x = x
        self.hand[i].y = y
        self.hand[i].width = w
        self.hand[i].height = h
    }

    self.updateSelected = (x)=>{ 
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
    const {settings, user, template, gameData, images, smallBlind, handleShowdown, getCardList} = props
    const {theme} = settings

    let canvas
	let ctx
    
    let card_list = [] 
	
	let card = {}
	let card_img = {width: 237, height: 365}
    let card_base = {width: 120, height: 180, space: 35}
    let space = 12
    let positions = []
    let how_many_players = 6
    let how_many_cards = 5     
    
    let tableColor01 = "darkgreen"
    let tableColor02 = "green"
    let text_color = "#b39800"
    let text_bg = "#fff7cc"
    switch(theme){
		case "purple":
			tableColor01 = "#7A1A7D"
            tableColor02 = "#3e0d3f"
            text_color = "#3e0d3f"
            text_bg = "#ffccd5"
			break
		case "black":
			tableColor01 = "#1e7b1e"
            tableColor02 = "#0f3e0f"
            text_color = "#0f3e0f"
            text_bg = "#ccffcc"
			break
        case "blue":
            tableColor01 = "#994d00"
            tableColor02 = "#663300"
            text_color = "#663300"
            text_bg = "#ffe6cc"
            break
		case "green":
		default:
			tableColor01 = "darkgreen"
            tableColor02 = "green"
            text_color = "darkgreen"
            text_bg = "#fff7cc"
			break
	}

    this.ready = ()=>{
        self.draw()
    }

    this.draw = ()=>{
        self.createCanvas()
        self.drawBackground()
        if(gameData){
            self.createCards()
            self.drawCards()
            self.handleClick()
        }
    }

    this.createCanvas = ()=>{
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
		} else if (window.innerWidth <= 1250){
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
			card = {width: 90, height: 130}
            card_base = {width: 100, height: 140, space: 25}
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
    this.drawBackground = ()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = tableColor01
        ctx.shadowBlur = 20
        ctx.shadowColor = "black"
        ctx.shadowOffsetY = 10
        ctx.beginPath()
        ctx.ellipse(canvas.width/2, canvas.height/2, canvas.width/2-2*card_base.space, canvas.height/2-2*card_base.space, 0, 0, 2 * Math.PI) 
        ctx.fill()

        ctx.shadowBlur = 0
        ctx.shadowColor = "transparent"
        ctx.shadowOffsetY = 0
        ctx.fillStyle = tableColor02
        ctx.beginPath()
        ctx.ellipse(canvas.width/2, canvas.height/2, canvas.width/2-4*card_base.space, canvas.height/2-3*card_base.space, 0, 0, 2 * Math.PI)
        ctx.fill()
    }

    this.createCards = ()=>{
        card_list = []
        // create dealer
        if(template !== "poker_5_card_draw" && gameData.dealer){
            card_list.push(new Card({
                id: -1,
                type: 'dealer',
                x: canvas.width/2 - card.width/2, 
                y: canvas.height/2 - card.height/2, 
                width: positions[0].width, 
                height: positions[0].height, 
                card,
                card_img,
                images,
                space,
                hand: gameData.dealer.hand,
                bet: null,
                canvas,
                ctx,
            }))	
        }
        
        //players
        for(let i = 0; i < how_many_players; i++){
            if(positions[i] && gameData.players[i]){ 
                const {id, uuid, user, type, money, fold, bet, last_choice} = gameData.players[i]                        
                let evaluateHand = null
                if(gameData.players[i].uuid){                    
                    evaluateHand = gameData.players[i].evaluateHand
                } 
                let hand = []
                if(gameData.players[i].hand){
                    //the player with visible hands
                    hand = gameData.players[i].hand
                } else {
                    //the other players with hidden hands
                    switch(template){
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
                    id,
                    uuid,
                    user,
                    type, 
                    money,
                    x: positions[i].x, 
                    y: positions[i].y,
                    width: positions[i].width, 
                    height: positions[i].height, 
                    card,
                    card_img,
                    images,
                    space,
                    text_color,
                    text_bg,
                    text_font: 'bold 10px sans-serif',
                    text_x: positions[i].x,
                    text_y: positions[i].y - 2 * space,
                    evaluateHand,
                    hand,
                    fold: fold ? true : false,
                    bet,
                    last_choice,
                    canvas,
                    ctx,
                }))
            }
        }
    }
    this.drawCards = ()=>{
        for(let i in card_list){
            card_list[i].show_cards(template)
        }
    }

    this.handleClick = () => {        
        if(template === "poker_5_card_draw" && $('#poker_canvas') && gameData && gameData.action === "draw"){
            $('#poker_canvas').off('click').on('click', (event)=>{
                let mousePos = getMousePos(canvas, event)
                self.canvasClick(mousePos)
            })
            $('#poker_canvas').off('mousemove').on('mousemove', (event)=>{
                let mousePos = getMousePos(canvas, event)
                self.canvasHover(mousePos)
            })
        }
    }

    this.canvasClick = (mouse)=>{
        for(let i in card_list){
			let hand = card_list[i].hand
            if(card_list[i].uuid === user.uuid){
                for(let j in hand){
                    if(isInside(mouse, hand[j])){
                        card_list[i].updateSelected(j)
                        self.handleSelectedCard(i)
                    }
                }
            }
        }
    }
    this.canvasHover = (mouse)=>{
        let isHovering = false
        for (let i in card_list) {
            let hand = card_list[i].hand
            if (card_list[i].uuid === user.uuid) {
                for (let j in hand) {
                    if (isInside(mouse, hand[j])) {
                        isHovering = true
                        break
                    }
                }
            }
            if (isHovering) break
        }
        canvas.style.cursor = isHovering ? 'pointer' : 'default'
    }

    this.handleSelectedCard = (index)=>{
        self.drawBackground()
        self.drawCards()
        getCardList(card_list[index].selectedCards) 
    }

    this.action = ()=>{
        self.draw()
        if(gameData && gameData.action === "showdown"){
            self.check_win_lose()
        }
         
    }

    this.check_win_lose = ()=>{
        let winners = self.determineWinners()
        let player = gameData.players.filter((x)=>{
            return x.uuid === user.uuid
        })

        let bet = smallBlind
        let pot = gameData.pot
        let status = 'lose'

        if(player && player[0]){
            bet = player[0].bet > 0 ? player[0].bet : smallBlind
            const isPlayerInArray = winners.some(item => item.uuid === player[0].uuid)
            if(isPlayerInArray){
                status = "win"
            }
        }        
        handleShowdown({pot, bet, status})
    }

    this.determineWinners = () => {
        const {players, dealer, dealerHandStrength} = gameData

        // Add the dealer to the players array with a special ID and handStrength
        const allPlayers = [...players, {
            id: dealer.id,
            user: dealer.user,
            handStrength: dealerHandStrength,
            isDealer: true, // Flag to identify the dealer
            fold: false // Dealer cannot fold
        }]

        // Filter out folded players
        const activePlayers = allPlayers.filter(player => !player.fold)

            // Sort players by hand strength (descending order)
        activePlayers.sort((a, b) => b.handStrength.strength - a.handStrength.strength)

        let winners = [activePlayers[0]] // Initialize with the first player

        for (let i = 1; i < activePlayers.length; i++) {
            if (activePlayers[i].handStrength.strength === winners[0].handStrength.strength) {
                // Compare kickers
                let isTie = true
                for (let j = 0; j < winners[0].handStrength.info.Value.length; j++) {
                    const winnerKicker = winners[0].handStrength.info.Value.charCodeAt(j)
                    const currentKicker = activePlayers[i].handStrength.info.Value.charCodeAt(j)
                    if (currentKicker > winnerKicker) {
                        winners = [activePlayers[i]] // New winner
                        isTie = false
                        break
                    } else if (currentKicker < winnerKicker) {
                        isTie = false
                        break
                    }
                }
                if (isTie) {
                    winners.push(activePlayers[i]) // Add tied player to the winners array
                }
            } else {
                break // No tie, exit loop
            }
        }

        return winners
    }
}

function PokerGame(props){
    const {settings, gameData, smallBlind, width, images} = props
    const {lang} = settings

    let options = {...props}

    let my_poker = new poker_game(options)

    function ready(){
		if(my_poker && document.getElementById("poker_canvas")){
            my_poker.ready()
        }
	}

    useEffect(() => {
		if(images){
			ready()
		}
    }, [images, width])

    useEffect(() => {
		if(my_poker && gameData && document.getElementById("poker_canvas")){
			my_poker.action()
		}
    }, [gameData])
    
    return <div className="poker_canvas_container">
        {gameData && gameData.action === "preflop_betting" ? <div className="small_blind_container">
            <div className="small_blind">
                {translate({lang, info: "small_blind"})}: {smallBlind} <FontAwesomeIcon icon={faCarrot} />
            </div>
        </div> : null}
        {gameData && gameData.pot > 0 ? <div className="poker_pot_container">
            <div className="poker_pot">
                {translate({lang, info: "total_pot"})}: {gameData.pot} <FontAwesomeIcon icon={faCarrot} />
            </div>
        </div> : null}
        <canvas id="poker_canvas" />
    </div>
}

export default PokerGame