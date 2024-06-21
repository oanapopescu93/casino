import React from 'react'

import RouletteDe from './games/roulette/rouletteDe'
import RouletteEs from './games/roulette/rouletteEs'
import RouletteFr from './games/roulette/rouletteFr'
import RouletteIt from './games/roulette/rouletteIt'
import RoulettePt from './games/roulette/roulettePt'
import RouletteRo from './games/roulette/rouletteRo'
import RouletteRu from './games/roulette/rouletteRu'
import RouletteEng from './games/roulette/rouletteEng'

import BlackjackDe from './games/blackjack/blackjackDe'
import BlackjackEs from './games/blackjack/blackjackEs'
import BlackjackFr from './games/blackjack/blackjackFr'
import BlackjackIt from './games/blackjack/blackjackIt'
import BlackjackPt from './games/blackjack/blackjackPt'
import BlackjackRo from './games/blackjack/blackjackRo'
import BlackjackRu from './games/blackjack/blackjackRu'
import BlackjackEng from './games/blackjack/blackjackEng'

import SlotsDe from './games/slots/slotsDe'
import SlotsEs from './games/slots/slotsEs'
import SlotsFr from './games/slots/slotsFr'
import SlotsIt from './games/slots/slotsIt'
import SlotsPt from './games/slots/slotsPt'
import SlotsRo from './games/slots/slotsRo'
import SlotsRu from './games/slots/slotsRu'
import SlotsEng from './games/slots/slotsEng'

import CrapsDe from './games/craps/crapsDe'
import CrapsEs from './games/craps/crapsEs'
import CrapsFr from './games/craps/crapsFr'
import CrapsIt from './games/craps/crapsIt'
import CrapsPt from './games/craps/crapsPt'
import CrapsRo from './games/craps/crapsRo'
import CrapsRu from './games/craps/crapsRu'
import CrapsEng from './games/craps/crapsEng'

import PokerDe from './games/poker/pokerDe'
import PokerEs from './games/poker/pokerEs'
import PokerFr from './games/poker/pokerFr'
import PokerIt from './games/poker/pokerIt'
import PokerPt from './games/poker/pokerPt'
import PokerRo from './games/poker/pokerRo'
import PokerRu from './games/poker/pokerRu'
import PokerEng from './games/poker/pokerEng'

import RaceDe from './games/race/raceDe'
import RaceEs from './games/race/raceEs'
import RaceFr from './games/race/raceFr'
import RaceIt from './games/race/raceIt'
import RacePt from './games/race/racePt'
import RaceRo from './games/race/raceRo'
import RaceRu from './games/race/raceRu'
import RaceEng from './games/race/raceEng'

import KenoDe from './games/keno/kenoDe'
import KenoEs from './games/keno/kenoEs'
import KenoFr from './games/keno/kenoFr'
import KenoIt from './games/keno/kenoIt'
import KenoPt from './games/keno/kenoPt'
import KenoRo from './games/keno/kenoRo'
import KenoRu from './games/keno/kenoRu'
import KenoEng from './games/keno/kenoEng'
import { translate } from '../../../translations/translate'

function HowToPlayGames(props){
    const {game, lang} = props

    return <div className="box_scroll list_games_table">
        {(() => {
            switch (lang) {
                case "DE":
                    switch (game) {
                        case "roulette":
                            return <RouletteDe/>
                        case "blackjack":
                            return  <BlackjackDe/>
                        case "slots":
                            return <SlotsDe/>
                        case "craps":
                            return  <CrapsDe/>
                        case "race":
                            return <RaceDe/>
                        case "keno":
                            return  <KenoDe/>
                        case "poker":
                            return  <PokerDe/>
                        default:
                            return <p>{translate({lang: lang, info: "error"})}</p>
                    }
                case "ES":
                    switch (game) {
                        case "roulette":
                            return <RouletteEs/>
                        case "blackjack":
                            return  <BlackjackEs/>
                        case "slots":
                            return <SlotsEs/>
                        case "craps":
                            return  <CrapsEs/>
                        case "race":
                            return <RaceEs/>
                        case "keno":
                            return  <KenoEs/>
                        case "poker":
                            return  <PokerEs/>
                        default:
                            return <p>{translate({lang: lang, info: "error"})}</p>
                    }
                case "FR":
                    switch (game) {
                        case "roulette":
                            return <RouletteFr/>
                        case "blackjack":
                            return  <BlackjackFr/>
                        case "slots":
                            return <SlotsFr/>
                        case "craps":
                            return  <CrapsFr/>
                        case "race":
                            return <RaceFr/>
                        case "keno":
                            return  <KenoFr/>
                        case "poker":
                            return  <PokerFr/>
                        default:
                            return <p>{translate({lang: lang, info: "error"})}</p>
                    }
                case "IT":
                    switch (game) {
                        case "roulette":
                            return <RouletteIt/>
                        case "blackjack":
                            return  <BlackjackIt/>
                        case "slots":
                            return <SlotsIt/>
                        case "craps":
                            return  <CrapsIt/>
                        case "race":
                            return <RaceIt/>
                        case "keno":
                            return  <KenoIt/>
                        case "poker":
                            return  <PokerIt/>
                        default:
                            return <p>{translate({lang: lang, info: "error"})}</p>
                    }
                case "PT":
                    switch (game) {
                        case "roulette":
                            return <RoulettePt/>
                        case "blackjack":
                            return  <BlackjackPt/>
                        case "slots":
                            return <SlotsPt/>
                        case "craps":
                            return  <CrapsPt/>
                        case "race":
                            return <RacePt/>
                        case "keno":
                            return  <KenoPt/>
                        case "poker":
                            return  <PokerPt/>
                        default:
                            return <p>{translate({lang: lang, info: "error"})}</p>
                    }
                case "RO":
                    switch (game) {
                        case "roulette":
                            return <RouletteRo/>
                        case "blackjack":
                            return  <BlackjackRo/>
                        case "slots":
                            return <SlotsRo/>
                        case "craps":
                            return  <CrapsRo/>
                        case "race":
                            return <RaceRo/>
                        case "keno":
                            return  <KenoRo/>
                        case "poker":
                            return  <PokerRo/>
                        default:
                            return <p>{translate({lang: lang, info: "error"})}</p>
                    }
                case "RU":
                    switch (game) {
                        case "roulette":
                            return <RouletteRu/>
                        case "blackjack":
                            return  <BlackjackRu/>
                        case "slots":
                            return <SlotsRu/>
                        case "craps":
                            return  <CrapsRu/>
                        case "race":
                            return <RaceRu/>
                        case "keno":
                            return  <KenoRu/>
                        case "poker":
                            return  <PokerRu/>
                        default:
                            return <p>{translate({lang: lang, info: "error"})}</p>
                    }
                case "ENG":
                default:
                    switch (game) {
                        case "roulette":
                            return <RouletteEng/>
                        case "blackjack":
                            return  <BlackjackEng/>
                        case "slots":
                            return <SlotsEng/>
                        case "craps":
                            return  <CrapsEng/>
                        case "race":
                            return <RaceEng/>
                        case "keno":
                            return  <KenoEng/>
                        case "poker":
                            return  <PokerEng/>
                        default:
                            return <p>{translate({lang: lang, info: "error"})}</p>
                    }
            }
        })()}
    </div>
}
export default HowToPlayGames