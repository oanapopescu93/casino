import React from 'react'
import { Button } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import AboutEng from './aboutEng'
import AboutRo from './aboutRo'
import Header from '../../partials/header'
import AboutDe from './aboutDe'
import AboutEs from './aboutEs'
import AboutFr from './aboutFr'
import AboutIt from './aboutIt'

function About(props){
    let dispatch = useDispatch()
    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }
    return <div className="content_wrap">
        <Header template="about" title={translate({lang: props.lang, info: "about"})}></Header>
        <div className="page_content">
            {(() => {
                switch (props.lang) {
                    case "DE":
                        return <AboutDe></AboutDe>
                    case "ES":
                        return <AboutEs></AboutEs>
                    case "FR":
                        return <AboutFr></AboutFr>
                    case "IT":
                        return <AboutIt></AboutIt>
                    case "RO":
                        return <AboutRo></AboutRo>
                    case "ENG":
                    default:
                        return <AboutEng></AboutEng>
                }
            })()}    
        </div>
        <div className="text_center">
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                {translate({lang: props.lang, info: "back"})}
            </Button>
        </div>
    </div>
}
export default About