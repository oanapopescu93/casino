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
import AboutRo from './aboutRo'
import AboutRu from './aboutRu'
import AboutZh from './aboutZh'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function About(props){
    const {settings} = props
    const {lang, theme} = settings
    let casino_name = "BunnyBet"
    let dispatch = useDispatch()
    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }
    return <div className="content_wrap">
        <Header template="about" title={translate({lang: lang, info: "about"})} lang={lang} theme={theme}/>
        <div className="page_content">
            <div className="box_scroll">
                {(() => {
                    switch (lang) {
                        case "DE":
                            return <AboutDe settings={settings} casino_name={casino_name} />
                        case "ES":
                            return <AboutEs settings={settings} casino_name={casino_name} />
                        case "FR":
                            return <AboutFr settings={settings} casino_name={casino_name} />
                        case "IT":
                            return <AboutIt settings={settings} casino_name={casino_name} />
                        case "PT":
                            return <AboutEng settings={settings} casino_name={casino_name} /> // TODO:
                        case "RO":
                            return <AboutRo settings={settings} casino_name={casino_name} />
                        case "RU":
                            return <AboutRu settings={settings} casino_name={casino_name} />
                        case "ZH":
                            return <AboutZh settings={settings} casino_name={casino_name} />
                        case "ENG":
                        default:
                            return <AboutEng settings={settings} casino_name={casino_name} />
                    }
                })()} 
            </div>
        </div>
        <div className="tooltip">
            <Button 
                type="button"
                className="mybutton round button_transparent shadow_convex"
                onClick={()=>handleBack()}
            ><FontAwesomeIcon icon={faArrowRotateLeft} /></Button>
            <span className="tooltiptext">{translate({lang: lang, info: "back"})}</span>
        </div>
    </div>
}
export default About