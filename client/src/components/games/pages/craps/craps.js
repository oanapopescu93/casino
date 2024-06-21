import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CrapsGame from './crapsGame'
import GameBets from '../other/gameBets'
import { changeCrapsBets } from '../../../../reducers/games'

function Craps(props){
    const [open, setOpen] = useState(false)
    let dispatch = useDispatch()
    let bets = useSelector(state => state.games.craps.bets)	

    useEffect(() => {	
		dispatch(changeCrapsBets({game_type: "pass line", game_odds: 2, bet: 1}))
        return () => {
            dispatch(changeCrapsBets({bets: null, lucky_bet: null, result: null}))
        }
	}, [])

    function getData(x){
        dispatch(changeCrapsBets(x))
	}

    function openTable(){setOpen(true)}
    function closeTable(){setOpen(false)}
    
    function results(x){
        if(typeof props.results === "function"){
            props.results(x)
        }
    }

    return <div className='game_container'>
        <CrapsGame {...props} bets={bets} openTable={()=>openTable()} results={(e)=>results(e)} />
        <GameBets {...props} open={open} getData={(e)=>getData(e)} closeTable={()=>closeTable()} />
    </div>
}

export default Craps