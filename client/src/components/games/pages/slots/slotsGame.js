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
	let suffleArray = []
	let offset = []

	let imageSize = [100, 100]
	let imageSizeCanvas = [290, 290, 5, 5, 80, 80]
	let spinTime = randomIntFromInterval(2000, 4000) // how long all slots spin before starting countdown
	let spinTimeReel = spinTime/5 // how long each slot spins at minimum
	let slotSpeed = [] // how many pixels per second slots roll
	let speed = 10
	let border = 5
	let images = []
	let imagesPos = props.imagePos ? props.imagePos : []
	
	let slotsCanvas = []
	let slotsCtx = []
    let ctx

	self.state = 0
	let now = new Date()
	let lastUpdate = new Date()

	let theme = props.settings.theme
	let lineColor = ""
    switch(theme){
		case "purple":
			lineColor = "#ffb3c1"
			break
		case "black":
			lineColor = "#99ff99"
			break
		case "blue":
			lineColor = "#ffcc99"
			break
		case "green":
		default:
			lineColor = "#ffec80"
			break
	}

	this.ready = (reason)=>{
        suffleArray = slotsData.array
		self.fit()
        reel = self.get_reel()
        offset = self.get_offset(reel)
		self.create_slot_machine_lines()
		slotsCanvas = []
		if(reason !== "resize"){ //first time load
			let promises = []
			for(let i in items){
				promises.push(self.preaload_images(items[i]))
			}
			Promise.all(promises).then((result)=>{
				for(let i in reel){
					slotSpeed.push(speed)
					images = self.create_suffle(i, result)
					slotsCanvas.push(reel[i][0])
					self.createCanvas(slotsCanvas[slotsCanvas.length-1])
					self.draw_reel(slotsCanvas[slotsCanvas.length-1], images, false)					
				}
				props.getImagePos(imagesPos)
			})
		} else { //resize
			for(let i in reel){
				slotSpeed.push(speed)
				slotsCanvas.push(reel[i][0])
				self.createCanvas(slotsCanvas[slotsCanvas.length-1])
				self.draw_reel(slotsCanvas[slotsCanvas.length-1], imagesPos[i], true)
				reel[i].css('transform', 'translate(0px, 0px)')			
			}
			props.getImagePos(imagesPos)
		}
    }

	this.fit = ()=>{
		imageSize = [100, 100]
		imageSizeCanvas = [290, 290, 5, 5, 80, 80]
		slotSpeed = []
		border = 5
		if (window.innerWidth < 480){
			border = 3
		}
		switch(lines){
			case 3:
				if (window.innerWidth <= 768 || window.innerHeight <= 400) {
					imageSize = [70, 70]
					imageSizeCanvas = [290, 290, 3, 3, 60, 60]
				}
				if (window.innerWidth < 480){					
					imageSize = [70, 70]
					imageSizeCanvas = [290, 290, 3, 3, 60, 60]
				}
				break
			case 5:
			default:
				if (window.innerWidth < 767){
					imageSize = [70, 70]
					imageSizeCanvas = [290, 290, 3, 3, 60, 60]
				}
				if (window.innerWidth < 600){
					imageSize = [60, 60]
					imageSizeCanvas = [290, 290, 3, 3, 50, 50]
				}
				if (window.innerWidth < 480){
					imageSize = [50, 50]
					imageSizeCanvas = [290, 290, 3, 3, 40, 40]
				}
				if (window.innerWidth < 400){
					imageSize = [40, 40]
					imageSizeCanvas = [290, 290, 3, 3, 30, 30]
				}
				if (window.innerWidth < 321){
					imageSize = [30, 30]
					imageSizeCanvas = [290, 290, 3, 3, 20, 20]
				}
				break
		}
	}
	this.get_reel = ()=>{
        let reel = []
		$('.slot_canvas').each(()=>{
            reel.push($(this))
        })
		return reel
	}
    this.get_offset = (reel)=>{
        return reel.map(() => 0)
	}
	this.create_slot_machine_lines = ()=>{
		if(reel){
			let canvas_lines = $('#slot_machine_lines')[0]
			let width = reel.length * (imageSize[0] + 2 * border) 
			let height = 3 * imageSize[1] + 2 * border 
			canvas_lines.width = width
			canvas_lines.height = height
		}	
	}

	this.preaload_images = (item)=>{
		return new Promise((resolve)=>{
			let image = new Image()
			image.id = item.id
			image.src = item.src
			image.setAttribute('coord_x', item.coord[0])
			image.setAttribute('coord_y', item.coord[1])
			image.addEventListener("load", ()=>{
				resolve(image)
			}, false)
		})
	}
	this.create_suffle = (i, images)=>{
		let myImages = []
		for(let j in suffleArray[i]){
			let t = suffleArray[i][j]
			myImages.push(images[t])
		}
		return myImages
	}
	this.createCanvas = (canvas)=>{
		ctx = canvas.getContext("2d")
		slotsCtx.push(ctx)
		canvas.width = imageSize[0]
		canvas.height = 2 * items.length * imageSize[1]
    }
	this.draw_reel = (canvas, assets, resize=false)=>{
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.fillStyle = lineColor
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
				let swidth = imageSizeCanvas[0]
				let sheight = imageSizeCanvas[1]
				let x = imageSizeCanvas[2]
				let y = imageSizeCanvas[3] + i * imageSize[1]
				let width = imageSizeCanvas[4]
				let height = imageSizeCanvas[5]
				ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
				ctx.drawImage(img, sx, sy, swidth, sheight, x, (i + length) * canvas.width, width, height)

				let elem = {i, img, pos:i * canvas.width}
				array.push(elem)
				elem = {i:i + length, img, pos:(i + length) * canvas.width}
				array.push(elem)
            }

            array = sortList(array, 'i')
            if(!resize){
                imagesPos.push(array)
            }
        }
    }

	this.start = (e)=>{
		self.spin(e)
	}
	this.spin = (e)=>{
		self.reset()
		imagesPos = e

		window.requestAnimFrame = (()=>{
			return  window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame		||
			window.mozRequestAnimationFrame			||
			((callback) => window.setTimeout(callback, 1000 / 60))
	    })()

	  	function spinSlot(){
			self.update(self.state)
			if(self.running){
				window.requestAnimationFrame(spinSlot)
			} else {				
				self.stop()
			}
		}
		
		spinSlot()
	}
	this.reset = ()=>{
		self.running = true
		self.state = 0
		self.stopped = []
		slotSpeed = []
		self.fit()
        reel = self.get_reel(props.lines)
        offset = self.get_offset(reel)
		reel.forEach(() => {
			self.stopped.push(false)
			slotSpeed.push(speed)
		})
		let canvas_lines = $('#slot_machine_lines')[0]
		let ctx_lines = canvas_lines.getContext("2d")
		ctx_lines.clearRect(0, 0, canvas_lines.width, canvas_lines.height)
	}
	this.update = (state)=>{
		now = new Date()
		
		function check_slot(index) {
			if (now - lastUpdate > spinTimeReel) {
				return true
			}
			if (offset[index] % imageSize[1] === 0) {
				return true
			}
			return false
		}
		
		switch (state) {
			case 0: // all slots spinning
				if (now - lastUpdate > spinTime) {
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
					slotSpeed[state-1] = 0
					self.state++
					lastUpdate = now
				}
		}
		
		for (let i in reel) {
			self.rotate(i, slotSpeed[i])
		}
		
		for (let i in reel) {
			if (slotSpeed[i] === 0 && offset[i] % imageSize[1] !== 0) {
				self.running = true
				self.rotate(i, 10) // Adjust this speed as needed
			}
		}
	}
	
	this.rotate = (i, slotSpeed)=>{
		offset[i] = offset[i] - slotSpeed
		let max_height = -(reel[i][0].height - items.length * imageSize[1])
		
		if (offset[i] < max_height) {
			offset[i] = 0
		}
		
		if (slotSpeed === 0 && offset[i] % imageSize[1] !== 0) { // Ensure the offset aligns with the image size
			offset[i] = Math.round(offset[i] / imageSize[1]) * imageSize[1]
		}	

		reel[i].css('transform', 'translate(0px, ' + offset[i] + 'px)')
	}

	this.stop = ()=>{
		let positions = self.get_results_pos()
		let result = self.win_lose(positions)
		self.drawResultsArray(result)
	}

	this.get_results_pos = ()=>{
		let array = []		
		for(let i in offset){			
			for(let j in imagesPos[i]){
				if(imagesPos[i][j].pos === -offset[i]){
					let t = j-1
					for(let k=0; k<3; k++){
						t++
						if(!imagesPos[i][t]){
							t = 0
						}
						array.push(imagesPos[i][t])
					}
					break
				}
			}
		}		
		return formatArray(array)
	}
	function formatArray(inputArray) {
		const result = []
		const columns = 3		
		for (let i = 0; i < columns; i++) {			
			for (let j = i; j < inputArray.length; j += columns) {
				result.push(inputArray[j]);
			}
		}		
		return splitArray(result, reel.length)
	}
	function splitArray(array, chunkSize){
		const result = []
		for (let i = 0; i < array.length; i += chunkSize){
			result.push(array.slice(i, i + chunkSize))
		}
		return result
	}

	this.win_lose = (array)=>{
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

	this.drawResultsArray = (results)=>{
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
		return new Promise((resolve)=>{
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
		let width = reel.length * (imageSize[0] + 2 * border)
		let height = 3 * imageSize[1] + 2 * border
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
	this.pay = (pay, win)=>{
		props.handlePay(pay, win)
	}
}

function SlotsGame(props){
	const {settings, slotsData, slotsStatus, slotsBets, lines, items, imagePos, width, handleShowPrizes} = props
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
			props.updateStatus(false)
		}
    }, [slotsStatus])

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