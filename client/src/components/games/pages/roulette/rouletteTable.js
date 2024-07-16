import React, {useEffect} from 'react'
import { draw_rect, getMousePos, get_roulette_bets, isInside } from '../../../../utils/games'
import $ from 'jquery'
import carrot_img from '../../../../img/icons/carrot_icon.png'
import { useDispatch } from 'react-redux'
import { decryptData } from '../../../../utils/crypto'
import { translate } from '../../../../translations/translate'
import { changePopup } from '../../../../reducers/popup'

function roulette_bets(props){
    let self = this	
	let canvas
	let ctx
    let reason = ""
	
	let small_image = false
	let roulette_bets_coord = [0, 0, 795, 268, 0, 0, 795, 268]
	let items = get_roulette_bets()
    let roulette_type = props.page.game.table_type
    this.images = []

    let list_bets = []
    let your_bets = []
	let your_last_bet = {} 
    let numbers = []
	let bet_square = 40
	let bet_value_sum = 0

	let money = props.user.money ? decryptData(props.user.money) : 0 

    this.ready = function(r){
        reason = r
		canvas = document.getElementById("roulette_bets_canvas")	
		if(canvas){
			self.createCanvas()
            self.choose_roulette_type()
			self.getImage(reason)
		}
    }

    this.choose_roulette_type = function(){			
		if(roulette_type === 'european'){			
			numbers = ["0", "32", "15", "19", "4", "21", "2", "25", "17", "34", "6", "27", "13", "36", "11", "30", "8", "23", "10", "5", "24", "16", "33", "1", "20", "14", "31", "9", "22", "18", "29", "7", "28", "12", "35", "3", "26"] //37
		} else {			
			numbers = ["0", "28", "9", "26", "30", "11", "7", "20", "32", "17", "5", "22", "34", "15", "3", "24", "36", "13", "1", "00", "27", "10", "25", "29", "12", "8", "19", "31", "18", "6", "21", "33", "16", "4", "23", "35", "14", "2"] //38
		}		
	}

    this.createCanvas = function(){
		ctx = canvas.getContext("2d")	
		small_image = false	
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 400
				canvas.height = 135
				roulette_bets_coord = [0, 0, 795, 268, 0, 0, 400, 135]
			} else {
				//small portrait
				canvas.width = 135
				canvas.height = 400
				small_image = true
				roulette_bets_coord = [0, 0, 382, 1136, 0, 0, 191, 568]				
			}	
			bet_square = 30		
		} else {
			//big
			canvas.width = 795
			canvas.height = 270
			roulette_bets_coord = [0, 0, 795, 268, 0, 0, 795, 268]
			bet_square = 40
		}
	}

	this.getImage = function(reason){
		if(reason !== "resize"){
			let promises = []
			for(let i in items){				
				promises.push(self.preaload_images(items[i]))
			}
			Promise.all(promises).then(function(result){
				self.images = result
				self.choose_roulette_bets()
				self.create_roulette_bets()
				self.handleClick()
			})
		} else {
			this.choose_roulette_bets()
			this.create_roulette_bets()
			this.handleClick()
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

    this.choose_roulette_bets = function(){
		if(roulette_type === "european"){
			if(!small_image){
				this.draw_roulette_bets(this.images[0])
			} else {
				this.draw_roulette_bets(this.images[1])
			}
		} else if(roulette_type === "american"){
			if(!small_image){
				this.draw_roulette_bets(this.images[2])
			} else {
				this.draw_roulette_bets(this.images[3])
			}
		}
	}

	this.draw_roulette_bets = function(img){
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		let sx = roulette_bets_coord[0]
		let sy = roulette_bets_coord[1]
		let swidth = roulette_bets_coord[2]
		let sheight = roulette_bets_coord[3]
		let x = roulette_bets_coord[4]
		let y = roulette_bets_coord[5]
		let width = roulette_bets_coord[6]
		let height = roulette_bets_coord[7]
		ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
	}

    this.create_roulette_bets = function(){
		let color = ['red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red']
		let k = 0
		let squares
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape					
				if(roulette_type === "european"){
					squares = {
						a: {x:0, y:0, w:27, h:78}, //0
						b: {}, //00
						c: {x:26, y:80, w:27, h:27}, //first square
						d: {x:27, y:80, w:106, h:27}, //first 12
						e: {x:27, y:110, w:53, h:27}, //1-18
						f: {x:345, y:0, w:53, h:27}, //2 to 1
					}					
				} else {
					k = 1
					squares = {
						a: {x:0, y:0, w:27, h:40}, //0
						b: {x:0, y:40, w:27, h:40}, //00
						c: {x:26, y:80, w:27, h:27}, //first square
						d: {x:27, y:80, w:106, h:27}, //first 12
						e: {x:27, y:110, w:53, h:27}, //1-18
						f: {x:345, y:0, w:53, h:27}, //2 to 1
					}	
				}
			} else {
				//small portrait
				if(roulette_type === "european"){
					squares = {
						a: {x:53, y:0, w:78, h:27}, //0
						b: {}, //00
						c: {x:27, y:27, w:27, h:26}, //first square
						d: {x:27, y:27, w:27, h:106}, //first 12
						e: {x:0, y:27, w:27, h:53}, //1-18
						f: {x:53, y:345, w:27, h:53}, //2 to 1
					}
				} else {
					k = 1
					squares = {
						a: {x:53, y:0, w:40, h:27}, //0
						b: {x:93, y:0, w:40, h:27}, //00
						c: {x:27, y:27, w:27, h:26}, //first square
						d: {x:27, y:27, w:27, h:106}, //first 12
						e: {x:0, y:27, w:27, h:53}, //1-18
						f: {x:53, y:345, w:27, h:53}, //2 to 1
					}
				}
			}			
		} else {
			//big
			if(roulette_type === "european"){
				squares = {
					a: {x:0, y:0, w:53, h:160}, //0
					b: {}, //00
					c: {x:50, y:160, w:53, h:57}, //first square
					d: {x:50, y:160, w:212, h:57}, //first 12
					e: {x:50, y:212, w:106, h:57}, //1-18
					f: {x:685, y:0, w:106, h:53}, //2 to 1
				}
			} else {
				k = 1
				squares = {
					a: {x:0, y:0, w:53, h:80}, //0
					b: {x:0, y:80, w:53, h:80}, //00
					c: {x:50, y:160, w:53, h:57}, //first square
					d: {x:50, y:160, w:212, h:57}, //first 12
					e: {x:50, y:212, w:106, h:57}, //1-18
					f: {x:685, y:0, w:106, h:53}, //2 to 1
				}
			}
		}
		my_bets(squares, k, color)
	}
	
	function my_bets(squares, k, color, up){
		let a = 0
		list_bets = []
		//draw_rect(ctx, squares.a.x, squares.a.y, squares.a.w, squares.a.h, 'transparent', 1, 'red')
		list_bets.push({x: squares.a.x, y: squares.a.y, width: squares.a.w, height: squares.a.h, color:"green", text: "0", bet_value: 1})
		
		if(Object.keys(squares.b).length !== 0){ // it means it is american roulette and has 00
			//draw_rect(ctx, squares.b.x, squares.b.y, squares.b.w, squares.b.h, 'transparent', 1, 'red')
			list_bets.push({x: squares.b.x, y: squares.b.y, width: squares.b.w, height: squares.b.h, color:"green", text: "00", bet_value: 1})
		}
		
		if(!small_image){
			//big or small landscape
			for(let i = 1; i < numbers.length-k; i++) {	
				a++
				if(a > 3){
					squares.c.x = squares.c.x + squares.c.w	
					squares.c.y = squares.c.y + 2 * squares.c.w
					a = 1
				} else {
					squares.c.y = squares.c.y - squares.c.w
				}
				//draw_rect(ctx, squares.c.x, squares.c.y, squares.c.w, squares.c.h, 'transparent', 1, 'red')
				list_bets.push({x: squares.c.x, y: squares.c.y, width: squares.c.w, height: squares.c.h, color: color[i-1], text: i.toString(), bet_value: 1})
			}

			// draw_rect(ctx, 0*squares.d.w + squares.d.x, squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red')
			// draw_rect(ctx, 1*squares.d.w + squares.d.x, squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red')
			// draw_rect(ctx, 2*squares.d.w + squares.d.x, squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red')
			list_bets.push({x: 0*squares.d.w + squares.d.x, y: squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "1st 12", bet_value: 1})	
			list_bets.push({x: 1*squares.d.w + squares.d.x, y: squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "2st 12", bet_value: 1})	
			list_bets.push({x: 2*squares.d.w + squares.d.x, y: squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "3st 12", bet_value: 1})	
		
			// draw_rect(ctx, 0*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')
			// draw_rect(ctx, 1*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')
			// draw_rect(ctx, 2*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')
			// draw_rect(ctx, 3*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')
			// draw_rect(ctx, 4*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')
			// draw_rect(ctx, 5*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')				
			list_bets.push({x: 0*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "1-18", bet_value: 1})
			list_bets.push({x: 1*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Even", bet_value: 1})
			list_bets.push({x: 2*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "reds", bet_value: 1})
			list_bets.push({x: 3*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "blacks", bet_value: 1})	
			list_bets.push({x: 4*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Odd", bet_value: 1})
			list_bets.push({x: 5*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "19-36", bet_value: 1})

			// draw_rect(ctx, squares.f.x, 0*squares.f.h + squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red')
			// draw_rect(ctx, squares.f.x, 1*squares.f.h + squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red')
			// draw_rect(ctx, squares.f.x, 2*squares.f.h + squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red')
			list_bets.push({x: squares.f.x, y: 0*squares.f.h + squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1a", bet_value: 1})	
			list_bets.push({x: squares.f.x, y: 1*squares.f.h + squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1b", bet_value: 1})	
			list_bets.push({x: squares.f.x, y: 2*squares.f.h + squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1c", bet_value: 1})
		} else {
			//small portrait
			for(let i = 1; i < numbers.length-k; i++) {	
				a++
				if(a > 3){
					squares.c.x = squares.c.x -  2 * squares.c.w
					squares.c.y = squares.c.y + squares.c.h
					a = 1
				} else {
					squares.c.x = squares.c.x + squares.c.w	
				}					
				//draw_rect(ctx, squares.c.x, squares.c.y, squares.c.w, squares.c.h, 'transparent', 1, 'red')
				list_bets.push({x: squares.c.x, y: squares.c.y, width: squares.c.w, height: squares.c.h, color: color[i-1], text: i.toString(), bet_value: 1})				
			}

			// draw_rect(ctx, squares.d.x, 0 * squares.d.h + squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red')
			// draw_rect(ctx, squares.d.x, 1 * squares.d.h + squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red')
			// draw_rect(ctx, squares.d.x, 2 * squares.d.h + squares.d.y, squares.d.w, squares.d.h, 'transparent', 1, 'red')
			list_bets.push({x: squares.d.x, y: 0 * squares.d.h + squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "1st 12", bet_value: 1})
			list_bets.push({x: squares.d.x, y: 1 * squares.d.h + squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "2st 12", bet_value: 1})
			list_bets.push({x: squares.d.x, y: 2 * squares.d.h + squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "3st 12", bet_value: 1})

			// draw_rect(ctx, squares.e.x, 0 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')
			// draw_rect(ctx, squares.e.x, 1 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')
			// draw_rect(ctx, squares.e.x, 2 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')
			// draw_rect(ctx, squares.e.x, 3 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')
			// draw_rect(ctx, squares.e.x, 4 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')
			// draw_rect(ctx, squares.e.x, 5 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, 'transparent', 1, 'red')				
			list_bets.push({x: squares.e.x, y: 0 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "1-18", bet_value: 1})	
			list_bets.push({x: squares.e.x, y: 1 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Even", bet_value: 1})
			list_bets.push({x: squares.e.x, y: 2 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "reds", bet_value: 1})
			list_bets.push({x: squares.e.x, y: 3 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "blacks", bet_value: 1})
			list_bets.push({x: squares.e.x, y: 4 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Odd", bet_value: 1})	
			list_bets.push({x: squares.e.x, y: 5 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "19-36", bet_value: 1})

			// draw_rect(ctx, 0 * squares.f.w + squares.f.x, squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red')
			// draw_rect(ctx, 1 * squares.f.w + squares.f.x, squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red')
			// draw_rect(ctx, 2 * squares.f.w + squares.f.x, squares.f.y, squares.f.w, squares.f.h, 'transparent', 1, 'red')
			list_bets.push({x: 0 * squares.f.w + squares.f.x, y: squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1a", bet_value: 1})	
			list_bets.push({x: 1 * squares.f.w + squares.f.x, y: squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1b", bet_value: 1})	
			list_bets.push({x: 2 * squares.f.w + squares.f.x, y: squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1c", bet_value: 1})
		}
	}	

    this.handleClick = function(){
        if($('#roulette_bets_canvas')){
            $('#roulette_bets_canvas').off('click').on('click', function(event) {
                let mousePos = getMousePos(canvas, event)
                self.canvas_click(mousePos)
            })
        }		
    }

    this.canvas_click = function(mouse){ 
        for(let i in list_bets){
			let obj = list_bets[i]			
			if (isInside(mouse, obj)) {
				bet_value_sum++
				if(bet_value_sum > money){
					let payload = {
						open: true,
						template: "error",
						title: "error",
						data: translate({lang: props.settings.lang, info: "no_money"})
					}
					props.dispatch(changePopup(payload))
				} else {
					your_bets = [...your_bets, obj]
					your_last_bet = obj
					self.draw_tokens(your_last_bet)
				}				
				break
			} 
		}		
        props.getData(your_bets)
    }

	this.draw_tokens = function(bet){		
		let x = bet.x + bet.width/2 - bet_square/4
		let y = bet.y + bet.height/2 - bet_square/4 - 5
		let w = bet_square/2
		let h = bet_square/2+10
		let img = new Image()
		img.src = carrot_img
		img.onload = function() {
			ctx.drawImage(img, x, y, w, h)	
		}
	}
}

function RouletteTable(props){ 
	const {clear} = props
	let dispatch = useDispatch()
    let options = {...props, dispatch}
    let my_roulette_bets = new roulette_bets(options)

    useEffect(() => {
        if(my_roulette_bets){
            my_roulette_bets.ready()
        }
        $(window).resize(function(){
			if(my_roulette_bets){
				my_roulette_bets.ready('resize')
			}
		})
		return () => {
			if(my_roulette_bets){
				my_roulette_bets = null
			}
		}
    }, [clear])

    return <canvas id="roulette_bets_canvas" />
}

export default RouletteTable