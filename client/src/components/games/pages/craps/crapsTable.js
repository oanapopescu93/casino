import React, {useEffect} from 'react'
import { getMousePos, get_craps_bets, isInside } from '../../../../utils/games'
import $ from 'jquery'

function craps_bets(props){
    let self = this
	this.images = []
	let reason = ""
	let canvas
	let ctx
	let items = get_craps_bets()
	let craps_bets_coord = [0, 0, 2243, 1191, 0, 0, 900, 450] //sx,sy,swidth,sheight,x,y,width,height	
	let game_type = "pass line"
	let game_odds = 2

    this.ready = function(r){
        reason = r
		canvas = document.getElementById("craps_bets_canvas")	
		if(canvas){
			reason = r
			self.createCanvas()
			self.getImage(reason)
			self.handleClick()
		}
    }

    this.createCanvas = function(){
		ctx = canvas.getContext("2d")
		canvas.width = 900
		canvas.height = 450
		craps_bets_coord = [0, 0, 2243, 1191, 0, 0, 900, 450]
	}

	this.getImage = function(reason){
		if(reason !== "resize"){
			let promises = []
			for(let i in items){				
				promises.push(self.preaload_images(items[i]))
			}

			Promise.all(promises).then(function(result){
				self.images = result
				self.choose_craps_bets()
			})
		} else {
			self.choose_craps_bets()
		}
	}

	this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			let image = new Image()
			image.id = item.id
			image.src = item.src
			image.addEventListener("load", function() {
				resolve(image)
			}, false)
		})
	}

	this.choose_craps_bets = function(){		
		self.draw_craps_bets(self.images[0])
	}

	this.draw_craps_bets = function(img){
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage(img, craps_bets_coord[0], craps_bets_coord[1], craps_bets_coord[2], craps_bets_coord[3], craps_bets_coord[4], craps_bets_coord[5], craps_bets_coord[6], craps_bets_coord[7])
	}

	this.handleClick = function(){
        if($('#craps_bets_canvas')){
            $('#craps_bets_canvas').off('click').on('click', function(event) {
                let mousePos = getMousePos(canvas, event)
                self.canvas_click(mousePos)
            })
        }	
    }

	this.canvas_click = function(mouse){
		for(let i in items){
			if (items[i].id !== "craps" && isInside(mouse, items[i])) {
				game_type = items[i].text
				game_odds = items[i].odds
				self.draw_craps_bets(self.images[i])
				if(typeof props.getData === "function"){
					props.getData({game_type, game_odds, bet: props.bet})
				}
				break
			}
		}
	}
}

function CrapsTable(props){    
    let clear = props.clear
	let bet = 1
	let options = {...props, bet}
    let my_craps_bets = new craps_bets(options)

    useEffect(() => {
        if(my_craps_bets){
            my_craps_bets.ready()
        }
        $(window).resize(function(){
			if(my_craps_bets){
				my_craps_bets.ready('resize')
			}
		})
		return () => {
			if(my_craps_bets){
				my_craps_bets = null
			}
		}
    }, [clear])

    return <div className="craps_bets_container">
		<canvas id="craps_bets_canvas" />
	</div>
}

export default CrapsTable