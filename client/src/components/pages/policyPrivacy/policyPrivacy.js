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
    const {lang} = settings
    let dispatch = useDispatch()

    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }

    return <div className="content_wrap">
        <Header template="policy_privacy" title={translate({lang: lang, info: "policy_privacy"})} />
        <div className="page_content">
            <div className="box_scroll">
                {(() => {
                    switch (lang) {
                        case "DE":
                            return <PolicyPrivacyDe/>
                        case "ES":
                            return <PolicyPrivacyEs/>
                        case "FR":
                            return <PolicyPrivacyFr/>
                        case "IT":
                            return <PolicyPrivacyIt/>
                        case "PT":
                            return <PolicyPrivacyPt/>
                        case "RO":
                            return <PolicyPrivacyRo/>
                        case "RU":
                            return <PolicyPrivacyRu/>
                        case "ZH":
                            return <PolicyPrivacyZh/>
                        case "ENG":
                        default:
                            return <PolicyPrivacyEng/>
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
export default PolicyPrivacy