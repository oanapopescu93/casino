import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import BaccaratGame from './baccaratGame'
import { changeBaccaratBets } from '../../../reducers/games'
import GameBets from '../pages/other/gameBets'

function Baccarat(props){
    const {page, settings} = props
	const {lang, theme} = settings
    
    let dispatch = useDispatch()
    let bets = useSelector(state => state.games.baccarat.bets)	
    const [update, setUpdate] = useState(0)

    function getData(x){
        dispatch(changeBaccaratBets(x))
	}
    
    function results(x){
        props.results(x)
    }

    return <div id="roulette" className='game_container'>
        <BaccaratGame {...props} bets={bets} results={(e)=>results(e)} />
        <GameBets {...props} getData={(e)=>getData(e)} update={update} />
    </div>
}

export default Baccarat