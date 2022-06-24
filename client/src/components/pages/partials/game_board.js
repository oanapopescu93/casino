import React, { useState } from 'react';

function GameBoard(props){
	let lang = props.lang;	
	let money = props.money;
	const [moneyTotal, setmoneyTotal] = useState(money-1);
	const [bet, setBet] = useState(1);

	function handleChange(e){
		let my_bet = parseInt(e.target.value);
		setBet(my_bet);
		setmoneyTotal(money-my_bet);
	}

	function handleClick(x){
		props.choice(x, bet);
	}

	return(
		<div id={'game_board_'+props.title} className="game_buttons_container">
				<div className="game_box">
					<div className="game_buttons">
						<div className="game_text_container">
							<div className="game_buttons_box">
								{lang === "ro" ? 
									<p className="game_box_cell game_box_text">Ai: <span id="money_total">{moneyTotal}</span> morcovi</p> : 
									<p className="game_box_cell game_box_text">You have: <span id="money_total">{moneyTotal}</span> carrots</p>
								}
							</div>
							<div className="game_buttons_box">
								{lang === "ro" ? 
									<p id="game_board_bet" className="game_box_text">PARIAZA</p> : 
									<p id="game_board_bet" className="game_box_text">BET</p>
								}
								<input onChange={(e) => {handleChange(e)}} className="game_input" type="number" min="1" defaultValue="1" max={money}></input>
							</div>
						</div>
						{(() => {
							 switch (props.title) {                                                    
								case "blackjack":
									return(
										<div className="game_start_container">
											<button onClick={()=>handleClick("start")} className="game_button shadow_convex" id="blackjack_start">START</button>
											<button onClick={()=>handleClick("hit")} className="game_button shadow_convex" id="blackjack_hit">HIT</button>
											<button onClick={()=>handleClick("stay")} className="game_button shadow_convex" id="blackjack_stay">STAY</button>
										</div>
									);
								case "slots":
									return(
										<div className="game_start_container">
											<button onClick={()=>handleClick("spin")} className="game_button shadow_convex" id="slot_spin">SPIN</button>
										</div>
									);							
							}
						})()}						
					</div>
				</div>
			</div>
	);	
}

export default GameBoard;