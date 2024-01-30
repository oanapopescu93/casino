import React from 'react'
import { Button } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import PolicyPrivacyEng from './policyPrivacyEng'
import PolicyPrivacyRo from './policyPrivacyRo'
import PolicyPrivacyIt from './policyPrivacyIt'
import PolicyPrivacyFr from './policyPrivacyFr'
import PolicyPrivacyEs from './policyPrivacyEs'
import PolicyPrivacyDe from './policyPrivacyDe'
import Header from '../../partials/header'

function PolicyPrivacy(props){
    let dispatch = useDispatch()

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <div className="content_wrap">
        <Header template="policy_privacy" title={translate({lang: props.lang, info: "policy_privacy"})}></Header>        
        <div className="page_content">
            {(() => {
                switch (props.lang) {
                    case "DE":
                        return <PolicyPrivacyDe></PolicyPrivacyDe>
                    case "ES":
                        return <PolicyPrivacyEs></PolicyPrivacyEs>
                    case "FR":
                        return <PolicyPrivacyFr></PolicyPrivacyFr>
                    case "IT":
                        return <PolicyPrivacyIt></PolicyPrivacyIt>
                    case "RO":
                        return <PolicyPrivacyRo></PolicyPrivacyRo>
                    case "ENG":
                    default:
                        return <PolicyPrivacyEng></PolicyPrivacyEng>
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
export default PolicyPrivacy