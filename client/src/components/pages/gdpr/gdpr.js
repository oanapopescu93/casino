import React from 'react'
import { Button } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'

import GdprDe from './gdprDe'
import GdprEng from './gdprEng'
import GdprEs from './gdprEs'
import GdprFr from './gdprFr'
import GdprIt from './gdprIt'
import GdprPt from './gdprPt'
import GdprRo from './gdprRo'
import GdprRu from './gdprRu'
import GdprZh from './gdprZh'

function Gdpr(props){
    const { settings, home } = props
    const { lang, theme } = settings
    const { contact } = home

    let dispatch = useDispatch()

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <div className="content_wrap">
        <Header template="gdpr" title={translate({lang, info: "gdpr"})} lang={lang} theme={theme}/>
        <div className="page_content">
            <div className="box_scroll">
            {(() => {
                    switch (lang) {
                        case "DE":
                            return <GdprDe settings={settings} contact={contact} />
                        case "ES":
                            return <GdprEs settings={settings} contact={contact} />
                        case "FR":
                            return <GdprFr settings={settings} contact={contact} />
                        case "IT":
                            return <GdprIt settings={settings} contact={contact} />
                        case "PT":
                            return <GdprPt settings={settings} contact={contact} />
                        case "RO":
                            return <GdprRo settings={settings} contact={contact} />
                        case "RU":
                            return <GdprRu settings={settings} contact={contact} />
                        case "ZH":
                            return <GdprZh settings={settings} contact={contact} />
                        case "ENG":
                        default:
                            return <GdprEng settings={settings} contact={contact} />
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
            <span className="tooltiptext">{translate({lang, info: "back"})}</span>
        </div>
    </div>
}
export default Gdpr