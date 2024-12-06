import React, { useEffect } from 'react'
import { translate } from '../../../../translations/translate'
import { randomIntFromInterval } from '../../../../utils/utils'
import $ from 'jquery'

function slots_game(props){
    let self = this
    const {slotsData, reel, lines, images} = props	

	let suffleArray = []
	let offset = []
	let imageSize = [100, 100]
	let imageSizeCanvas = [290, 290, 5, 5, 80, 80]
	let spinTime = randomIntFromInterval(2000, 4000) // how long all slots spin before starting countdown
	let spinTimeReel = spinTime/5 // how long each slot spins at minimum
	let slotSpeed = [] // how many pixels per second slots roll
	let speed = 10
	let border = 5	
	let imagesPos = []
    let shuffledImages = []
	
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

	this.ready = ()=>{
        slotsCanvas = []
        suffleArray = slotsData.array
        offset = self.get_offset(reel)
        for(let i in reel){
            shuffledImages = self.create_suffle(i, images)
            slotsCanvas.push(reel[i])
            self.createCanvas(slotsCanvas[slotsCanvas.length-1])
			self.draw_reel(slotsCanvas[slotsCanvas.length-1], shuffledImages)
            // reel[i].css('transform', 'translate(0px, 0px)')
        }
		self.fit()
		self.create_slot_machine_lines()

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
		canvas.height = 2 * lines * imageSize[1]
    }
    this.draw_reel = (canvas, assets)=>{
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.fillStyle = lineColor
		let array = []
        
        let length = assets.length
        for(let i = 0 ; i < length ; i++){
            let img = assets[i]

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

    }

    this.spinSlots = ()=>{
        console.log('spinSlots')
    }
}

function SlotsGame(props){
    const {settings, slotsData, lines, width, images, startGame, handleShowPrizes} = props
    const {lang} = settings
    
    let reel = get_reel()
    let options = {...props, reel}
    let my_slots = new slots_game(options)

    function ready(){
		if(my_slots){
            my_slots.ready()
        }
	}

    useEffect(() => {
		if(slotsData && images){
			ready()
		}
    }, [images, width])

    useEffect(() => {
		if(my_slots && startGame){
			my_slots.spinSlots()
		}
    }, [startGame])

    function get_reel(){
        const canvases = document.querySelectorAll('.slot_canvas')
        const reelArray = Array.from(canvases)
        return reelArray
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