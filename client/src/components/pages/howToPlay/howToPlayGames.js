import React from 'react'

import RouletteDe from './games/roulette/rouletteDe'
import RouletteEs from './games/roulette/rouletteEs'
import RouletteFr from './games/roulette/rouletteFr'
import RouletteIt from './games/roulette/rouletteIt'
import RouletteRo from './games/roulette/rouletteRo'
import RouletteEng from './games/roulette/rouletteEng'

import BlackjackDe from './games/blackjack/blackjackDe'
import BlackjackEs from './games/blackjack/blackjackEs'
import BlackjackFr from './games/blackjack/blackjackFr'
import BlackjackIt from './games/blackjack/blackjackIt'
import BlackjackRo from './games/blackjack/blackjackRo'
import BlackjackEng from './games/blackjack/blackjackEng'

import SlotsDe from './games/slots/slotsDe'
import SlotsEs from './games/slots/slotsEs'
import SlotsFr from './games/slots/slotsFr'
import SlotsIt from './games/slots/slotsIt'
import SlotsRo from './games/slots/slotsRo'
import SlotsEng from './games/slots/slotsEng'

import CrapsDe from './games/craps/crapsDe'
import CrapsEs from './games/craps/crapsEs'
import CrapsFr from './games/craps/crapsFr'
import CrapsIt from './games/craps/crapsIt'
import CrapsRo from './games/craps/crapsRo'
import CrapsEng from './games/craps/crapsEng'

import RaceDe from './games/race/raceDe'
import RaceEs from './games/race/raceEs'
import RaceFr from './games/race/raceFr'
import RaceIt from './games/race/raceIt'
import RaceRo from './games/race/raceRo'
import RaceEng from './games/race/raceEng'

import KenoDe from './games/keno/kenoDe'
import KenoEs from './games/keno/kenoEs'
import KenoFr from './games/keno/kenoFr'
import KenoIt from './games/keno/kenoIt'
import KenoRo from './games/keno/kenoRo'
import KenoEng from './games/keno/kenoEng'

import PokerDe from './games/poker/pokerDe'
import PokerEs from './games/poker/pokerEs'
import PokerFr from './games/poker/pokerFr'
import PokerIt from './games/poker/pokerIt'
import PokerRo from './games/poker/pokerRo'
import PokerEng from './games/poker/pokerEng'

function HowToPlayGames(props){
    const {game, lang} = props

    return <div className="list_games_table">
        {(() => {
            switch (lang) {
                case "DE":
                    switch (game) {
                        case "roulette":
                            return <RouletteDe></RouletteDe>
                        case "blackjack":
                            return  <BlackjackDe></BlackjackDe>
                        case "slots":
                            return <SlotsDe></SlotsDe>
                        case "craps":
                            return  <CrapsDe></CrapsDe>
                        case "race":
                            return <RaceDe></RaceDe>
                        case "keno":
                            return  <KenoDe></KenoDe>
                        case "poker":
                            return  <PokerDe></PokerDe>
                        default:
                            return null
                    }
                case "ES":
                    switch (game) {
                        case "roulette":
                            return <RouletteEs></RouletteEs>
                        case "blackjack":
                            return  <BlackjackEs></BlackjackEs>
                        case "slots":
                            return <SlotsEs></SlotsEs>
                        case "craps":
                            return  <CrapsEs></CrapsEs>
                        case "race":
                            return <RaceEs></RaceEs>
                        case "keno":
                            return  <KenoEs></KenoEs>
                        case "poker":
                            return  <PokerEs></PokerEs>
                        default:
                            return null
                    }
                case "FR":
                    switch (game) {
                        case "roulette":
                            return <RouletteFr></RouletteFr>
                        case "blackjack":
                            return  <BlackjackFr></BlackjackFr>
                        case "slots":
                            return <SlotsFr></SlotsFr>
                        case "craps":
                            return  <CrapsFr></CrapsFr>
                        case "race":
                            return <RaceFr></RaceFr>
                        case "keno":
                            return  <KenoFr></KenoFr>
                        case "poker":
                            return  <PokerFr></PokerFr>
                        default:
                            return null
                    }
                case "IT":
                    switch (game) {
                        case "roulette":
                            return <RouletteIt></RouletteIt>
                        case "blackjack":
                            return  <BlackjackIt></BlackjackIt>
                        case "slots":
                            return <SlotsIt></SlotsIt>
                        case "craps":
                            return  <CrapsIt></CrapsIt>
                        case "race":
                            return <RaceIt></RaceIt>
                        case "keno":
                            return  <KenoIt></KenoIt>
                        case "poker":
                            return  <PokerIt></PokerIt>
                        default:
                            return null
                    }
                case "RO":
                    switch (game) {
                        case "roulette":
                            return <RouletteRo></RouletteRo>
                        case "blackjack":
                            return  <BlackjackRo></BlackjackRo>
                        case "slots":
                            return <SlotsRo></SlotsRo>
                        case "craps":
                            return  <CrapsRo></CrapsRo>
                        case "race":
                            return <RaceRo></RaceRo>
                        case "keno":
                            return  <KenoRo></KenoRo>
                        case "poker":
                            return  <PokerRo></PokerRo>
                        default:
                            return null
                    }
                case "ENG":
                default:
                    switch (game) {
                        case "roulette":
                            return <RouletteEng></RouletteEng>
                        case "blackjack":
                            return  <BlackjackEng></BlackjackEng>
                        case "slots":
                            return <SlotsEng></SlotsEng>
                        case "craps":
                            return  <CrapsEng></CrapsEng>
                        case "race":
                            return <RaceEng></RaceEng>
                        case "keno":
                            return  <KenoEng></KenoEng>
                        case "poker":
                            return  <PokerEng></PokerEng>
                        default:
                            return null
                    }
            }            
        })()}       
    </div>
}
export default HowToPlayGames