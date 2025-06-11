import React, { useEffect } from 'react'
import { translate } from '../../../../translations/translate'
import { randomIntFromInterval, sortList } from '../../../../utils/utils'
import { draw_dot } from '../../../../utils/games'

function slots_game(props){
    let self = this
    const {settings, slotsData, images, slotReels, bet, slotResults} = props
    const {theme} = settings
	
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

    let suffleArray = []
    let offset = []
    let slotsCtx = []
    let ctx

    let imageSize = [100, 100]
	let imageSizeCanvas = [290, 290, 5, 5, 80, 80]	
	let border = 5
    let arrayPos = []
	let imagesPos = props.imagesPos ? props.imagesPos : []

    let running = true
    let state = 0
    let stopped = []
    let slotSpeed = [] // how many pixels per second slots roll
    let speed = 10
    let spinTime = randomIntFromInterval(2000, 5000) // how long all slots spin before starting countdown
	let spinTimeReel = spinTime / slotReels.length
    let now = new Date()
	let lastUpdate = new Date()

	this.ready = ()=>{
        suffleArray = slotsData.array
        offset = self.getOffset()
        self.fit()
        self.createSlotResults()
        self.createSlotReels() 
    }
    this.fit = ()=>{
		imageSize = [100, 100]
		imageSizeCanvas = [290, 290, 5, 5, 80, 80]
		slotSpeed = []
		border = 5
		if (window.innerWidth < 480){
			border = 3
		}
		switch(slotReels.length){
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
    this.getOffset = ()=>{
        return slotReels.map(() => 0)
    }    
    this.createSlotResults = ()=>{
        let width = slotReels.length * (imageSize[0] + 2 * border) 
        let height = 3 * imageSize[1] + 2 * border 
        slotResults.width = width
        slotResults.height = height
    }
    this.createSlotReels = ()=>{
        for(let i in slotReels){
			slotReels[i].style.transform = `translate(0px, 0px)`
            self.createCanvas(slotReels[i])
            self.drawReel(i, slotReels[i])
        }
        props.getImagePos(arrayPos)
    }
    this.createCanvas = (canvas)=>{
		ctx = canvas.getContext("2d")
		slotsCtx.push(ctx)
		canvas.width = imageSize[0]
		canvas.height = 2 * images.length * imageSize[1]
    }
    this.drawReel = (index, canvas)=>{
		slotsCtx[index].clearRect(0, 0, canvas.width, canvas.height)
        slotsCtx[index].fillStyle = lineColor

        let array = []        
        arrayPos[index] = []
        const length = images.length
        const shuffledImages = self.suffleImages(index, images)

        shuffledImages.forEach((img, i) => {
            const t = parseInt(i, 10)

            // Draw divider lines
            slotsCtx[index].fillRect(0, t * canvas.width, canvas.width, 2)
            slotsCtx[index].fillRect(0, (t + length) * canvas.width, canvas.width, 2)

            // Extract image properties
            const sx = img.getAttribute("coord_x")
            const sy = img.getAttribute("coord_y")
            const swidth = imageSizeCanvas[0]
            const sheight = imageSizeCanvas[1]
            const x = imageSizeCanvas[2]
            const y = imageSizeCanvas[3] + i * imageSize[1]
            const width = imageSizeCanvas[4]
            const height = imageSizeCanvas[5]

            // Draw the images
            slotsCtx[index].drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
            slotsCtx[index].drawImage(img, sx, sy, swidth, sheight, x, (t + length) * canvas.width, width, height)

            // Add position data to the array
            const pos1 = t * canvas.width
            const pos2 = (t + length) * canvas.width

            array.push({ i: t, img, pos: pos1 })
            array.push({ i: t + length, img, pos: pos2 })            
        })

        array = sortList(array, "i")
        arrayPos[index] = array    
    }
    this.suffleImages = (index, images)=>{
		let myImages = []
		for(let i in suffleArray[index]){
			let t = suffleArray[index][i]
			myImages.push(images[t])
		}
		return myImages
	}

    this.spinReels = ()=>{
        self.spin()
    }
	this.spin = ()=>{
		self.reset()
        
        window.requestAnimFrame = (()=>{
			return  window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame		||
			window.mozRequestAnimationFrame			||
			((callback) => window.setTimeout(callback, 1000 / 60))
	    })()

	  	function spinSlot(){
			self.update()
			if(running){
				window.requestAnimationFrame(spinSlot)
			} else {				
				self.stop()
			}
		}
		
		spinSlot()
	}
	this.reset = ()=>{
		running = true
		state = 0
		stopped = []
		slotSpeed = []
        offset = self.getOffset()
        
        slotReels.forEach(() => {
			stopped.push(false)
			slotSpeed.push(speed)
		})
		
        //clear slot results
		let ctx_lines = slotResults.getContext("2d")
		ctx_lines.clearRect(0, 0, slotResults.width, slotResults.height)
	}
    this.update = ()=>{
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
					state = 1
					lastUpdate = now
				}
				break
			case 6:                
				running = false
				break
			default: // stop slots one after the other                
				stopped[state-1] = check_slot(state-1)
				if (stopped[state-1]) {
					slotSpeed[state-1] = 0
					state++
					lastUpdate = now
				}
		}
		
		for (let i in slotReels) {
			self.rotate(i, slotSpeed[i])
		}

        for (let i in slotReels) {
			if (slotSpeed[i] === 0 && offset[i] % imageSize[1] !== 0) {
				self.running = true
				self.rotate(i, 10)
			}
		}
	}	
	this.rotate = (i, speed)=>{
		offset[i] = offset[i] - speed
		let max_height = -(slotReels[i].height - images.length * imageSize[1])
		
		if (offset[i] < max_height) {
			offset[i] = 0
		}
		
		if (slotSpeed === 0 && offset[i] % imageSize[1] !== 0) { // Ensure the offset aligns with the image size
			offset[i] = Math.round(offset[i] / imageSize[1]) * imageSize[1]
		}	

		slotReels[i].style.transform = `translate(0px, ${offset[i]}px)`
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
				result.push(inputArray[j])
			}
		}		
		return splitArray(result, slotReels.length)
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
	
		let trump_cards = array.length === 3 ? [] : ["carrot"]	
		
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
			self.pay(bet, false)
		}
	}
	function blinkLines(results){
		return new Promise((resolve)=>{
			if(slotResults){
				ctx = slotResults.getContext("2d")
				let blinkCount = 0
				let blinkInterval = setInterval(() => {
					ctx.clearRect(0, 0, slotResults.width, slotResults.height)
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
		let width = slotReels.length * (imageSize[0] + 2 * border)
		let height = 3 * imageSize[1] + 2 * border
		let cube = [width/slotReels.length, height/3]

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
		props.handleResult(pay, win)
	}
}

function SlotsGame(props){
    const {settings, lines, slotsData, images, slotReels, slotResults, width, startGame, handleShowPrizes} = props
    const {lang} = settings

    let options = {...props}
    let my_slots = new slots_game(options)    

    function ready(){
		if(my_slots){
            my_slots.ready()
        }
	}

	useEffect(() => {        
        if(slotsData && slotsData.array && images && slotReels && slotResults){
            ready()
        } 
	}, [slotsData, images, slotReels, slotResults, width])

    useEffect(() => {        
        if(startGame && my_slots){
            my_slots.spinReels()
        } 
	}, [startGame])

	return <div id="slot_machine" className={"slot_machine " + "slot_machine_" + lines}>        
        <canvas id="slot_results" />
        {(() => {
			switch(lines){
				case 3:
					return <>
						<div className="box"><canvas className="slot_reel" id='slot_reel_1' /></div>
						<div className="box"><canvas className="slot_reel" id='slot_reel_2' /></div>
						<div className="box"><canvas className="slot_reel" id='slot_reel_3' /></div>
					</>
				case 5:
					return <>
						<div className="box"><canvas className="slot_reel" id='slot_reel_1' /></div>
						<div className="box"><canvas className="slot_reel" id='slot_reel_2' /></div>
						<div className="box"><canvas className="slot_reel" id='slot_reel_3' /></div>
						<div className="box"><canvas className="slot_reel" id='slot_reel_4' /></div>
						<div className="box"><canvas className="slot_reel" id='slot_reel_5' /></div>
					</>
				}
		})()}
		{width >= 600 ? <div id="slots_prizes" className="desktop" onClick={()=>handleShowPrizes()}>
			{translate({lang, info: "prizes"})}
		</div> : null}	
	</div>
}

export default SlotsGame