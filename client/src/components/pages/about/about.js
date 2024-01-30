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
    let casino_name = "BunnyBet"
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
                        return <AboutDe casino_name={casino_name}></AboutDe>
                    case "ES":
                        return <AboutEs casino_name={casino_name}></AboutEs>
                    case "FR":
                        return <AboutFr casino_name={casino_name}></AboutFr>
                    case "IT":
                        return <AboutIt casino_name={casino_name}></AboutIt>
                    case "RO":
                        return <AboutRo casino_name={casino_name}></AboutRo>
                    case "ENG":
                    default:
                        return <AboutEng casino_name={casino_name}></AboutEng>
                }
            })()}    
        </div>
        <div className="text_center">
            <Button type="button" onClick={()=>handleBack()} className="mybutton round button_transparent shadow_convex">
                {translate({lang: props.lang, info: "back"})}
            </Button>
        </div>
        <br/><br/>
    </div>
}
export default About