import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { randomIntFromInterval, sortList } from '../../../../utils/utils'
import { translate } from '../../../../translations/translate'
import $ from 'jquery'
import { draw_dot } from '../../../../utils/games'

function slots_game(props){
    let self = this
	
	let slotsData = props.slotsData
	let slotsBets = props.slotsBets
	let lines = props.lines
	let items = props.items
	let reel = null
	let suffle_array = []
	let offset = []

	let image_size = [100, 100]
	let image_size_canvas = [290, 290, 5, 5, 80, 80]
	let spin_time = randomIntFromInterval(2000, 4000) // how long all slots spin before starting countdown
	let spin_time_reel = spin_time/5 // how long each slot spins at minimum
	let slot_speed = [] // how many pixels per second slots roll
	let speed = 10
	let border = 5
	let images = []
	let images_pos = props.imagePos ? props.imagePos : []

	let canvas_height = 800
	let slots_canvas = []
	let slots_ctx = []
    let ctx

	self.state = 0
	let now = new Date()
	let lastUpdate = new Date()

	this.ready = function(reason){
        suffle_array = slotsData.array
		self.fit()
        reel = self.get_reel()
        offset = self.get_offset(reel)
		self.create_slot_machine_lines()
		slots_canvas = []
		if(reason !== "resize"){ //first time load
			let promises = []
			for(let i in items){
				promises.push(self.preaload_images(items[i]))
			}
			Promise.all(promises).then(function(result){
				for(let i in reel){
					slot_speed.push(speed)
					images = self.create_suffle(i, result)
					slots_canvas.push(reel[i][0])
					self.createCanvas(slots_canvas[slots_canvas.length-1])
					self.draw_reel(slots_canvas[slots_canvas.length-1], images, false)					
				}
				if(typeof props.getImagePos === "function"){
					props.getImagePos(images_pos)
				}
			})
		} else { //resize
			for(let i in reel){
				slot_speed.push(speed)
				slots_canvas.push(reel[i][0])
				self.createCanvas(slots_canvas[slots_canvas.length-1])
				self.draw_reel(slots_canvas[slots_canvas.length-1], images_pos[i], true)
				reel[i].css('transform', 'translate(0px, 0px)')			
			}
			if(typeof props.getImagePos === "function"){
				props.getImagePos(images_pos)
			}
		}
    }

	this.fit = function(){
		image_size = [100, 100]
		image_size_canvas = [290, 290, 5, 5, 80, 80]
		slot_speed = []
		border = 5
		if (window.innerWidth < 480){
			border = 3
		}
		switch(lines){
			case 3:
				if (window.innerWidth <= 768 || window.innerHeight <= 400) {
					image_size = [70, 70]
					image_size_canvas = [290, 290, 3, 3, 60, 60]
				}
				if (window.innerWidth < 480){					
					image_size = [70, 70]
					image_size_canvas = [290, 290, 3, 3, 60, 60]
				}
				break
			case 5:
			default:
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
	this.create_slot_machine_lines = function(){
		if(reel){
			let canvas_lines = $('#slot_machine_lines')[0]
			let width = reel.length * (image_size[0] + 2 * border) 
			let height = 3 * image_size[1] + 2 * border 
			canvas_lines.width = width
			canvas_lines.height = height
		}	
	}

	this.preaload_images = function(item){
		return new Promise(function(resolve){
			let image = new Image()
			image.id = item.id
			image.src = item.src
			image.setAttribute('coord_x', item.coord[0])
			image.setAttribute('coord_y', item.coord[1])
			image.addEventListener("load", function(){
				resolve(image)
			}, false)
		})
	}
	this.create_suffle = function(i, images){
		let myImages = []
		for(let j in suffle_array[i]){
			let t = suffle_array[i][j]
			myImages.push(images[t])
		}
		return myImages
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
			for(let i = 0 ; i < length ; i++){
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

	this.start = function(e){
		self.spin(e)
	}
	this.spin = function(e){
		self.reset()
		images_pos = e

		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
			  window.setTimeout(callback, 1000 / 60)
			}
	  	})()

	  	function spin_slot(){
			self.update(self.state)
			if(self.running){
				window.requestAnimationFrame(spin_slot)
			} else {
				window.cancelAnimationFrame(spin_slot)
				self.stop()
			}
		}
		
		spin_slot()
	}
	this.reset = function(){
		self.running = true
		self.state = 0
		self.stopped = []
		slot_speed = []
		self.fit()
        reel = self.get_reel(props.lines)
        offset = self.get_offset(reel)
		reel.forEach(() => {
			self.stopped.push(false)
			slot_speed.push(speed)
		})
		let canvas_lines = $('#slot_machine_lines')[0]
		let ctx_lines = canvas_lines.getContext("2d")
		ctx_lines.clearRect(0, 0, canvas_lines.width, canvas_lines.height)
	}
	this.update = function(state) {
		now = new Date()
		
		function check_slot(index) {
			if (now - lastUpdate > spin_time_reel) {
				return true
			}
			if (offset[index] % image_size[1] === 0) {
				return true
			}
			return false
		}
		
		switch (state) {
			case 0: // all slots spinning
				if (now - lastUpdate > spin_time) {
					self.state = 1
					lastUpdate = now
				}
				break
			case 6:
				self.running = false
				break
			default: // stop slots one after the other
				self.stopped[state-1] = check_slot(state-1)
				if (self.stopped[state-1]) {
					slot_speed[state-1] = 0
					self.state++
					lastUpdate = now
				}
		}
		
		for (let i in reel) {
			self.rotate(i, slot_speed[i])
		}
		
		for (let i in reel) {
			if (slot_speed[i] === 0 && offset[i] % image_size[1] !== 0) {
				self.running = true
				self.rotate(i, 10) // Adjust this speed as needed
			}
		}
	}
	
	this.rotate = function(i, slot_speed){
		offset[i] = offset[i] - slot_speed
		let max_height = -(reel[i][0].height - items.length * image_size[1])
		
		if (offset[i] < max_height) {
			offset[i] = 0
		}
		
		if (slot_speed === 0 && offset[i] % image_size[1] !== 0) { // Ensure the offset aligns with the image size
			offset[i] = Math.round(offset[i] / image_size[1]) * image_size[1]
		}	

		reel[i].css('transform', 'translate(0px, ' + offset[i] + 'px)')
	}

	this.stop = function(){
		let result = self.win_lose(self.get_results_pos())
		self.drawResultsArray(result)
	}

	this.get_results_pos = function(){
		let array = []
		for(let i in offset){
			for(let j in images_pos[i]){
				if(images_pos[i][j].pos === -offset[i]){
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
		return formatArray(array)
	}
	function formatArray(inputArray) {
		const result = []
		let howManyColumns = 3 //there are always 3 veggies on a column
		let t = -1
		for(let i = 0; i < howManyColumns; i ++){
			t++
			for(let j = 0; j < inputArray.length; j += lines){
				result.push(inputArray[t + j])	
			}
		}
		return splitArray(result, howManyColumns)
	}
	function splitArray(array, chunkSize){
		const result = []
		for (let i = 0; i < array.length; i += chunkSize){
			result.push(array.slice(i, i + chunkSize))
		}
		return result
	}

	this.win_lose = function(array){
		let win_results = []
		let matrix = slotsData.matrix
		for(let i in matrix){
			let elementArray = getArrayFromMatrix(array, matrix[i].matrix)
			if(checkWinner(elementArray)){
				win_results.push({matrix: matrix[i]})
			}
		}
		return win_results
	}
	function getArrayFromMatrix(array, matrix){
		if(array && array.length > 0){
			const elementArray = matrix.map(([i, j]) => array[i][j].img.id)
    		return elementArray
		}
		return []
	}
	function checkWinner(array){
		if(array.length === 0){ //something went wrong
			return false
		}
	
		let trump_cards = array.length === 3 ? ["carrot"] : ["carrot"]	
		
		let array_small = array.filter(item => !trump_cards.includes(item)) //contains array minus the trump_card elements
		const allIdentical = array_small.every(item => item === array_small[0]) //Check if array_small has all identical elements		
		if(allIdentical){ //If array_small has all identical elements, return true
			return true
		}
	
		// If array_small has more than one unique element, return false
		if(new Set(array_small).size > 1){
			return false
		}
	
		// Check specific cases with trump cards
		for(let i = 0; i < array.length - 1; i++){
			if(array[i] !== array[i + 1] && !trump_cards.includes(array[i]) && !trump_cards.includes(array[i + 1])){
				return false
			}
		}	
		
		return true
	}

	this.drawResultsArray = function(results){
		if(results && results.length > 0){
			let pay = 0
			for(let i in results){
				let prize = results[i].matrix.prize
				pay = pay + prize		
			}
			blinkLines(results).then(()=>{
				self.pay(pay, true)
			})
		} else {
			self.pay(slotsBets, false)
		}
	}
	function blinkLines(results){
		return new Promise(function(resolve, ){
			let canvas = $('#slot_machine_lines')[0]
			if(canvas){
				ctx = canvas.getContext("2d")
				let blinkCount = 0
				let blinkInterval = setInterval(() => {
					ctx.clearRect(0, 0, canvas.width, canvas.height)
					if (blinkCount % 2 === 0) {
						for(let i in results){
							let matrix = results[i].matrix.matrix
							drawLines(matrix, ctx)
						}
					}

					blinkCount++

					if (blinkCount >= 6) {
						clearInterval(blinkInterval)
						resolve(true)
					}
				}, 500)			
			}
		})
	}
	function drawLines(matrix, ctx){
		let border = 5
		let width = reel.length * (image_size[0] + 2 * border)
		let height = 3 * image_size[1] + 2 * border
		let cube = [width/reel.length, height/3]

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
	this.pay = function(pay, win){
		if(typeof props.handlePay === "function"){
            props.handlePay(pay, win)
        }
	}
}

function SlotsGame(props){
	const {settings, slotsData, slotsStatus, slotsBets, lines, items, imagePos, width} = props
    const {lang} = settings
    let dispatch = useDispatch()
    let options = {...props, slotsData, slotsBets, lines, items, dispatch}
    let my_slots = new slots_game(options)

    useEffect(() => {
		if(my_slots){
			my_slots.ready()			
			$(window).resize(()=>{
				my_slots.ready('resize')
			})
		}
    }, [])

	useEffect(() => {
		if(slotsStatus && my_slots){
			my_slots.start(imagePos)
			if(typeof props.updateStatus === "function"){
				props.updateStatus(false)
			}
		}
    }, [slotsStatus])

	function handleShowPrizes(){
		if(typeof props.handleShowPrizes === "function"){
			props.handleShowPrizes()
		}
	}

    return <div id="slot_machine" className={"slot_machine " + "slot_machine_" + lines}>
		<canvas id="slot_machine_lines" />
		{(() => {
			switch(lines){
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
}

export default SlotsGame