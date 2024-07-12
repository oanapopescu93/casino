import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { translate } from '../../../../translations/translate'
import { draw_dot, getRoom, get_slots_images } from '../../../../utils/games'
import { getWindowDimensions, sortList } from '../../../../utils/utils'
import GameBoard from '../other/gameBoard'
import { changePopup } from '../../../../reducers/popup'
import { decryptData } from '../../../../utils/crypto'
import $ from 'jquery'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'

var images_pos = []
function slots_game(props, id){
    let self = this    
	let items = props.items
    let reel = null
	let canvas_height = 800
	let slots_canvas = []
	let slots_ctx = []
    let ctx

	let image_size = [100, 100]
	let image_size_canvas = [290, 290, 5, 5, 80, 80]
	let spin_time = 3000 // how long all slots spin before starting countdown
	let spin_time_reel = spin_time/5 // how long each slot spins at minimum
	let slot_speed = [] // how many pixels per second slots roll
	let speed = 10
	let border = 5
	
	this.state = 0
	this.images = []
	this.images_set = []
    this.offset = []
	let suffle_array = []
	this.lastUpdate = new Date()
	let now = new Date()

    this.ready = function(){
        self.fit()
        suffle_array = slots_data.array
        reel = self.get_reel()
        self.offset = self.get_offset(reel)	
		self.create_slot_machine_lines()			

        let promises = []
        for(let i in items){				
            promises.push(self.preaload_images(items[i]))
        }

        Promise.all(promises).then(function(result){
            self.images = result	
            slots_canvas = []
            for(let i in reel){	
				slot_speed.push(speed)
                self.images = self.create_suffle(i, self.images)
                slots_canvas.push(reel[i][0])
                self.createCanvas(slots_canvas[slots_canvas.length-1])					
                self.draw_reel(slots_canvas[slots_canvas.length-1], self.images, false)
            }
        })
    }

    this.resize = function(){
		reel = self.get_reel(props.lines)
        self.fit()
        slots_canvas = []        
        self.offset = self.get_offset(reel)
		self.create_slot_machine_lines()		
        for(let i in reel){
			slot_speed.push(speed)
            slots_canvas.push(reel[i][0])
            self.createCanvas(slots_canvas[slots_canvas.length-1])
            self.draw_reel(slots_canvas[slots_canvas.length-1], images_pos[i], true)
        }
    }

    this.get_reel = function(){
        let reel = []
		$('.slot_canvas').each(function(){
            reel.push($(this))
        })
		return reel
	}

    this.get_offset = function(reel){
        return reel.map(() => 0)
	}

    this.fit = function(){		
		image_size = [100, 100]
		image_size_canvas = [290, 290, 5, 5, 80, 80]
		speed = 10
		slot_speed = []
		border = 5
		if (window.innerWidth < 767){
			speed = 5
		}
		if (window.innerWidth < 480){
			border = 3
		}
		switch(props.lines){
			case 3:	
				if (window.innerWidth < 480){
					image_size = [70, 70]
					image_size_canvas = [290, 290, 3, 3, 60, 60]
				}
				if (window.innerWidth < 360){
					image_size = [50, 50]
					image_size_canvas = [290, 290, 3, 3, 40, 40]
				}
				break
			case 5:
				if (window.innerWidth < 767){
					image_size = [70, 70]
					image_size_canvas = [290, 290, 3, 3, 60, 60]
				}
				if (window.innerWidth < 600){
					image_size = [60, 60]
					image_size_canvas = [290, 290, 3, 3, 50, 50]
				}
				if (window.innerWidth < 480){
					image_size = [50, 50]
					image_size_canvas = [290, 290, 3, 3, 40, 40]
				}
				if (window.innerWidth < 400){
					image_size = [40, 40]
					image_size_canvas = [290, 290, 3, 3, 30, 30]
				}
				if (window.innerWidth < 321){
					image_size = [30, 30]
					image_size_canvas = [290, 290, 3, 3, 20, 20]
				}
				break
			default:
		}			
	}

	this.create_slot_machine_lines = function(){
		if(reel){
			let canvas_lines = $('#slot_machine_lines')[0]			
			let width = reel.length * (image_size[0] + 2 * border) 
			let height = 3 * image_size[1] + 2 * border 
			canvas_lines.width = width
			canvas_lines.height = height
		}	
	}

    this.create_suffle = function(i, images){
		let images01 = []
		for(let j in suffle_array[i]){
			let t = suffle_array[i][j]
			images01.push(images[t])
		}
		return images01
	}

    this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			let image = new Image()
			image.id = item.id
			image.src = item.src
			image.setAttribute('coord_x', item.coord[0])
			image.setAttribute('coord_y', item.coord[1])
			image.addEventListener("load", function() {
				resolve(image)
			}, false)
		})
	}

    this.createCanvas = function(canvas){
		ctx = canvas.getContext("2d")
		slots_ctx.push(ctx)		
		canvas.width = image_size[0]
		canvas.height = 2 * items.length * image_size[1]
		canvas_height = canvas.height		
		canvas.height = canvas_height
    }

    this.draw_reel = function(canvas, assets, resize=false){
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.fillStyle = '#ddd'
		let array = []

		if(typeof assets !== "undefined"){
			let length = assets.length
			for (let i = 0 ; i < length ; i++) {			
				let img = assets[i]
                if(resize){
                    img = assets[i].img
                }

                ctx.fillRect(0, i * canvas.width, canvas.width, 2)
				ctx.fillRect(0, (i + length)  * canvas.width, canvas.width, 2)

				let sx = img.getAttribute( "coord_x" )
				let sy = img.getAttribute( "coord_y" )
				let swidth = image_size_canvas[0]
				let sheight = image_size_canvas[1]
				let x = image_size_canvas[2]
				let y = image_size_canvas[3]+i*image_size[1]
				let width = image_size_canvas[4]
				let height = image_size_canvas[5]
				ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
				ctx.drawImage(img, sx, sy, swidth, sheight, x, (i + length) * canvas.width, width, height)

				let elem = {i:i, img:img, pos:i * canvas.width}
				array.push(elem)	
				elem = {i:i + length, img:img, pos:(i + length) * canvas.width}
				array.push(elem)	
            }

            array = sortList(array, 'i')
            if(!resize){
                images_pos.push(array)
            }	
        }
    }

    this.start = function(){
		self.spin()
	}

    this.spin = function(){
		self.reset()

		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
			  window.setTimeout(callback, 1000 / 60)
			}
	  	})()

	  	function spin_slot() {
			self.update(self.state)
			if(self.running){
				window.requestAnimationFrame(spin_slot)
			} else {
				slots_status = false
				window.cancelAnimationFrame(spin_slot)
				if(slots_data){
					let result = self.win_lose(self.get_results_pos())
					self.drawResultsArray(result)			
				}
			}
		}
		
		spin_slot()
	}

    this.reset = function(){
		self.running = true
		self.state = 0
		self.stopped = []
		slot_speed = []
        reel = self.get_reel(props.lines)
        self.offset = self.get_offset(reel)
		reel.forEach(() => {
			self.stopped.push(false)
			slot_speed.push(speed)
		})
		let canvas_lines = $('#slot_machine_lines')[0]
		let ctx_lines = canvas_lines.getContext("2d")
		ctx_lines.clearRect(0, 0, canvas_lines.width, canvas_lines.height)
	}

    this.update = function(state){
		now = new Date()
		function check_slot() {
			if ( now - self.lastUpdate > spin_time_reel ) {
				return true // done
			}
			return false
		}
		switch (state) {
			case 0: // all slots spinning
				if (now - self.lastUpdate > spin_time) {
					self.state = 1
					self.lastUpdate = now					
				} 
				break
			case 6:
				self.running = false
				break
			default: //stop slots one after the other
				self.stopped[state-1] = check_slot()
				if (self.stopped[state-1]) {
					slot_speed[state-1] = 0
					self.state++
					self.lastUpdate = now
				}	
		}
		for(let i in reel){
			self.rotate(i, slot_speed[i])
		}
		for(let i in reel){
			if(slot_speed[i] === 0){
				if(self.offset[i]%100 !== 0){
					self.running = true
					self.rotate(i, 10)
				}
			}
		}
	}

    this.rotate = function(i, slot_speed){
		self.offset[i] = self.offset[i] - slot_speed
		let max_height = -(reel[i][0].height - items.length * image_size[1])
		if(self.offset[i] < max_height){
			self.offset[i] = 0
		}
		reel[i].css('transform', 'translate(0px, '+self.offset[i]+'px)')
	}

    this.get_results_pos = function(){
		let array = []
		for(let i in self.offset){
			for(let j in images_pos[i]){
				if(images_pos[i][j].pos === -self.offset[i]){
					let t = j-1
					for(let k=0; k<3; k++){
						t++
						if(!images_pos[i][t]){
							t = 0
						}
						array.push(images_pos[i][t])	
					}
					break
				}
			}
		}		
		return splitArray(array, 3) // there are always 3 veggies per column
	}

	function splitArray(array, chunkSize) {
		const result = []
		for (let i = 0; i < array.length; i += chunkSize) {
			result.push(array.slice(i, i + chunkSize))
		}
		return result
	}

	this.win_lose = function(array){
		let win_results = []
		let matrix = slots_data.matrix
		for(let i in matrix){
			if(checkIdentical(getImgIds(array, matrix[i].matrix))){
				win_results.push({matrix: matrix[i]})
			}
		}
		return win_results
	}

	function getImgIds(veggy_array, small_matrix) {
		const imgIds = []	
		for (const [j, i] of small_matrix) {
			if (veggy_array[i] && veggy_array[i][j] && veggy_array[i][j].img && veggy_array[i][j].img.id){
				imgIds.push(veggy_array[i][j].img.id)
			}
		}	
		return imgIds
	}

	function checkIdentical(array) {
		if (array.length === 0) { //something went wrong
			return false
		}
	
		let trump_cards = array.length === 3 ? ["carrot"] : ["carrot", "potato"]	
		
		let array_small = array.filter(item => !trump_cards.includes(item)) //contains array minus the trump_card elements
		const allIdentical = array_small.every(item => item === array_small[0]) //Check if array_small has all identical elements
		if (allIdentical){ //If array_small has all identical elements, return true
			return true
		}
	
		// If array_small has more than one unique element, return false
		if (new Set(array_small).size > 1) {
			return false
		}
	
		// Check specific cases with trump cards
		for (let i = 0; i < array.length - 1; i++) {
			if (array[i] !== array[i + 1] && !trump_cards.includes(array[i]) && !trump_cards.includes(array[i + 1])) {
				return false
			}
		}	
		
		return true
	}	

	this.drawResultsArray = function(results){
		let canvas = $('#slot_machine_lines')[0]
		if(results && results.length && canvas){
			let pay = 0
			let border = 5
			let width = reel.length * (image_size[0] + 2 * border) 
			let height = 3 * image_size[1] + 2 * border 
			let cube = [width/reel.length, height/3]			
			ctx = canvas.getContext("2d")			

			for(let i in results){
				let matrix = results[i].matrix.matrix
				let prize = results[i].matrix.prize
				pay = pay + prize

				//draw lines
				ctx.beginPath()	
				for(let j in matrix){
					let x = matrix[j][1] * cube[0] + cube[0]/2
					let y = matrix[j][0] * cube[1] + cube[1]/2
					ctx.strokeStyle = "red"
					ctx.lineWidth = 5
					ctx.lineTo(x, y)	
					ctx.stroke()				
				}				
				ctx.closePath()

				//draw dots
				for(let j in matrix){
					let x = matrix[j][1] * cube[0] + cube[0]/2
					let y = matrix[j][0] * cube[1] + cube[1]/2
					draw_dot(ctx, x, y, 8, 0, 2 * Math.PI, false, 'red', 1, 'red')
				}
			}
			self.pay(pay, true)
		} else {
			self.pay(slots_bets, false)
		}
	}

    this.pay = function(pay, win){
		let game = null
		if(props.page && props.page.game){
			game = props.page.game
		}
		let status = win ? "win" : "lose"
		let money_original = props.user.money ? decryptData(props.user.money) : 0 
		let money = win ? money_original + pay : money_original - pay
		let slots_payload = {
			uuid: props.user.uuid,
			game: game,
			money: money,
			status: status,
			bet: pay
		}		
		if(typeof props.results === "function"){
            props.results(slots_payload)
        }
    }
}

let slots_data = null
let slots_bets = 0
let slots_status = false
function Slots(props){
	const {page, user, bets, settings, socket} = props
    const {lang} = settings
    let dispatch = useDispatch()
	const [width, setWidth] = useState(getWindowDimensions().width)
    let game = page.game
    let game_type = game.table_type
	let money = user.money ? decryptData(user.money) : 0
    let lines = 5
    switch(game_type) {
        case "reel_3":
            lines = 3
            break
        case "reel_5":
        default:
            lines = 5
            break
    }
    let items = get_slots_images()
	function clear(bet){
		slots_bets = bet
		if(slots_bets > 0 && slots_status){		
			let slots_payload = {
				uuid: user.uuid,
				game: game,
				status: 'lose',
				bet: slots_bets,
				money: money - slots_bets
			}
			if(typeof props.results === "function"){
				props.results(slots_payload)
			}
		}
	}
    let options = {...props, lines, items, dispatch, clear}
    let my_slots = new slots_game(options)

	function handleResize(){
        setWidth(getWindowDimensions().width)
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        }
	}, [])

    useEffect(() => {
        let payload = {uuid: user.uuid, lines, room: getRoom(game), items: items}	
        socket.emit('slots_send', payload)	        
        $(window).resize(function(){
			if(my_slots){
                my_slots.resize()
            }
		})
		return () => {
			if(my_slots){				
				clear(slots_bets) // if the user leaves the game, if he bet, he will lose the bets
				my_slots = null
				slots_data = null
				slots_bets = 0
			}
		}
    }, [])

    useEffect(() => {
		const handleSlotsRead = function(data) {
            if(my_slots && data){
                slots_data = data
                my_slots.ready()
            }
        }

		socket.on('slots_read', handleSlotsRead)
		return () => {
            socket.off('slots_read', handleSlotsRead)
        }
    }, [socket])

    function choice(type){		
        if(type === "start" && my_slots){
            if(slots_bets>0){
				slots_status = true
                my_slots.start()
            } else {
                let payload = {
                    open: true,
                    template: "error",
                    title: translate({lang: lang, info: "error"}),
                    data: translate({lang: lang, info: "no_bets"})
                }
                dispatch(changePopup(payload))
            }
        }
    }

    function updateBets(x){
        slots_bets = x
    }

	function handleShowPrizes(){
		let payload = {
            open: true,
            template: "slots_prizes",
            title: "slots_prizes",
            data: slots_data,
			size: 'sm'
        }
        dispatch(changePopup(payload))
	}

    return <div className="game_container">
        <div id="slot_machine" className={"slot_machine " + "slot_machine_" + lines}>
            <canvas id="slot_machine_lines" />
            {(() => {
                switch(lines) {
					case 3:
						return <>
							<div className="box"><canvas className="slot_canvas" id='slot_canvas_1' /></div>
							<div className="box"><canvas className="slot_canvas" id='slot_canvas_2' /></div>
							<div className="box"><canvas className="slot_canvas" id='slot_canvas_3' /></div>
						</>
					case 5:
					default: 
						return <>
							<div className="box"><canvas className="slot_canvas" id='slot_canvas_1' /></div>
							<div className="box"><canvas className="slot_canvas" id='slot_canvas_2' /></div>
							<div className="box"><canvas className="slot_canvas" id='slot_canvas_3' /></div>
							<div className="box"><canvas className="slot_canvas" id='slot_canvas_4' /></div>
							<div className="box"><canvas className="slot_canvas" id='slot_canvas_5' /></div>
						</>
					}
            })()}
			{width >= 600 ? <div id="slots_prizes" className="desktop" onClick={()=>handleShowPrizes()}>
            	{translate({lang: lang, info: "prizes"})}
        	</div> : null}			
        </div>		
        <div className="slot_machine_board">
            <GameBoard template="slots" {...props} choice={(e)=>choice(e)} updateBets={(e)=>updateBets(e)} />
        </div>
		{width < 600 ? <div id="slots_prizes" className="mobile shadow_convex" onClick={()=>handleShowPrizes()}>
            {translate({lang: lang, info: "prizes"})}
        </div> : null}
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

export default Slots