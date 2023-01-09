import React, {useEffect, useState } from 'react'
import { showStreak } from '../../utils'

import roulette_loading_icon from '../../img/icons_other/icons/yellow/roulette.png'
import blackjack_loading_icon from '../../img/icons_other/icons/yellow/blackjack.png'
import slots_loading_icon from '../../img/icons_other/icons/yellow/slots.png'
import craps_loading_icon from '../../img/icons_other/icons/yellow/craps.png'
import race_loading_icon from '../../img/icons_other/icons/yellow/race.png'
import keno_loading_icon from '../../img/icons_other/icons/yellow/keno.png'

import Roulette from './roulette'
import Blackjack from './blackjack'
import Slot from './slot'
import Craps from './craps'
import Race from './race'
import Keno from './keno'
import Panel from '../panel/panel_control'


function Game(props){
	const [loaded, setLoaded] = useState(false)
	let game_choice = props.game_choice.table_name ? props.game_choice.table_name : props.game_choice
	let streak = props.data.streak
	let lang = props.lang

	useEffect(() => {
		props.socket.emit('user_page_send', {uuid: props.data.uuid, choice: props.game_choice})
		props.socket.on('user_page_read', function(data){
			if(data){
				setTimeout(function(){
					setLoaded(true)
					showStreak(streak, lang, props.dispatch)
				}, 1000)
			}
		})
	}, [])

	return (
		<div className="casino_container color_yellow">
			<>
				{(() => {
					switch (game_choice){
						case "roulette":   
							if(loaded){
								return (
									<>
										<Roulette lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Roulette>
										<Panel lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Panel>
									</>
								)
							} else {
								return(
									<>
										<img className="loading_icon" alt="loading_icon" src={roulette_loading_icon} />
										<p className="color_yellow">Loading Roulette</p>
									</>
								)
							}                                                     
						case "blackjack":
							if(loaded){
								return (
									<>
										<Blackjack lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Blackjack>
										<Panel lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Panel>
									</>
								)
							} else {
								return(
									<>
										<img className="loading_icon" alt="loading_icon" src={blackjack_loading_icon} />
										<p className="color_yellow">Loading Blackjack</p>
									</>
								)
							}  
						case "slots":
							if(loaded){
								return (
									<>
										<Slot lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Slot>
										<Panel lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Panel>
									</>
								)
							} else {
								return(
									<>
										<img className="loading_icon" alt="loading_icon" src={slots_loading_icon} />
										<p className="color_yellow">Loading Slots</p>
									</>
								)
							}  
						case "craps":
							if(loaded){
								return (
									<>
										<Craps lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Craps>
										<Panel lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Panel>
									</>								
								)
							} else {
								return(
									<>
										<img className="loading_icon" alt="loading_icon" src={craps_loading_icon} />
										<p className="color_yellow">Loading Craps</p>
									</>
								)
							}
						case "race":
							if(loaded){
								return (
									<>
										<Race lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Race>
										<Panel lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Panel>
									</>								
								)
							} else {
								return(
									<>
										<img className="loading_icon" alt="loading_icon" src={race_loading_icon} />
										<p className="color_yellow">Loading Race</p>
									</>
								)
							}
						case "keno":
							if(loaded){
								return (
									<>
										<Keno lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Keno>
										<Panel lang={props.lang} socket={props.socket} data={props.data} game_choice={props.game_choice}></Panel>
									</>								
								)
							} else {
								return(
									<>
										<img className="loading_icon" alt="loading_icon" src={keno_loading_icon} />
										<p className="color_yellow">Loading Keno</p>
									</>
								)
							}
						}
				})()}
			</>
		</div>
	)
}

export default Game