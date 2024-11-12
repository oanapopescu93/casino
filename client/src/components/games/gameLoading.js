import React from 'react'

import roulette_icon_yellow from '../../img/icons_other/icons/yellow/roulette.png'
import blackjack_icon_yellow from '../../img/icons_other/icons/yellow/blackjack.png'
import slots_icon_yellow from '../../img/icons_other/icons/yellow/slots.png'
import craps_icon_yellow from '../../img/icons_other/icons/yellow/craps.png'
import race_icon_yellow from '../../img/icons_other/icons/yellow/race.png'
import keno_icon_yellow from '../../img/icons_other/icons/yellow/keno.png'
import poker_icon_yellow from '../../img/icons_other/icons/yellow/carribean.png'

import roulette_icon_green from '../../img/icons_other/icons/green/roulette.png'
import blackjack_icon_green from '../../img/icons_other/icons/green/blackjack.png'
import slots_icon_green from '../../img/icons_other/icons/green/slots.png'
import craps_icon_green from '../../img/icons_other/icons/green/craps.png'
import race_icon_green from '../../img/icons_other/icons/green/race.png'
import keno_icon_green from '../../img/icons_other/icons/green/keno.png'
import poker_icon_green from '../../img/icons_other/icons/green/carribean.png'

import roulette_icon_pink from '../../img/icons_other/icons/pink/roulette.png'
import blackjack_icon_pink from '../../img/icons_other/icons/pink/blackjack.png'
import slots_icon_pink from '../../img/icons_other/icons/pink/slots.png'
import craps_icon_pink from '../../img/icons_other/icons/pink/craps.png'
import race_icon_pink from '../../img/icons_other/icons/pink/race.png'
import keno_icon_pink from '../../img/icons_other/icons/pink/keno.png'
import poker_icon_pink from '../../img/icons_other/icons/pink/carribean.png'

import roulette_icon_grey from '../../img/icons_other/icons/grey/roulette.png'
import blackjack_icon_grey from '../../img/icons_other/icons/grey/blackjack.png'
import slots_icon_grey from '../../img/icons_other/icons/grey/slots.png'
import craps_icon_grey from '../../img/icons_other/icons/grey/craps.png'
import race_icon_grey from '../../img/icons_other/icons/grey/race.png'
import keno_icon_grey from '../../img/icons_other/icons/grey/keno.png'
import poker_icon_grey from '../../img/icons_other/icons/grey/carribean.png'

import whack_loading_yellow from '../../img/whack_a_rabbit/yellow/whack_a_rabbit_icon.png'
import whack_loading_green from '../../img/whack_a_rabbit/green/whack_a_rabbit_icon.png'
import whack_loading_pink from '../../img/whack_a_rabbit/pink/whack_a_rabbit_icon.png'
import whack_loading_grey from '../../img/whack_a_rabbit/grey/whack_a_rabbit_icon.png'

function GameLoading(props){
    const {page, settings} = props
    const {game} = page
    const {theme} = settings
    let title = game.table_name ? game.table_name : ""

    function chooseImage(game){
        switch (game) {
            case "roulette":
                switch (theme) {
                    case 'purple':
                        return roulette_icon_pink     
                    case 'black':
                        return roulette_icon_green
                    case 'blue':
                        return roulette_icon_grey
                    default:
                        return roulette_icon_yellow
                }
            case "blackjack":
                switch (theme) {
                    case 'purple':
                        return blackjack_icon_pink     
                    case 'black':
                        return blackjack_icon_green
                    case 'blue':
                        return blackjack_icon_grey
                    default:
                        return blackjack_icon_yellow
                }
            case "slots":
                switch (theme) {
                    case 'purple':
                        return slots_icon_pink     
                    case 'black':
                        return slots_icon_green
                    case 'blue':
                        return slots_icon_grey
                    default:
                        return slots_icon_yellow
                }
            case "craps":
                switch (theme) {
                    case 'purple':
                        return craps_icon_pink     
                    case 'black':
                        return craps_icon_green
                    case 'blue':
                        return craps_icon_grey
                    default:
                        return craps_icon_yellow
                }
            case "race":
                switch (theme) {
                    case 'purple':
                        return race_icon_pink     
                    case 'black':
                        return race_icon_green
                    case 'blue':
                        return race_icon_grey
                    default:
                        return race_icon_yellow
                }
            case "keno":
                switch (theme) {
                    case 'purple':
                        return keno_icon_pink     
                    case 'black':
                        return keno_icon_green
                    case 'blue':
                        return keno_icon_grey
                    default:
                        return keno_icon_yellow
                }
            case "poker":
                switch (theme) {
                    case 'purple':
                        return poker_icon_pink     
                    case 'black':
                        return poker_icon_green
                    case 'blue':
                        return poker_icon_grey
                    default:
                        return poker_icon_yellow
                }
            case "whack_a_rabbit":
                switch (theme) {
                    case 'purple':
                        return whack_loading_pink
                    case 'black':
                        return whack_loading_green
                    case 'blue':
                        return whack_loading_grey
                    default:
                        return whack_loading_yellow
                }
            default:
                return
        }        
    }

    return <div id="game_loading" className='game_container'> 
        <div className='game_box'> 
            {(() => {
            switch (title) {
                case "roulette":
                case "blackjack":
                case "slots":
                case "craps":
                case "poker":
                case "race":
                case "keno":
                case "whack_a_rabbit":
                    return <>
                        <img src={chooseImage(title)} className="game_loading_icon" alt="game_loading_icon"/>
                        <p>Loading...</p>
                    </>
            }
            })()}
        </div>
    </div>
}
export default GameLoading