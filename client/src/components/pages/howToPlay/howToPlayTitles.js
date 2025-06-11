import React from 'react'
import { translate } from '../../../translations/translate'

import roulette_icon_yellow from '../../../img/icons_other/icons/yellow/roulette.png'
import blackjack_icon_yellow from '../../../img/icons_other/icons/yellow/blackjack.png'
import slots_icon_yellow from '../../../img/icons_other/icons/yellow/slots.png'
import craps_icon_yellow from '../../../img/icons_other/icons/yellow/craps.png'
import race_icon_yellow from '../../../img/icons_other/icons/yellow/race.png'
import keno_icon_yellow from '../../../img/icons_other/icons/yellow/keno.png'
import poker_icon_yellow from '../../../img/icons_other/icons/yellow/carribean.png'

import roulette_icon_green from '../../../img/icons_other/icons/green/roulette.png'
import blackjack_icon_green from '../../../img/icons_other/icons/green/blackjack.png'
import slots_icon_green from '../../../img/icons_other/icons/green/slots.png'
import craps_icon_green from '../../../img/icons_other/icons/green/craps.png'
import race_icon_green from '../../../img/icons_other/icons/green/race.png'
import keno_icon_green from '../../../img/icons_other/icons/green/keno.png'
import poker_icon_green from '../../../img/icons_other/icons/green/carribean.png'

import roulette_icon_pink from '../../../img/icons_other/icons/pink/roulette.png'
import blackjack_icon_pink from '../../../img/icons_other/icons/pink/blackjack.png'
import slots_icon_pink from '../../../img/icons_other/icons/pink/slots.png'
import craps_icon_pink from '../../../img/icons_other/icons/pink/craps.png'
import race_icon_pink from '../../../img/icons_other/icons/pink/race.png'
import keno_icon_pink from '../../../img/icons_other/icons/pink/keno.png'
import poker_icon_pink from '../../../img/icons_other/icons/pink/carribean.png'

import roulette_icon_orange from '../../../img/icons_other/icons/orange/roulette.png'
import blackjack_icon_orange from '../../../img/icons_other/icons/orange/blackjack.png'
import slots_icon_orange from '../../../img/icons_other/icons/orange/slots.png'
import craps_icon_orange from '../../../img/icons_other/icons/orange/craps.png'
import race_icon_orange from '../../../img/icons_other/icons/orange/race.png'
import keno_icon_orange from '../../../img/icons_other/icons/orange/keno.png'
import poker_icon_orange from '../../../img/icons_other/icons/orange/carribean.png'

function HowToPlayTitles(props){
    const {handleChoice, settings} = props
    const {lang, theme} = settings
    let list_games = ["roulette", "blackjack", "slots", "craps", "race", "keno", "poker"]

    function chooseImage(game){
        switch (game) {
            case "roulette":
                switch (theme) {
                    case 'purple':
                        return roulette_icon_pink
                    case 'black':
                        return roulette_icon_green
                    case 'blue':
                        return roulette_icon_orange
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
                        return blackjack_icon_orange
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
                        return slots_icon_orange
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
                        return craps_icon_orange
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
                        return race_icon_orange
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
                        return keno_icon_orange
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
                        return poker_icon_orange
                    default:
                        return poker_icon_yellow
                }
            default:
                return
        }
        
    }

    return <div className="how_to_play_titles">
        {list_games.map((t, i)=>{
            return <div key={i} className="cell_howToPlay_container" onClick={()=>handleChoice(t)}>
                <div className="cell_howToPlay shadow_concav">
                    <div className="cell_info">
                        {(() => {
                            switch (t) {
                                case "roulette":
                                case "blackjack":
                                case "slots":
                                case "craps":
                                case "race":
                                case "keno":
                                case "poker":
                                    return  <img src={chooseImage(t)} alt="game_icon" />
                                default:
                                    return null
                            }
                        })()}
                    </div>
                    <div className="cell_text shadow_convex">{translate({lang, info: t})}</div>
                </div>
            </div>
        })}        
    </div>
}
export default HowToPlayTitles