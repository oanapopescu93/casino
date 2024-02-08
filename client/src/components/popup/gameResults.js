import React from 'react'
import { translate } from '../../translations/translate'
import carrot_img from '../../img/icons/carrot_icon_black.png'

function GameResults(props) {
    const {lang, results} = props    
    let table_name = results.game.table_name ? results.game.table_name : results.game
    let table_type = results.game.table_type
    let status = results.status
    let bet = results.bet
    return <div className="gameResults">
        <p>{translate({lang: lang, info: 'game'})}: <span>{table_name}</span></p>
        {table_type ? <p>{translate({lang: lang, info: 'game_type'})}: <span>{table_name}</span></p> : null}
        {status === "win" ? <p>{translate({lang: lang, info: 'you_win'})}: <span>{bet}</span><img alt="carrot_img" className="currency_img" src={carrot_img}/></p> : 
        <p>{translate({lang: lang, info: 'you_lose'})}: <span>{bet}</span><img alt="carrot_img" className="currency_img" src={carrot_img}/></p>}
    </div>
}

export default GameResults