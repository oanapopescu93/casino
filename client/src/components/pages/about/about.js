import React from 'react'
import { Button } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import AboutDe from './aboutDe'
import AboutEng from './aboutEng'
import AboutEs from './aboutEs'
import AboutFr from './aboutFr'
import AboutIt from './aboutIt'
import AboutPT from './aboutPT'
import AboutRo from './aboutRo'
import AboutRu from './aboutRu'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function About(props){
    let casino_name = "BunnyBet"
    let dispatch = useDispatch()
    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }
    return <div className="content_wrap">
        <Header template="about" title={translate({lang: props.lang, info: "about"})} />
        <div className="page_content">
            <div className="box_scroll">
                {(() => {
                    switch (props.lang) {
                        case "DE":
                            return <AboutDe lang={props.lang} casino_name={casino_name} />
                        case "ES":
                            return <AboutEs lang={props.lang} casino_name={casino_name} />
                        case "FR":
                            return <AboutFr lang={props.lang} casino_name={casino_name} />
                        case "IT":
                            return <AboutIt lang={props.lang} casino_name={casino_name} />
                        case "PT":
                            return <AboutPT lang={props.lang} casino_name={casino_name} />
                        case "RO":
                            return <AboutRo lang={props.lang} casino_name={casino_name} />
                        case "RU":
                            return <AboutRu lang={props.lang} casino_name={casino_name} />
                        case "ENG":
                        default:
                            return <AboutEng lang={props.lang} casino_name={casino_name} />
                    }
                })()} 
            </div>
        </div>
        <div className="text_center">
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                <FontAwesomeIcon icon={faArrowRotateLeft} />
            </Button>
        </div>
        <br/><br/>
    </div>
}
export default About