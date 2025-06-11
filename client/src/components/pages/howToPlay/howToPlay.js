import React, {useState} from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import HowToPlayGames from './howToPlayGames'
import HowToPlayTitles from './howToPlayTitles'
import ChatBotButton from '../../partials/chatBotButton'
import { changePopup } from '../../../reducers/popup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'

function HowToPlay(props){
    const {page, settings} = props
    const {lang, theme} = settings

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

    function handleGamblingWarningPopup(){
        let payload = {
            open: true,
            template: "gambling_warning",
            title: "gambling_warning_signs",
            size: "lg",
            icon: "faTriangleExclamation"
        }
        dispatch(changePopup(payload))
    }

    return <div className="content_wrap">
        <Header template="how_to_play" title={translate({lang, info: "how_to_play"})} lang={lang} theme={theme}/>
        <div className="page_content">
            {!game ? <>
                <HowToPlayTitles settings={settings} handleChoice={(e)=>handleChoice(e)} />
            </> : <HowToPlayGames game={game} settings={settings} />}
        </div>
        <div className="button_action_group how_to_play">
            <ChatBotButton lang={lang} theme={theme}/>
            <Button type="button" onClick={()=>handleGamblingWarningPopup()} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faTriangleExclamation} />
            </Button>
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
            </Button>                     
        </div>
    </div>
}
export default HowToPlay