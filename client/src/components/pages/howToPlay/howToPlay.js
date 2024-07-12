import React, {useState} from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import HowToPlayGames from './howToPlayGames'
import HowToPlayTitles from './howToPlayTitles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'

function HowToPlay(props){
    const {page, settings} = props
    const {lang} = settings

    const [game, setGame] = useState(null)
    let dispatch = useDispatch()     

    function handleBack(){
        if(game){
            setGame(null)
        } else {
            if(page.page === "how_to_play" && page.page_prev === "About"){
                dispatch(changePage('About'))
                dispatch(changeGame(null))
                dispatch(changeGamePage(null))
            } else {
                dispatch(changePage('Salon'))
                dispatch(changeGame(null))
                dispatch(changeGamePage(null))
            }
        }
    }

    function handleChoice(x){
        setGame(x)
    }

    return <div className="content_wrap">
        <Header template="how_to_play" title={translate({lang: lang, info: "how_to_play"})} />
        <div className="page_content">
            {!game ? <HowToPlayTitles lang={lang} handleChoice={(e)=>handleChoice(e)} /> : <HowToPlayGames game={game} lang={lang} />}
        </div>
        <div className="text_center">
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
            </Button>
        </div>
    </div>
}
export default HowToPlay