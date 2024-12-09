import React, {useState} from 'react'
import RaceGame from './raceGame'
import RaceTables from './raceTables'
import { useDispatch } from 'react-redux'
import { changePopup } from '../../../../reducers/popup'
import { translate } from '../../../../translations/translate'
import { resetGame } from '../../../../reducers/games'
import { useHandleErrors } from '../../../../utils/utils'
import { decryptData } from '../../../../utils/crypto'
import { checkBets } from '../../../../utils/checkBets'

function Race(props){
    const {settings, user} = props
    const {lang} = settings

    const [startRace, setStartRace] = useState(false)
    const [bets, setBets] = useState([])

    let money = user.money ? decryptData(user.money) : 0

    let dispatch = useDispatch()
    const handleErrors = useHandleErrors()

    function calculateTotalBets(array){
        let total = 0
        if(array && array.length>0){
            for(let i in array){
                total = total + array[i].bet
            }
        }
        return total
    }

    function getData(x){
        let total = calculateTotalBets(x)
        if(checkBets({bets: total, money, lang}, handleErrors)){
            setBets(x)
		    setStartRace(true)
        }
	}

    function resetBets(){
        dispatch(resetGame("race"))
        setBets([])
    }

    function handleStartGame(){
        setStartRace(false)
    }

    return <div className="game_container race_tables_container">
        <div className="game_box">
            {startRace ? <RaceGame 
                {...props} 
                bets={bets} 
                resetBets={()=>resetBets()} 
                handleStartGame={()=>handleStartGame()}
            /> : <RaceTables {...props} getData={(x)=>getData(x)} />}
        </div>
    </div>
}

export default Race