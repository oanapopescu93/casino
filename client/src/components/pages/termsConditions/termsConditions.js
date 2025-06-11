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
import TermsConditionsZh from './termsConditionsZh'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'

function TermsConditions(props){
    const {settings} = props
    const {lang, theme} = settings
    let dispatch = useDispatch()
    function handleBack(){
        dispatch(changePage('Salon'))
        dispatch(changeGame(null))
        dispatch(changeGamePage(null))
    }
    return <div className="content_wrap">
        <Header template="terms_cond" title={translate({lang, info: "terms_cond"})} lang={lang} theme={theme}/>
        <div className="page_content">
            <div className="box_scroll">
                {(() => {
                    switch (lang) {
                        case "DE":
                            return <TermsConditionsDe {...props}/>
                        case "ES":
                            return <TermsConditionsEs {...props}/>
                        case "FR":
                            return <TermsConditionsFr {...props}/>
                        case "IT":
                            return <TermsConditionsIt {...props}/>
                        case "PT":
                            return <TermsConditionsPt {...props}/>
                        case "RO":
                            return <TermsConditionsRo {...props}/>
                        case "RU":
                            return <TermsConditionsRu {...props}/>
                        case "ZH":
                            return <TermsConditionsZh {...props}/>
                        case "ENG":
                        default:
                            return <TermsConditionsEng {...props}/>
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