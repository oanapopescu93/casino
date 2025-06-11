import React from 'react'
import { Button } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import PolicyPrivacyDe from './policyPrivacyDe'
import PolicyPrivacyEng from './policyPrivacyEng'
import PolicyPrivacyEs from './policyPrivacyEs'
import PolicyPrivacyFr from './policyPrivacyFr'
import PolicyPrivacyIt from './policyPrivacyIt'
import PolicyPrivacyPt from './policyPrivacyPt'
import PolicyPrivacyRo from './policyPrivacyRo'
import PolicyPrivacyRu from './policyPrivacyRu'
import PolicyPrivacyZh from './policyPrivacyZh'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function PolicyPrivacy(props){
    const {settings} = props
    const {lang, theme} = settings
    let dispatch = useDispatch()

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <div className="content_wrap">
        <Header template="policy_privacy" title={translate({lang, info: "policy_privacy"})} lang={lang} theme={theme}/>
        <div className="page_content">
            <div className="box_scroll">
                {(() => {
                    switch (lang) {
                        case "DE":
                            return <PolicyPrivacyDe {...props}/>
                        case "ES":
                            return <PolicyPrivacyEs {...props}/>
                        case "FR":
                            return <PolicyPrivacyFr {...props}/>
                        case "IT":
                            return <PolicyPrivacyIt {...props}/>
                        case "PT":
                            return <PolicyPrivacyPt {...props}/>
                        case "RO":
                            return <PolicyPrivacyRo {...props}/>
                        case "RU":
                            return <PolicyPrivacyRu {...props}/>
                        case "ZH":
                            return <PolicyPrivacyZh {...props}/>
                        case "ENG":
                        default:
                            return <PolicyPrivacyEng {...props}/>
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
export default PolicyPrivacy