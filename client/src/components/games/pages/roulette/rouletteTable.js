import React, { useEffect } from 'react'
import { draw_rect, getMousePos, isInside } from '../../../../utils/games'
import $ from 'jquery'
import { useHandleErrors } from '../../../../utils/utils'
import { checkBets } from '../../../../utils/checkBets'

function roulette_bets(props){    
    const { settings, images, tokenImages, page, getData, money } = props
    const { lang } = settings

    let self = this
	let canvas
	let ctx
	
	let small_image = false
	let roulette_bets_coord = [0, 0, 795, 268, 0, 0, 795, 268]	
    let roulette_type = page.game.table_type

    let list_bets = []
    let your_bets = []
    let numbers = []
	let bet_square = 40
    let show_squares = false //this is to test click event
    let bet_value = 1

    const handleErrors = useHandleErrors()

    this.ready = ()=>{
		canvas = document.getElementById("roulette_bets_canvas")	
		self.createCanvas()
        self.choose_roulette_type()
        self.choose_roulette_bets()
		self.create_roulette_bets()
        self.handleClick()
    }    
    this.createCanvas = ()=>{
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
    this.choose_roulette_type = ()=>{			
		if(roulette_type === 'european'){			
			numbers = ["0", "32", "15", "19", "4", "21", "2", "25", "17", "34", "6", "27", "13", "36", "11", "30", "8", "23", "10", "5", "24", "16", "33", "1", "20", "14", "31", "9", "22", "18", "29", "7", "28", "12", "35", "3", "26"] //37
		} else {			
			numbers = ["0", "28", "9", "26", "30", "11", "7", "20", "32", "17", "5", "22", "34", "15", "3", "24", "36", "13", "1", "00", "27", "10", "25", "29", "12", "8", "19", "31", "18", "6", "21", "33", "16", "4", "23", "35", "14", "2"] //38
		}		
	}

    this.choose_roulette_bets = ()=>{
		if(roulette_type === "european"){
			if(!small_image){
				self.draw_roulette_bets(images[0])
			} else {
				self.draw_roulette_bets(images[1])
			}
		} else if(roulette_type === "american"){
			if(!small_image){
				self.draw_roulette_bets(images[2])
			} else {
				self.draw_roulette_bets(images[3])
			}
		}
	}
    this.draw_roulette_bets = (img)=>{
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

    this.create_roulette_bets = ()=>{
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
	function my_bets(squares, k, color){
		let a = 0
		list_bets = []
        let square_bg = "transparent"
        let square_width = 3
        let square_color = "blue"

        if(show_squares){
            console.log(show_squares, squares.a)
            draw_rect(ctx, squares.a.x, squares.a.y, squares.a.w, squares.a.h, square_bg, square_width, square_color)
        }
		
		list_bets.push({x: squares.a.x, y: squares.a.y, width: squares.a.w, height: squares.a.h, color:"green", text: "0", bet_value})
		
		if(Object.keys(squares.b).length !== 0){ // it means it is american roulette and has 00
			if(show_squares){
                draw_rect(ctx, squares.b.x, squares.b.y, squares.b.w, squares.b.h, square_bg, square_width, square_color)
            }
			list_bets.push({x: squares.b.x, y: squares.b.y, width: squares.b.w, height: squares.b.h, color:"green", text: "00", bet_value})
		}
		
		if(!small_image){
			//big or small landscape
			for(let i = 1; i < numbers.length-k; i++){	
				a++
				if(a > 3){
					squares.c.x = squares.c.x + squares.c.w	
					squares.c.y = squares.c.y + 2 * squares.c.w
					a = 1
				} else {
					squares.c.y = squares.c.y - squares.c.w
				}
                if(show_squares){
                    draw_rect(ctx, squares.c.x, squares.c.y, squares.c.w, squares.c.h, square_bg, square_width, square_color)
                }
				list_bets.push({x: squares.c.x, y: squares.c.y, width: squares.c.w, height: squares.c.h, color: color[i-1], text: i.toString(), bet_value})
			}

            if(show_squares){
                draw_rect(ctx, 0*squares.d.w + squares.d.x, squares.d.y, squares.d.w, squares.d.h, square_bg, square_width, square_color)
                draw_rect(ctx, 1*squares.d.w + squares.d.x, squares.d.y, squares.d.w, squares.d.h, square_bg, square_width, square_color)
                draw_rect(ctx, 2*squares.d.w + squares.d.x, squares.d.y, squares.d.w, squares.d.h, square_bg, square_width, square_color)
            }
			list_bets.push({x: 0*squares.d.w + squares.d.x, y: squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "1st 12", bet_value})	
			list_bets.push({x: 1*squares.d.w + squares.d.x, y: squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "2st 12", bet_value})	
			list_bets.push({x: 2*squares.d.w + squares.d.x, y: squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "3st 12", bet_value})	
            
            if(show_squares){
                draw_rect(ctx, 0*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)
                draw_rect(ctx, 1*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)
                draw_rect(ctx, 2*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)
                draw_rect(ctx, 3*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)
                draw_rect(ctx, 4*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)
                draw_rect(ctx, 5*squares.e.w + squares.e.x, squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)	
            }
						
			list_bets.push({x: 0*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "1-18", bet_value})
			list_bets.push({x: 1*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Even", bet_value})
			list_bets.push({x: 2*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "reds", bet_value})
			list_bets.push({x: 3*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "blacks", bet_value})	
			list_bets.push({x: 4*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Odd", bet_value})
			list_bets.push({x: 5*squares.e.w + squares.e.x, y: squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "19-36", bet_value})

            if(show_squares){
                draw_rect(ctx, squares.f.x, 0*squares.f.h + squares.f.y, squares.f.w, squares.f.h, square_bg, square_width, square_color)
                draw_rect(ctx, squares.f.x, 1*squares.f.h + squares.f.y, squares.f.w, squares.f.h, square_bg, square_width, square_color)
                draw_rect(ctx, squares.f.x, 2*squares.f.h + squares.f.y, squares.f.w, squares.f.h, square_bg, square_width, square_color)
            }
			
			list_bets.push({x: squares.f.x, y: 0*squares.f.h + squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1a", bet_value})	
			list_bets.push({x: squares.f.x, y: 1*squares.f.h + squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1b", bet_value})	
			list_bets.push({x: squares.f.x, y: 2*squares.f.h + squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1c", bet_value})
		} else {
			//small portrait
			for(let i = 1; i < numbers.length-k; i++){	
				a++
				if(a > 3){
					squares.c.x = squares.c.x -  2 * squares.c.w
					squares.c.y = squares.c.y + squares.c.h
					a = 1
				} else {
					squares.c.x = squares.c.x + squares.c.w	
				}
                if(show_squares){
                    draw_rect(ctx, squares.c.x, squares.c.y, squares.c.w, squares.c.h, square_bg, square_width, square_color)
                }
				
				list_bets.push({x: squares.c.x, y: squares.c.y, width: squares.c.w, height: squares.c.h, color: color[i-1], text: i.toString(), bet_value})				
			}

            if(show_squares){
                draw_rect(ctx, squares.d.x, 0 * squares.d.h + squares.d.y, squares.d.w, squares.d.h, square_bg, square_width, square_color)
                draw_rect(ctx, squares.d.x, 1 * squares.d.h + squares.d.y, squares.d.w, squares.d.h, square_bg, square_width, square_color)
                draw_rect(ctx, squares.d.x, 2 * squares.d.h + squares.d.y, squares.d.w, squares.d.h, square_bg, square_width, square_color)   
            }
			
			list_bets.push({x: squares.d.x, y: 0 * squares.d.h + squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "1st 12", bet_value})
			list_bets.push({x: squares.d.x, y: 1 * squares.d.h + squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "2st 12", bet_value})
			list_bets.push({x: squares.d.x, y: 2 * squares.d.h + squares.d.y, width: squares.d.w, height: squares.d.h, color: "", text: "3st 12", bet_value})

            if(show_squares){
                draw_rect(ctx, squares.e.x, 0 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)
                draw_rect(ctx, squares.e.x, 1 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)
                draw_rect(ctx, squares.e.x, 2 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)
                draw_rect(ctx, squares.e.x, 3 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)
                draw_rect(ctx, squares.e.x, 4 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)
                draw_rect(ctx, squares.e.x, 5 * squares.e.h + squares.e.y, squares.e.w, squares.e.h, square_bg, square_width, square_color)   
            }
							
			list_bets.push({x: squares.e.x, y: 0 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "1-18", bet_value})	
			list_bets.push({x: squares.e.x, y: 1 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Even", bet_value})
			list_bets.push({x: squares.e.x, y: 2 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "reds", bet_value})
			list_bets.push({x: squares.e.x, y: 3 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "blacks", bet_value})
			list_bets.push({x: squares.e.x, y: 4 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "Odd", bet_value})	
			list_bets.push({x: squares.e.x, y: 5 * squares.e.h + squares.e.y, width: squares.e.w, height: squares.e.h, color: "", text: "19-36", bet_value})

            if(show_squares){
                draw_rect(ctx, 0 * squares.f.w + squares.f.x, squares.f.y, squares.f.w, squares.f.h, square_bg, square_width, square_color)
                draw_rect(ctx, 1 * squares.f.w + squares.f.x, squares.f.y, squares.f.w, squares.f.h, square_bg, square_width, square_color)
                draw_rect(ctx, 2 * squares.f.w + squares.f.x, squares.f.y, squares.f.w, squares.f.h, square_bg, square_width, square_color)
            }
			
			list_bets.push({x: 0 * squares.f.w + squares.f.x, y: squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1a", bet_value})	
			list_bets.push({x: 1 * squares.f.w + squares.f.x, y: squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1b", bet_value})	
			list_bets.push({x: 2 * squares.f.w + squares.f.x, y: squares.f.y, width: squares.f.w, height: squares.f.h, color: "", text: "2 to 1c", bet_value})
		}
	}

    this.handleClick = ()=>{
        if($('#roulette_bets_canvas')){
            $('#roulette_bets_canvas').off('click').on('click', (event)=>{
                let mousePos = getMousePos(canvas, event)
                self.canvas_click(mousePos)
            })
        }
    }
    this.canvas_click = (mouse)=>{
        for(let i in list_bets){
			let obj = list_bets[i]			
			if (isInside(mouse, obj)){
                let index = your_bets.findIndex(bet => bet.x === obj.x && bet.y === obj.y) // Check if the bet already exists in your_bets

                if (index !== -1) {
                    your_bets.splice(index, 1)  // If bet exists, remove it
                } else {
                    let totalBets = getTotalBets() + obj.bet_value // Calculate the total bet if we add this one                    
                    if (checkBets({ bets: totalBets, money, lang }, handleErrors)) { // Check if the total bets exceed available money
                        your_bets = [...your_bets, obj]
                    }
                }
            }
        }
        self.draw()
        getData(your_bets)
    }
    function getTotalBets(){
        let total = 0
        for(let i in your_bets){
            total = total + your_bets[i].bet_value
        }
        return total
    }
    this.draw = ()=>{
        self.choose_roulette_bets()		
		self.draw_tokens()
	}
    this.draw_tokens = ()=>{
        for(let i in your_bets){
            self.draw_token(your_bets[i])
        }
	}
    this.draw_token = (bet)=>{
        let img = tokenImages[0]
		let x = bet.x + bet.width/2 - bet_square/4
		let y = bet.y + bet.height/2 - bet_square/4 - 5
		let w = bet_square/2
		let h = bet_square/2 + 10
		ctx.drawImage(img, x, y, w, h)
	}
}

function RouletteTable(props){ 
    const {images, tokenImages, width, clear} = props
    let options = {...props}
    
    let my_roulette_bets = new roulette_bets(options)

	function ready(){
		if(my_roulette_bets && document.getElementById("roulette_bets_canvas")){
            my_roulette_bets.ready()
        }
	}

    useEffect(() => {
		if(images && tokenImages){
			ready()
		}
    }, [images, tokenImages, width, clear])

    return <canvas id="roulette_bets_canvas" />
}

export default RouletteTable