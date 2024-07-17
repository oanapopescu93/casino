import React from 'react'

import roulette_loading_icon from '../../img/icons_other/icons/yellow/roulette.png'
import blackjack_loading_icon from '../../img/icons_other/icons/yellow/blackjack.png'
import slots_loading_icon from '../../img/icons_other/icons/yellow/slots.png'
import craps_loading_icon from '../../img/icons_other/icons/yellow/craps.png'
import race_loading_icon from '../../img/icons_other/icons/yellow/race.png'
import keno_loading_icon from '../../img/icons_other/icons/yellow/keno.png'
import poker_loading_icon from '../../img/icons_other/icons/yellow/carribean.png'
import whack_loading_icon from '../../img/whack_a_rabbit/whack_a_rabbit_icon.png'

function GameLoading(props){
    const {page} = props
    const {game} = page
    let title = game.table_name ? game.table_name : ""
    return <div id="game_loading" className='game_container'> 
        <div className='game_box'> 
            {(() => {
            switch (title) {
                case "roulette":
                    return <>
                        <img src={roulette_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                        <p>Loading...</p>
                    </>
                case "blackjack":
                    return <>
                        <img src={blackjack_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                        <p>Loading...</p>
                    </>
                case "slots":
                    return <>
                        <img src={slots_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                        <p>Loading...</p>
                    </>
                case "craps":
                    return <>
                        <img src={craps_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                        <p>Loading...</p>
                    </>
                case "poker":
                    return <>
                        <img src={poker_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                        <p>Loading...</p>
                    </>
                case "race":
                    return <>
                        <img src={race_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                        <p>Loading...</p>
                    </>
                case "keno":
                    return <>
                        <img src={keno_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                        <p>Loading...</p>
                    </>
                case "whack_a_rabbit":
                    return <>
                        <img src={whack_loading_icon} className="game_loading_icon" alt="game_loading_icon"/>
                        <p>Loading...</p>
                    </>
            }
            })()}
        </div>
    </div>
}
export default GameLoading