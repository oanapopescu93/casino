import React, {useState} from 'react'
import { Button } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import HowToPlayGames from './howToPlayGames'
import HowToPlayTitles from './howToPlayTitles'

function HowToPlay(props){
    const [game, setGame] = useState(null)
    let dispatch = useDispatch()    

    function handleBack(){
        if(game){
            setGame(null)
        } else {
            dispatch(changePage('Salon'))
            dispatch(changeGame(null))
            dispatch(changeGamePage(null))
        }
    }

    function handleChoice(x){
        setGame(x)
    }

    return <div className="content_wrap">
        <Header template="how_to_play" title={translate({lang: props.lang, info: "how_to_play"})}></Header>
        <div className="page_content">            
            {!game ? <HowToPlayTitles handleChoice={(e)=>handleChoice(e)}></HowToPlayTitles> : <HowToPlayGames game={game} lang={props.lang}></HowToPlayGames>}
        </div>
        <div className="text_center">
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                {translate({lang: props.lang, info: "back"})}
            </Button>
        </div>
    </div>
}
export default HowToPlay