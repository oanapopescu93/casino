import React from 'react'
import Language from '../settings/language'

import About from './about/about'
import TermsConditions from './termsConditions/termsConditions'
import PolicyPrivacy from './policyPrivacy/policyPrivacy'
import Career from './career'
import Questions from './questions/questions'
import Contact from './contact/contact'
import Donation from './donation/donation'
import Cart from './cart/cart'
import Checkout from './checkout/checkout'
import Orders from './order/orders'
import BuyCarrots from './buyCarrots'
import HowToPlay from './howToPlay/howToPlay'
import { translate } from '../../translations/translate'

function OtherPages(props) {
    const {lang, page, home} = props

    return <>        
        <Language title={lang}></Language>          
        {(() => {
            switch (page.page) {
                case "About":
                    return <About {...props}></About>
                case "terms_cond":
                    return <TermsConditions {...props}></TermsConditions>
                case "policy_privacy":
                    return <PolicyPrivacy {...props}></PolicyPrivacy>         
                case "Career":
                    let list_career = []                  
                    if(home && home.career && home.career[0]){
                        if(home.career[0][lang]){
                            list_career = home.career[0][lang]
                        } else {
                            list_career = home.career[0]["ENG"]
                        }                  
                    }
                    return <Career {...props} list={list_career}></Career>           
                case "Questions":
                    let list_questions = []                  
                    if(home && home.questions && home.questions[0]){
                        if(home.questions[0][lang]){
                            list_questions = home.questions[0][lang]
                        } else {
                            list_questions = home.questions[0]["ENG"]
                        }                  
                    }
                    return <Questions {...props} list={list_questions}></Questions>
                case "Contact":
                    return <Contact {...props}></Contact>
                case "Donation":
                    return <Donation {...props} list={home.donations}></Donation>
                case "Cart":
                    return <Cart {...props}></Cart>
                case "Checkout":
                    return <Checkout {...props}></Checkout>
                case "Order":
                    return <Orders {...props}></Orders>
                case "BuyCarrots":
                    return <BuyCarrots {...props}></BuyCarrots>
                case "how_to_play": 
                    return <HowToPlay {...props}></HowToPlay>                                   
                default:
                    return <p>{translate({lang: props.lang, info: "error"})}</p>
            }
        })()}  
    </>
}

export default OtherPages