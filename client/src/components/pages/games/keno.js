import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import {game_page, keno_calculate_money, keno_get_history} from '../../actions/actions'
import $ from 'jquery'
import { bigText, get_keno_images, showResults } from '../../utils'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/esm/Button'

let my_keno
let kenoSpotArraySelected = []
let kenoSpotWin = []
let winnings = []

function kenoSpot(config){
	let self = this
	self.id = config.id	
	self.i = config.i
	self.j = config.j
	self.space = 5
	self.w = config.w - self.space
	self.h = config.h - self.space
	self.x = config.j * config.w
	self.y = config.i * config.h

	self.color = config.color
	self.border = config.border
	self.border_color = config.border_color
	self.font = config.font
	self.font_color = config.border_color

	self.img = config.img
	self.status = 0
	self.selected = false
	let image_sise = 245

	self.draw = function(ctx){
		if(ctx){
			ctx.clearRect(self.x-1, self.y-1, self.w+2, self.h+2)
			//ctx.drawImage(self.img, 0, 0, image_sise, image_sise, self.x, self.y, self.w, self.h)
			if(self.selected || self.status === 1){
				if(self.selected && self.status === 1){
					self.color = 'rgba(0, 128, 0, 0.2)'
					self.border_color = 'green'
					self.font_color = 'white'
					kenoSpotWin.push(self.id)
				} else if(!self.selected && self.status === 1){
					self.color = 'rgba(255, 0, 0, 0.2)'
					self.border_color = 'red'
					self.font_color = 'white'
				}

				ctx.beginPath()
				ctx.rect(self.x, self.y, self.w, self.h)
				ctx.fillStyle = self.color
				ctx.strokeStyle = self.border_color
				if(self.border){
					ctx.lineWidth = self.border
					ctx.strokeStyle = self.border_color
					ctx.stroke()
				}
				ctx.fill()
			} else {
				ctx.beginPath()
				ctx.rect(self.x, self.y, self.w, self.h)
				ctx.fillStyle = self.color
				ctx.strokeStyle = self.border_color
				if(self.border){
					ctx.lineWidth = self.border
					ctx.strokeStyle = self.border_color
					ctx.stroke()
				}
			}

			//text
			ctx.beginPath()
			ctx.textAlign="center" 
			ctx.textBaseline = "middle"
			ctx.fillStyle = self.font_color
			ctx.font = self.font
			ctx.fillText(self.id, self.x + (config.w / 2), self.y + (config.h / 2))
		}
	}

	self.changeStatus = function(new_status){
		self.status = 1
	}

	self.changeSelection = function(){
		if(self.selected){
			self.selected = false
		} else {
			self.selected = true
		}
	}	
}

function keno_board(props, dispatch){
	let self = this
	let info = props.info
	let data = props.info.data
	let lang = info.lang
	let money = data.money
	let game_choice = info.game_choice
	let socket = info.socket
	let canvas, ctx
	let canvas_width = 900
	let canvas_height = 800
	let font = 'bold 14px sans-serif'
	let kenoSpotArray = []
	let how_many_rows = 10
	let how_many_columns = 8
	let how_many = how_many_rows * how_many_columns
	this.images = []
	let items = get_keno_images()
	let reason = ""
	let start_game = false
	let bet = 1
	let numbers = 10
	let win = 0
	
	this.ready = function(r){
		reason = r
		self.createCanvas(canvas_width, canvas_height)
		if(reason !== "resize"){
			let promises = []
			for(let i in items){				
				promises.push(self.preaload_images(items[i]))
			}

			Promise.all(promises).then(function(result){
				self.images = result
				self.KenoBoardCreate()
				self.KenoBoardDraw()
				self.KenoBoardClick()
			})

			self.getWinnings().then(function(res){
				winnings = res
			})
		} else {
			self.KenoBoardCreate()
			self.KenoBoardDraw()
			self.KenoBoardClick()
		}
	}

	this.getWinnings = function(){
		return new Promise(function(resolve, reject){
			socket.emit('keno_send', 'winnings')
			socket.on('keno_read', function(data){
				if(data){
					resolve(data)
				} else {
					resolve([])
				}
			})
		})
	}
	
	this.createCanvas = function(canvas_width, canvas_height){		
		canvas = document.getElementById("keno_canvas")	
		ctx = canvas.getContext("2d")
		
		if (window.innerWidth < 960){
			if(window.innerHeight < window.innerWidth){
				//small landscape				
				canvas.width = 320
				canvas.height = 300
			} else {
				//small portrait
				canvas.width = 280
				canvas.height = 300
			}
			font = 'bold 10px sans-serif'
			
		} else {
			//big
			canvas.width = 900
			canvas.height = 500
			font = 'bold 14px sans-serif'
		}
		
		canvas_width = canvas.width
		canvas_height = canvas.height	
		canvas.height = canvas_height
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

	this.KenoBoardCreate = function(){
		let kenoSpotArray_new = []
		let number = 0	
		for(let i=0; i < how_many_columns; i++){
			for(let j=0; j < how_many_rows; j++){
				number++
				let config = {
					id: number,
					i: i,
					j: j,
					w: canvas.width / how_many_rows,
					h: canvas.height / how_many_columns,
					color: 'rgba(255, 255, 0, 0.1)',
					border: 1,
					border_color: '#ffd700',
					font: font,
					img: self.images[0],
				}

				if(kenoSpotArraySelected[number-1]){
					config.selected = kenoSpotArraySelected[number-1].selected
				}
				
				let box = new kenoSpot(config)
				kenoSpotArray_new.push(box)				
			}
		}
		kenoSpotArray = kenoSpotArray_new
	}

	this.KenoBoardDraw = function(){
		ctx.clearRect(0,0, canvas.width, canvas.height)
		for(let i in kenoSpotArray){
			kenoSpotArray[i].draw(ctx)
		}
	}	

	this.KenoBoardClick = function(){
		$('#keno_canvas').off('click').on('click', function(event) {
			self.handleClick(event)
		})
	}

	this.handleClick = function(event){	
		if(!start_game){
			let mousePos = getMousePos(canvas, event)
			for(let i in kenoSpotArray){
				if (isInside(mousePos, kenoSpotArray[i])) {
					if(kenoSpotArraySelected.length < 10){
						kenoSpotArray[i].changeSelection()
						kenoSpotArray[i].draw(ctx)
						if(kenoSpotArray[i].selected){
							kenoSpotArraySelected.push(kenoSpotArray[i])
						} else {
							for(let j = 0; j < kenoSpotArraySelected.length; j++){
								if (kenoSpotArraySelected[j].id === kenoSpotArray[i].id) { 
									kenoSpotArraySelected.splice(j, 1)
									j--
								}
							}
						}
						break
					} else {
						if(lang === "ro"){
							showResults("", "Maxim 10 casutele Keno!", 300, false)
						} else {
							showResults("", "Max 10 Keno spots!", 300, false)
						}
					}
				} 
			}
		}
	}

	this.handleClear = function(){
		if(!start_game){
			kenoSpotArraySelected = []
			self.KenoBoardCreate()
			self.KenoBoardDraw()
			self.KenoBoardClick()
			self.deselectAll()
		}
	}

	this.deselectAll = function(){
		for(let i in kenoSpotArray){
			kenoSpotArray[i].selected = false
		}
	}

	this.quickPick = function(my_numbers){
		self.handleClear()
		generatePick(my_numbers, how_many).then(function(data){
			let quick_pick = data
			for(let i in kenoSpotArray){
				for(let j in quick_pick){
					if(kenoSpotArray[i].id === quick_pick[j]){
						kenoSpotArray[i].changeSelection()
						kenoSpotArray[i].draw(ctx)
						if(kenoSpotArray[i].selected){
							kenoSpotArraySelected.push(kenoSpotArray[i])
						}
						break
					}
				}
			}
		})
	}

	this.handleStart = function(my_bet, my_numbers){
		bet = my_bet
		numbers = my_numbers
		if(!start_game){
			start_game = true
			self.KenoBoardCreate()
			self.KenoBoardDraw()
			self.deselectAll()
			generatePick(numbers, how_many).then(function(data){
				self.play(data)			
			})
		}
	}

	this.play = function(data){
		let picks = data 
		kenoSpotWin = []
		for(let i in kenoSpotArray){
			for(let j in kenoSpotArraySelected){
				if(kenoSpotArray[i].id === kenoSpotArraySelected[j].id){
					kenoSpotArray[i].changeSelection()
					break
				}
			}
			for(let j in picks){
				if(kenoSpotArray[i].id === picks[j]){
					kenoSpotArray[i].changeStatus()
					break
				}
			}
			kenoSpotArray[i].draw(ctx)
		}
		self.win_lose(picks)
	}

	this.win_lose = function(picks){
		start_game = false
		let title
		let keno_info
		let text
		if(lang === "ro"){
			title = "Rezultat"
			keno_info = `
			<div class="keno_info">
				<div class="keno_info_box">
					<span>Numerele tale: </span>
					<span id="keno_selected01">-</span>
				</div>
				<div class="keno_info_box">
					<span>Numerele alese: </span>
					<span id="keno_selected02">-</span>
				</div>
				<div class="keno_info_box">
					<span>Numerele castigatoare: </span>
					<span id="keno_selected03">-</span>
				</div>
				<div class="keno_info_box">
					<span>Castigul tau: </span>
					<span id="keno_selected04">-</span>
				</div>
			</div>`
			text = bigText(keno_info)	
		} else {
			title = "Results"
			keno_info = `
			<div class="keno_info">
				<div class="keno_info_box">
					<span>Your numbers: </span>
					<span id="keno_selected01">-</span>
				</div>
				<div class="keno_info_box">
					<span>Chosen numbers: </span>
					<span id="keno_selected02">-</span>
				</div>
				<div class="keno_info_box">
					<span>Winning Numbers: </span>
					<span id="keno_selected03">-</span>
				</div>
				<div class="keno_info_box">
					<span>Your win: </span>
					<span id="keno_selected04">-</span>
				</div>
			</div>`
			text = bigText(keno_info)	
		}

		win = self.calculateWin()

		setTimeout(function(){			
			if(kenoSpotArraySelected && kenoSpotArraySelected.length>0){
				$("#keno_selected01").empty()
				for(let i in kenoSpotArraySelected){
					let comma = ', '
					if(parseInt(i) === kenoSpotArraySelected.length-1){
						comma = ''
					}
					$("#keno_selected01").append('<span class="keno_box">' + kenoSpotArraySelected[i].id + comma + '</span>')
				}
			} else {
				$("#keno_selected01").append('-')
			}	
			if(picks && picks.length > 0){
				$("#keno_selected02").empty()
				for(let i in picks){
					let comma = ', '
					if(parseInt(i) === picks.length-1){
						comma = ''
					}
					$("#keno_selected02").append('<span class="keno_box">' + picks[i] + comma + '</span>')
				}
			} else {
				$("#keno_selected02").append('-')
			}
				
			$("#keno_selected03").empty()
			for(let i in kenoSpotWin){
				let comma = ', '
				if(parseInt(i) === kenoSpotWin.length-1){
					comma = ''
				}
				$("#keno_selected03").append('<span class="keno_box">' + kenoSpotWin[i] + comma + '</span>')
			}
			
			if(win > 0){
				$("#keno_selected03").empty()
				$("#keno_selected03").append('<span class="keno_box">' + win + '</span>')
			}

			$('.keno_info').show()
		}, 1000)
		
		let fireworks_show = false
		if(win > 0){
			fireworks_show = true
		}		
		showResults(title, text, 300, fireworks_show)
		self.pay(picks, win)
	}

	this.calculateWin = function(){
		let my_win = 0
		let numbers_played = numbers
		let numbers_matched = kenoSpotWin.length
		for(let i in winnings){
			if(winnings[i][0] === numbers_played && winnings[i][1] === numbers_matched){
				my_win = winnings[i][2]
				break
			}
		}
		return my_win
	}

	this.pay = function(picks, win){
		let status = 'lose'
		if(win>0){
			status = 'win'
		}		
		let payload = {
			bet_value: bet, 
			money_history: money,
			win: status, 
			kenoSpotArraySelected: kenoSpotArraySelected,
			picks: picks,
			kenoSpotWin: kenoSpotWin,
		}
		dispatch(keno_calculate_money(money))
		dispatch(keno_get_history(payload))
		
		let keno_payload_server = {
			uuid: data.uuid,
			game_choice: game_choice,
			money: money,
			bet: bet,
			status: status,
		}
		// socket.emit('results_send', keno_payload_server)
	}
	
	function generatePick(length, max){
		return new Promise(function(resolve, reject){
			let keno_payload_server = {
				uuid: data.uuid,
				length: length, 
				max: max,
				kenoSpotArraySelected: kenoSpotArraySelected
			}
			socket.emit('keno_send', keno_payload_server)
			socket.on('keno_read', function(data){
				if(data){
					resolve(data)
				} else {
					resolve([])
				}
			})
		})
	}

	function getMousePos(canvas, event) {
		let rect = canvas.getBoundingClientRect()
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		}
	}	
	function isInside(mousePos, obj){
		return mousePos.x > obj.x && mousePos.x < obj.x + obj.w && mousePos.y < obj.y + obj.h && mousePos.y > obj.y
	}
}

function KenoGame(props){
	let dispatch = useDispatch()
	useEffect(() => {
		my_keno = new keno_board(props, dispatch)
		my_keno.ready()		
		$(window).resize(function(){
			if(document.getElementById("keno_canvas")){
				my_keno.ready('resize')
			}
		})
	}, []) 
	return(
		<canvas id="keno_canvas" className="shadow_convex"></canvas>
	)
}

function Keno(props){
	let lang = props.lang
	let money = props.data.money
	const [bet, setBet] = useState(1)
	const [numbers, setNumbers] = useState(10)
	const [saveChanges, setSaveChanges] = useState(false)
	const [title, setTitle] = useState("")
	let dispatch = useDispatch()

	useEffect(() => {
		dispatch(game_page("keno"))
		if (window.innerWidth >= 960){
			setTitle("Keno")		
		} else {
			setTitle("")
		}		
		$(window).resize(function(){
			if (window.innerWidth >= 960){
				setTitle("Keno")		
			} else {
				setTitle("")
			}
		})
	}, []) 	

	function game_keno_start(){
		if(kenoSpotArraySelected && kenoSpotArraySelected.length>0){
			if(my_keno){
				my_keno.handleStart(bet, numbers)
			}
		} else {
			if(saveChanges){
				game_keno_quick_pick()
				if(my_keno){
					my_keno.handleStart(bet, numbers)
				}
			} else {
				if(lang === "ro"){
					showResults("", "Please place your bet before playing.", 300, false)
				} else {
					showResults("", "Please place your bet before playing.", 300, false)
				}
			}
		}		
	}
	function game_keno_clear(){
		if(my_keno){
			my_keno.handleClear()
		}
	}
	function game_keno_quick_pick(){
		if(my_keno){
			my_keno.quickPick(numbers)
		}
	}

	function handleChangeNumbersPlayed(e){
		let my_numbers = parseInt(e.target.value)
		setNumbers(my_numbers)
	}
	function handleChangeMoney(e){
		let my_bet = parseInt(e.target.value)
		setBet(my_bet)
	}

	function game_keno_settings(){
		if($('.keno_bets_container')){
			$('.keno_bets_container').addClass('open')
		}
	}

	function closeSettings(){
		if($('.keno_bets_container')){
			$('.keno_bets_container').removeClass('open')
		}
	}

	function game_keno_rules(){
		let pay_table
		let text
		let title
		if(lang === "ro"){
			pay_table = `
			<div id="keno_rules" class="keno_rules">
				<p>Da click pe casutele Keno si alege pana la 10 casute sau da click pe Alegere aleatoare (va alege aleator 10 casute pentru tine).</p>
				<div id="keno_winnings">
				<table>
					<thead>
						<tr>
							<th>Numere jucate</th>
							<th>Numere potrivite</th>
							<th>Castig</th>
						</tr>
					</thead>
					<tbody class="pay_table_info"></tbody>	
				</table>
				</div>
			</div>`
			text = bigText(pay_table)
			title = "Reguli"
		} else {
			pay_table = `
			<div id="keno_rules" class="keno_rules">
				<p>Pick up to 10 Keno spots or choose Quik Pik (defaults to 10 numbers) by clicking on the number in the Keno card.</p>
				<div id="keno_winnings">
				<table>
					<thead>
						<tr>
							<th>Numbers Played</th>
							<th>Numbers Matched</th>
							<th>Prize Amount</th>
						</tr>
					</thead>
					<tbody class="pay_table_info"></tbody>	
				</table>
				</div>
			</div>`
			text = bigText(pay_table)
			title = "Rules"
		}
		showResults(title, text, 400, false)
		for(let i in winnings){
			let numbers_played = winnings[i][0]
			let numbers_matched = winnings[i][1]
			let prize = winnings[i][2]
			$('.pay_table_info').append("<tr><td class='numbers_played'>"+numbers_played+"</td><td class='numbers_matched'>"+numbers_matched+"</td><td class='prize'>"+prize+"</td></tr>")
		}
	}

	function handleSaveChanges(){
		setSaveChanges(true)
	}

	return (
		<Row className="keno_container">
			<Col sm={12}>
				<h1 className="keno_title">{title}</h1>	
			</Col>
			<Col sm={12}>
				<KenoGame info={props}></KenoGame>
			</Col>
			<div className="keno_bets_container">
				<div className="keno_bets shadow_concav">
					<div className="close" onClick={()=>{closeSettings()}}>x</div>
					<div className="keno_bets_box">
						<div className="game_buttons_box">
							{lang === "ro" ? 
								<p className="game_box_text">Cate numere vrei sa joci?</p> : 
								<p className="game_box_text">How many numbers do you want to play?</p>
							}
							<input onChange={(e) => {handleChangeNumbersPlayed(e)}} className="game_input" type="number" min="1" defaultValue="10" max="10"></input>
						</div>
						<div className="game_buttons_box">
							{lang === "ro" ? 
								<p className="game_box_text">Cati morcovi?</p> : 
								<p className="game_box_text">How many carrots?</p>
							}
							<input onChange={(e) => {handleChangeMoney(e)}} className="game_input" type="number" min="1" defaultValue="1" max={money}></input>
						</div>
						<Button className="button_table shadow_convex" type="button" onClick={()=>handleSaveChanges()}>
                			{lang === "ro" ? <span>Salveaza</span> : <span>Save</span>}
            			</Button>
					</div>
				</div>
			</div>
			<Col sm={12}>
				<div id="keno_start" className="keno_button shadow_convex" onClick={()=>{game_keno_start()}}>Start</div>
				<div id="keno_clear" className="keno_button shadow_convex" onClick={()=>{game_keno_clear()}}><i className="fa fa-trash"></i></div>
				<div id="keno_quick_settings" className="keno_button shadow_convex" onClick={()=>{game_keno_settings()}}>
					{lang === "ro" ? <span>Schimba setarile</span> : <span>Change settings</span>}
				</div>
				<div id="keno_quick_pick" className="keno_button shadow_convex" onClick={()=>{game_keno_quick_pick()}}>
					{lang === "ro" ? <span>Alegere aleatoare</span> : <span>Random pick</span>}
				</div>
			</Col>
			<Col sm={12}>
				{lang === "ro" ? 
					<p id="keno_rules_button" onClick={()=>{game_keno_rules()}}>Click aici pentru a vedea regulile</p> : 
					<p id="keno_rules_button" onClick={()=>{game_keno_rules()}}>Click here to see rules</p>}
			</Col>
		</Row>
	)
}

export default Keno