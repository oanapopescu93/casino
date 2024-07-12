import React from 'react'
import { translate } from '../../translations/translate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarrot } from '@fortawesome/free-solid-svg-icons'

function GameResults(props) {
    const {settings, results} = props
    const {lang} = settings   
    let table_name = results.game.table_name ? results.game.table_name : results.game
    let table_type = results.game.table_type
    let status = results.status
    let bet = results.bet
    return <div className="gameResults">
        <p>{translate({lang: lang, info: 'game'})}: <span>{table_name}</span></p>
        {table_type ? <p>{translate({lang: lang, info: 'game_type'})}: <span>{table_name}</span></p> : null}
        {status === "win" ? <p>{translate({lang: lang, info: 'you_win'})}: <span>{bet}</span> <FontAwesomeIcon icon={faCarrot} /></p> : 
        <p>{translate({lang: lang, info: 'you_lose'})}: <span>{bet}</span> <FontAwesomeIcon icon={faCarrot} /></p>}
    </div>
}

export default GameResults