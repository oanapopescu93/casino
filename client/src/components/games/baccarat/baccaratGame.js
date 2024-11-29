import React, {useEffect} from 'react'
import { useDispatch} from 'react-redux'
import { translate } from '../../../translations/translate'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import $ from 'jquery'
import Header from '../../partials/header'

function Card(config){
	let self = this
	self.id = config.id
	self.user = config.user
	
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
		
	}	

	self.show_cards = function(ctx, data){
			
	}

	self.show_cards_value = function(ctx, hand){
		
	}

	self.draw_card_number = function(ctx, text, x, y, w){	
		
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
				ctx.drawImage(img[img_index].src, 0, 0, size.width, size.height, x + i*12, y + i*12 + space, w, h)
			}
		}
	}
}

function baccarat_game(props){
    let self = this	
    let canvas
    let ctx    
	const dispatch = props.dispatch	

    let start_game = false

	let font_bold_10 = 'bold 10px sans-serif'
	let font_bold_12 = 'bold 12px sans-serif'
	let font_bold_14 = 'bold 14px sans-serif'
    
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
        self.createCanvas()		
        self.start()
    }

    this.createCanvas = function(){	
		canvas = document.getElementById("baccarat_canvas")	
		ctx = canvas.getContext("2d")
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape
				canvas.width = 260
				canvas.height = 260
			} else {
				//small portrait
				canvas.width = 250
				canvas.height = 250			
			}
			font_bold_10 = 'bold 8px sans-serif'
			font_bold_12 = 'bold 10px sans-serif'
			font_bold_14 = 'bold 12px sans-serif'
		} else {
			//big
			canvas.width = 480
			canvas.height = 480
			
			font_bold_10 = 'bold 10px sans-serif'
			font_bold_12 = 'bold 12px sans-serif'
			font_bold_14 = 'bold 14px sans-serif'
		}
	}

    this.start = function(){			
		ctx.clearRect(0,0, canvas.width, canvas.height)

        ctx.font = font_bold_10
		ctx.shadowColor = "black"
	}
}

function BaccaratGame(props){
    const {page, settings} = props
	const {lang, theme} = settings

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
			console.log('we will leave')
		}
    }, [])

    return <div className="game_box">
        <Header template={"game"} details={page} lang={lang} theme={theme}/>        
        <p>{translate({lang: lang, info: "under_construction"})}</p>
        <canvas id="baccarat_canvas" />
        <div className="button_action_group baccarat_buttons_container">
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

export default BaccaratGame