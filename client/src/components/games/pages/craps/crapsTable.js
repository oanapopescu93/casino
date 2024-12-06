import React, {useEffect} from 'react'
import { getMousePos, get_craps_bets, isInside } from '../../../../utils/games'
import $ from 'jquery'

function craps_bets(props){
    let self = this
	const { images, bet, getData } = props
	
	let canvas
	let ctx
	let items = get_craps_bets()
	let crapsBetsCoord = [0, 0, 2243, 1191, 0, 0, 900, 450] //sx,sy,swidth,sheight,x,y,width,height	
	let gameType = "pass line"
	let gameOdds = 2

    this.ready = ()=>{		
		self.createCanvas()
		self.chooseBets()
		self.handleClick()
    }

    this.createCanvas = ()=>{
		canvas = document.getElementById("craps_bets_canvas")
		ctx = canvas.getContext("2d")
		canvas.width = 900
		canvas.height = 450
		crapsBetsCoord = [0, 0, 2243, 1191, 0, 0, 900, 450]
	}	

	this.chooseBets = ()=>{
		self.drawBets(images[0])
	}

	this.drawBets = (img)=>{
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage(img, ...crapsBetsCoord)
	}

	this.handleClick = ()=>{
        const canvasElement = $('#craps_bets_canvas')
		if(canvasElement.length){
			canvasElement.off('click').on('click', (e) => {
				const mousePos = getMousePos(canvas, e)
				self.canvasClick(mousePos)
			})
		}
    }

	this.canvasClick = (mouse)=>{
		for(let i in items){
			if (items[i].id !== "craps" && isInside(mouse, items[i])) {
				gameType = items[i].text
				gameOdds = items[i].odds
				self.drawBets(images[i])
				getData({gameType, gameOdds, bet: bet})
				break
			}
		}
	}
}

function CrapsTable(props){	
	const {images, clear} = props

	let bet = 1
	let options = {...props, bet}
    let my_craps_bets = new craps_bets(options)

	function ready(){
		if(my_craps_bets && document.getElementById("craps_bets_canvas")){
            my_craps_bets.ready()
        }
	}

    useEffect(() => {
		if(images){
			ready()
		}
    }, [images, clear])

    return <div className="craps_bets_container">
		<canvas id="craps_bets_canvas" />
	</div>
}

export default CrapsTable