import React from 'react'
import { Button } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
import { changePage, changeGame, changeGamePage } from '../../../reducers/page'
import { translate } from '../../../translations/translate'
import Header from '../../partials/header'
import TermsConditionsDe from './termsConditionsDe'
import TermsConditionsEng from './termsConditionsEng'
import TermsConditionsEs from './termsConditionsEs'
import TermsConditionsFr from './termsConditionsFr'
import TermsConditionsIt from './termsConditionsIt'
import TermsConditionsPt from './termsConditionsPt'
import TermsConditionsRo from './termsConditionsRo'
import TermsConditionsRu from './termsConditionsRu'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function TermsConditions(props){
    let dispatch = useDispatch()
    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }
    return <div className="content_wrap">
        <Header template="terms_cond" title={translate({lang: props.lang, info: "terms_cond"})} />
        <div className="page_content">
            <div className="box_scroll">
                {(() => {
                    switch (props.lang) {
                        case "DE":
                            return <TermsConditionsDe/>
                        case "ES":
                            return <TermsConditionsEs/>
                        case "FR":
                            return <TermsConditionsFr/>
                        case "IT":
                            return <TermsConditionsIt/>
                        case "PT":
                            return <TermsConditionsPt/>
                        case "RO":
                            return <TermsConditionsRo/>
                        case "RU":
                            return <TermsConditionsRu/>
                        case "ENG":
                        default:
                            return <TermsConditionsEng/>
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
export default TermsConditions