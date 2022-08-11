import React, {useEffect, useState, useRef} from 'react';
import $ from 'jquery';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { bigText, get_craps_bets, showResults } from '../../utils';

let move = 0;
let prev_move = 0;
let move_array = [];
let my_craps_bets;

function craps_bets(props){
	let self = this;
	this.images = [];
	let reason = "";
	let canvas;
	let ctx;
	let canvas_width_bets = 900;
	let canvas_height_bets = 450;
	let items = get_craps_bets();
	let craps_bets_coord = [0, 0, 2243, 1191, 0, 0, 900, 450]; //sx,sy,swidth,sheight,x,y,width,height	
	let game_type = "pass line";

	this.ready = function(r){
		canvas = document.getElementById("craps_bets_canvas");	
		if(canvas){
			reason = r;
			self.createCanvas(canvas_width_bets, canvas_height_bets);
			self.getImage(reason);
			self.craps_click();
		}
	}

	this.createCanvas = function(canvas_width_bets, canvas_height_bets){
		ctx = canvas.getContext("2d");
		
		canvas.width = 900;
		canvas.height = 450;
		craps_bets_coord = [0, 0, 2243, 1191, 0, 0, 900, 450];
		
		canvas_width_bets = canvas.width;
		canvas_height_bets = canvas.height;		
		canvas.height = canvas_height_bets;
	}

	this.getImage = function(reason){
		if(reason !== "resize"){
			let promises = [];
			for(let i in items){				
				promises.push(self.preaload_images(items[i]));
			}

			Promise.all(promises).then(function(result){
				self.images = result;
				self.choose_craps_bets();
			});	
		} else {
			self.choose_craps_bets();
		}
	}

	this.preaload_images = function(item){
		return new Promise(function(resolve, reject){
			let image = new Image();
			image.id = item.id;
			image.src = item.src;
			image.addEventListener("load", function() {
				resolve(image)
			}, false);
		});
	}

	this.choose_craps_bets = function(){		
		self.draw_craps_bets(self.images[0]);
	}

	this.draw_craps_bets = function(img){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		let sx = craps_bets_coord[0];
		let sy = craps_bets_coord[1];
		let swidth = craps_bets_coord[2];
		let sheight = craps_bets_coord[3];
		let x = craps_bets_coord[4];
		let y = craps_bets_coord[5];
		let width = craps_bets_coord[6];
		let height = craps_bets_coord[7];
		ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
	}

	this.craps_click = function(){			
		$('#craps_bets_canvas').off('click').on('click', function(event) {
			self.canvas_click(event);
		});

		$('#craps_bets_canvas').off('mousemove').on('mousemove', function(event) {
			let mousePos = getMousePos(event);
			self.draw_craps_bets(self.images[0]);	
			for(let i in items){
				if (items[i].id !== "craps" && isInside(mousePos, items[i])) {
					self.draw_craps_bets(self.images[i]);
					break;
				}
			}
		});
	}
	
	this.canvas_click = function(event){		
		let mousePos = getMousePos(event);
		for(let i in items){
			if (items[i].id !== "craps" && isInside(mousePos, items[i])) {
				game_type = items[i].text;
				self.draw_craps_bets(self.images[i]);
				break;
			}
			// ctx.beginPath();
			// ctx.lineWidth = "1";
			// ctx.strokeStyle = "blue";
			// ctx.rect(items[i].x, items[i].y, items[i].width, items[i].height);
			// ctx.stroke();
		}
	}

	this.get_game_type = function(){
		return game_type;
	}

	this.reset = function(){
		self.draw_craps_bets(self.images[0]);
	}

	function getMousePos(event) {
		let rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}

	function isInside(mousePos, obj){
		return mousePos.x > obj.x && mousePos.x < obj.x + obj.width && mousePos.y < obj.y + obj.height && mousePos.y > obj.y
	}
}

function Dice(props){	
	let number = props.number;
	const [x, setX] = useState(1);

	useEffect(() => {
		setX(Math.floor((Math.random() * 6) + 1));
	}, []); 

	return (
		<div ref={props.innerRef} className="dice_box">
			<div id={'dice'+number} className={"dice dice_" + number + " show_" + x}>
				<div id={"dice_"+number+"_side_one"} className='side one'>
					<div className="dot one_1"></div>
				</div>
				<div id={"dice_"+number+"_side_two"} className='side two'>
					<div className="dot two_1"></div>
					<div className="dot two_2"></div>
				</div>
				<div id={"dice_"+number+"_side_three"} className='side three'>
					<div className="dot three_1"></div>
					<div className="dot three_2"></div>
					<div className="dot three_3"></div>
				</div>
				<div id={"dice_"+number+"_side_four"} className='side four'>
					<div className="dot four_1"></div>
					<div className="dot four_2"></div>
					<div className="dot four_3"></div>
					<div className="dot four_4"></div>
				</div>
				<div id={"dice_"+number+"_side_five"} className='side five'>
					<div className="dot five_1"></div>
					<div className="dot five_2"></div>
					<div className="dot five_3"></div>
					<div className="dot five_4"></div>
					<div className="dot five_5"></div>
				</div>
				<div id={"dice_"+number+"_side_six"} className='side six'>
					<div className="dot six_1"></div>
					<div className="dot six_2"></div>
					<div className="dot six_3"></div>
					<div className="dot six_4"></div>
					<div className="dot six_5"></div>
					<div className="dot six_6"></div>
				</div>					
			</div>
			<div className="shadow_convex"></div>
		</div>
	);
}

function CrapsBoardText(props){	
	if(props.info && move !== prev_move){ //fix re-rendering
		move_array.push(props.info);
		prev_move = move;
		return(
			<>
				{
					move_array.map(function(item, i){
						let dices = item.dices;
						let point = item.point;
						let sum = item.sum;
						if(dices === "Craps!!!" || dices === "Natural!!!"){
							return <div key={i} className="craps_board_text"><span className="text text01">{dices}</span></div>
						} else if(point){
							return <div key={i} className="craps_board_text"><span className="text text01">Dices:</span><span className="text text02">{dices[0]}, {dices[1]}</span><span className="text text03">Sum:</span><span className="text text04">{sum}</span><span className="text text05">Point:</span><span className="text text06">{point}</span></div>
						} else {
							return <div key={i} className="craps_board_text"><span className="text text01">Dices:</span><span className="text text02">{dices[0]}, {dices[1]}</span><span className="text text03">Sum:</span><span className="text text04">{sum}</span></div>	
						}
					})
				}
			</>
		)
	} else {
		return '';
	}		
}

function Craps(props){
	let lang = props.lang;
	let socket = props.socket;
	let money = props.info.money;
	
	const [open, setOpen] = useState("");
	const [title, setTitle] = useState("");
	const [crapsBoardText, setCrapsBoardText] = useState(null);
	const [moneyTotal, setMoneyTotal] = useState(money-1);
	const [bet, setBet] = useState(1);
	const [gameType, setGameType] = useState("pass line");

	let craps_board = useRef(null);
	const dice1 = useRef(null);
	const dice2 = useRef(null);
	let dice_array = [dice1, dice2];
	let dicesNumber = [];	
	

	function handleChange(e){
		setBet(e.target.value);
		setMoneyTotal(money-e.target.value);
	}

	function game_craps_rules(){
		if(lang === "ro"){
			let pay_table = `
			<div id="craps_rules" class="craps_rules">
				<p>
					<b>Pass Line Bet: </b>
					Jucatorul pariaza ca cel care arunca zarurile va obtine 7 sau 11 în prima aruncare. 
					Daca iese 2, 3 sau 12 (Craps) pariul este pierdut. 
					Daca rezultatul este 4, 5, 6, 8, 9 sau 10 se spune ca shooter-ul a rostogolit un punct. 
					Pentru a castiga el trebuie sa încerce sa obţina aceeasi valoare înainte de a rostogoli un 7, indiferent cate runde sunt necesare. 
					De ce 7? Pentru ca acesta este cel mai probabil rezultat în Craps.
				</p>
				<p>
					<b>Don't Pass Line: </b>
					Pariază că jucătorul care aruncă va obține un total de 2 sau 3. 
					Dacă se obţine 7 sau 11 pariul este pierdut, iar dacă totalul este 12 va fi egalitate şi primeşti banii înapoi. 
					Orice alt total va duce spre o rundă următoare, care pornește de la acel număr.
				</p>
				<p>
					<b><b>Come Bet:</b>
					Este câştigător dacă se obţine 7 sau 11, iar dacă rezultatul este 2, 3 sau 4 va fi pierzător. 
					Dacă rezultatul este un punct (4, 5, 6, 8, 9 sau 10), 
					pariul va acoperi acel număr devenind un Pariu Point 
					şi este câştigător dacă numărul punct apare din nou ca rezultat înainte de obţinerea unui 7. 
					Dacă se obţine 7 înaintea numărului punct pariul este pierdut. 
					Pariul poate fi plasat doar după stabilirea unui punct.
				</p>
				<p>
					<b><b>Don't Come:</b>
					Acest pariu este echivalent cu cel Don’t Pass Line, 
					unica diferenţă fiind aceea că miza nu poate fi pusă decât după ce a fost rostogolit primul punct.
				</p>
			</div>`;
			let text = bigText("craps_rules", lang, pay_table);
			showResults("Rules", text, 400);
		} else {
			let pay_table = `
			<div id="craps_rules" class="craps_rules">
				<b>Pass Line Bet:</b>
					Players are betting that on the first roll 7 or 11 rolls to win, 2, 3, or 12 loses. 
					If a number such as: 4, 5, 6, 8, 9 or 10 rolls, the number must repeat before a seven to win.
				</p>			
				<p>
				<b>Don’t Pass Bet:</b>
					Player betting that on the first roll 2 or 3 rolls to win, 12 is a push, 7 or 11 loses. 
					If a number such as: 4, 5, 6, 8, 9 or 10 rolls, a seven must roll before the number repeats.
				</p>				
				<p>
				<b>Come Bet:</b>
					Is just like the pass line bet, same rules apply. It’s a game within a game.
				</p>				
				<p>
				<b>Don’t Come Bet:</b>
					Is similar to the Don’t Pass bet, same rules apply. It’s a game within a game.
				</p>				
				<p>
				<b>Field Bet:</b>
					If any of the numbers that are in the field box come out, player wins. 
					A field bet can also be referred to as a “ONE ROLL BET.”
				</p>			
				<p>
				<b>Place Bet:</b>
					Wagers made on the point numbers (4, 5, 6, 8, 9 or 10) that are not contract bets. 
					A Place Bet is “off” on the come-out roll unless the player indicates otherwise.
				</p>			
				<p>
				<b>Proposition Bet:</b>
					One roll bet, the numbers are 2, 3, 7, 11 and 12.
				</p>
			</div>`;
			let text = bigText("craps_rules", lang, pay_table);
			showResults("Craps rules", text, 400);
		}
		
	}

	function check_win_lose(win, bet){
		let pay = bet;
		if(bet){
			if(win === 'win'){
				if(lang === "ro"){
					showResults("Resultate", "Ai castigat "+pay+" morcovi!");
				} else {
					showResults("Results", "You won "+pay+" carrots!");
				}			
			} else if(win === 'push'){
				if(lang === "ro"){
					showResults("Push", "Iti iei morcovii inapoi!");
				} else {
					showResults("Push", "You take your carrots back!");
				}			
			} else {
				if(lang === "ro"){
					showResults("Resultate", "Ai pierdut "+pay+" morcovi!");
				} else {
					showResults("Results", "You lost "+pay+" carrots!");
				}
			}
		}
	}	

	function show_on_board(dicesNumber, sum, point){
		move++
		setCrapsBoardText({dices: dicesNumber, sum: sum, point: point});	
		scrollToBottom();
	}

	function animate(dice, roll){
		if(dice && roll){			
			for (let i = 1; i <= 6; i++) {
				$(dice).removeClass('show_' + i);
				if (roll === i) {
					$(dice).addClass('show_' + i);
				}
			}
		}
	}

	function roll(point){
		return new Promise(function(resolve, reject){
			getNumbers(point).then(function(res){
				if(dice_array && dice_array.length>0 && res && res.length>0){
					for(let i in res){
						if(dice_array[i] && dice_array[i].current){
							let dice = $(dice_array[i].current).children()[0];
							let roll = res[i];				
							animate(dice, roll);
						}
				   	}					
					dicesNumber = res;
					resolve(res);
				} else {
					resolve(false);
				}
			});
		});
	}

	function getNumbers(point){
		return new Promise(function(resolve, reject){
			let dice_number1 = getDiceNumber(dice_array[0]);
			let dice_number2 = getDiceNumber(dice_array[1]);
			let payload={how_many_dices:2, user_table: props.info.user_table, point:point, before: [dice_number1, dice_number2]}
			socket.emit('craps_send', payload);
			socket.on('craps_read', function(data){
				if(data){
					resolve(data);
				}
			});	
		});
	};

	function getDiceNumber(dice){
		let x;
		if(dice && dice.current){
			let child = $(dice.current).children()[0];
			let classList = $(child).attr('class').split(/\s+/);
			for(let i in classList){
				if(classList[i].indexOf("show_") > -1){
					x = parseInt(classList[i].replace("show_", ""));
					break;
				}
			}
		}
		return x;
	}
	
	function game_bet(){
		setOpen("open");
	}

	function game_close(){
		setOpen("");
	}

	function scrollToBottom(){		
		if(craps_board && craps_board.current){
			let board = craps_board.current;
			let height = $(board)[0].scrollHeight;
			$(board).animate({scrollTop: height},"fast");
		}
	}

	function canvas_click(){
		if(typeof my_craps_bets !== "undefined"){
			let get_game_type = my_craps_bets.get_game_type();
			setGameType(get_game_type);
		}
	}

	function canvas_clear(){
		setGameType("pass line");
		if(typeof my_craps_bets !== "undefined"){
			my_craps_bets.reset();
		}
	}

	function game_start(){
		if(moneyTotal >= 0){
			let timer;
			let state = 1;
			let point = 0;
			let sum;
			move_array = [];
			setCrapsBoardText(null);
			switch(gameType) {
				case "don't pass line": // still under construction
					timer = setInterval(function () {				
						switch(state) {
							case 1:
								roll(point).then(function(res){
									sum = dicesNumber[0] + dicesNumber[1];		
									if(sum === 7|| sum === 11){
										//Craps
										state = 4;
										show_on_board("Craps!!!", sum);
									} else {
										point = sum;
										state = 3;
										show_on_board(dicesNumber, sum, point);
									}
								});
								break;
							case 2:
								check_win_lose('win', bet);
								clearInterval(timer);
								break;
							case 3:
								roll(point).then(function(res){
									sum = dicesNumber[0] + dicesNumber[1];
									show_on_board(dicesNumber, sum, point);
									if (sum !== point) {
										state = 2;
									} else if (sum === 12) {
										check_win_lose('push', bet);
										clearInterval(timer);
									} else if (sum === 2 || sum === 3) {
										//Natural
										state = 2;
										show_on_board("Natural!!!", sum);
									} else {
										state = 3;
									}
								});
								break;
							case 4:
								check_win_lose('lose', bet);
								clearInterval(timer);
								break;
						}
					}, 3000);
					break;
				default:
					timer = setInterval(function () {				
						switch(state) {
							case 1:
								roll(point).then(function(res){
									sum = dicesNumber[0] + dicesNumber[1];
									if(sum === 7|| sum === 11){
										//Natural
										state = 2;
										show_on_board("Natural!!!", sum);
									} else {
										point = sum;
										state = 3;
										show_on_board(dicesNumber, sum, point);
									}
								});
								break;
							case 2:
								check_win_lose('win', bet);
								clearInterval(timer);
								break;
							case 3:
								roll(point).then(function(res){
									sum = dicesNumber[0] + dicesNumber[1];
									show_on_board(dicesNumber, sum, point);
									if (sum === point) {
										state = 2;
									} else if (sum === 7) {
										state = 4;
									} else if (sum === 2 || sum === 3 || sum === 12) {
										//craps
										state = 4;
										show_on_board("Craps!!!", sum);
									} else {
										state = 3;
									}
								});
								break;
							case 4:
								check_win_lose('lose', bet);
								clearInterval(timer);
								break;
						}
					}, 3000);
			}
		} else {
			if(lang === "ro"){
				showResults("Nu ai suficienti morcovi!", "Du-te in contul tau, la sectiunea Market si cumpara.", 600);
			} else {
				showResults("You don't have enough carrots!", "Go to your account, at the Market Section and buy some.", 600);
			}
		}
	}

	useEffect(() => {
		let table = props.info.table;
		table = table.charAt(0).toUpperCase() + table.slice(1);
		if (window.innerWidth >= 960){
			setTitle(table);		
		} else {
			setTitle("");
		}
		
		my_craps_bets = new craps_bets(props);
		my_craps_bets.ready();
		
		$(window).resize(function(){
			if (window.innerWidth >= 960){
				setTitle(table);		
			} else {
				setTitle("");
			}
			my_craps_bets.ready("resize");
		});
	}, []); 
	
	return (
		<>
			<Row className="craps_container">
				<Col sm={2}></Col>
				<Col sm={8}>
					<h1 className="craps_title">{title}</h1>
					{lang === "ro" ? 
						<h2 className="craps_subtitle"><span>Tip pariu: </span>{gameType}</h2> : 
						<h2 className="craps_subtitle"><span>Bet type: </span>{gameType}</h2>
					}					
					<div className="dice_container">
						<Dice innerRef={dice1} number={1}></Dice>
						<Dice innerRef={dice2} number={2}></Dice>
					</div>						
					<div className="craps_board_container">
						<div className="craps_board_box">
							<div readOnly id="craps_board" className="craps_board" ref={craps_board}>
								<CrapsBoardText info={crapsBoardText}></CrapsBoardText>
							</div>
						</div>
					</div>
					<Row className="game_buttons_container">
						<Col sm={12} className="game_buttons">
							<div className="game_text_container">
								<div className="game_buttons_box">
									{lang === "ro" ? 
										<p className="craps_buttons_box_cell craps_buttons_box_text">Ai: <span id="money_total">{moneyTotal}</span> morcovi</p> : 
										<p className="craps_buttons_box_cell craps_buttons_box_text">You have: <span id="money_total">{moneyTotal}</span> carrots</p>
									}
								</div>
								<div className="game_buttons_box">
									{lang === "ro" ? 
										<p className="craps_buttons_box_text">PARIAZA</p> : 
										<p className="craps_buttons_box_text">BET</p>
									}
									<input onChange={(e) => {handleChange(e)}} className="craps_input" type="number" id="craps_bet_input" min="1" defaultValue="1" max={money}></input>
								</div>
							</div>
							<div className="game_start_container">
								<button className="craps_start shadow_convex" finished={"yes"} id="craps_start" onClick={()=>game_start()}>{lang === "ro" ? <span>Incepe</span> : <span>Start</span>}</button>
								<button className="craps_bet shadow_convex" finished={"yes"} id="craps_bet" onClick={()=>game_bet()}>{lang === "ro" ? <span>Pariaza</span> : <span>Bet</span>}</button>
							</div>
						</Col>
					</Row>
				</Col>
				<Col sm={2}></Col>
			</Row>
			<Row>
				<Col sm={12}>
					{lang === "ro" ? 
						<p id="craps_rules_button" onClick={()=>{game_craps_rules()}}>Click aici pentru a vedea regulile</p> : 
						<p id="craps_rules_button" onClick={()=>{game_craps_rules()}}>Click here to see rules</p>}
				</Col>
			</Row>

			<div className={"craps_bets_container "+open}>
				<div className="craps_bets shadow_concav">
					<div className="close" onClick={()=>game_close()}>x</div>
					{lang === "ro" ? 
						<h2 className="craps_subtitle"><span>Tip pariu: </span>{gameType}</h2> : 
						<h2 className="craps_subtitle"><span>Bet type: </span>{gameType}</h2>
					}	
					<div className="craps_bets_box">						
						<canvas id="craps_bets_canvas" onClick={()=>{canvas_click()}}></canvas>						
					</div>
					<div id="craps_bets_clear" className="shadow_convex" onClick={()=>{canvas_clear()}}>Clear</div>
				</div>
			</div>
				
			<div className="show_results_container">				
				<div className="show_results">
					<i className="fa fa-times show_results_close" ></i>
					<h1 className="header"></h1>
					<div className="message"></div>
				</div>
			</div>
		</>
	);
}

export default Craps;