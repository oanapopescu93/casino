import React from 'react'

import Language from '../settings/language'

import About from './about/about'
import TermsConditions from './termsConditions/termsConditions'
import PolicyPrivacy from './policyPrivacy/policyPrivacy'
import Career from './career/career'
import Questions from './questions/questions'
import Contact from './contact/contact'
import Donation from './donation/donation'
import Cart from './cart/cart'
import Checkout from './checkout/checkout'
import BuyCarrots from './buyCarrots/buyCarrots'
import HowToPlay from './howToPlay/howToPlay'

import { translate } from '../../translations/translate'
import Gdpr from './gdpr/gdpr'

function OtherPages(props) {
    const {page, home, settings} = props
    const {lang} = settings

    return <>
        <Language title={lang} />
        {(() => {
            switch (page.page) {
                case "About":
                    return <About {...props} />
                case "terms_cond":
                    return <TermsConditions {...props} />
                case "policy_privacy":
                    return <PolicyPrivacy {...props} />
                case "Career":
                    return <Career {...props} list={home && home.career ?home.career : []} />
                case "Questions":
                    let list_questions = []                  
                    if(home && home.questions && home.questions[0]){
                        if(home.questions[0][lang]){
                            list_questions = home.questions[0][lang]
                        } else {
                            list_questions = home.questions[0]["ENG"]
                        }
                    }
                    return <Questions {...props} list={list_questions} />
                case "Contact":
                    return <Contact {...props} />
                case "Donation":
                    return <Donation {...props} list={home.donations} />
                case "Cart":
                    return <Cart {...props} />
                case "Checkout":
                    return <Checkout {...props} />
                case "BuyCarrots":
                    return <BuyCarrots {...props} />
                case "how_to_play": 
                    return <HowToPlay {...props} />
                case "gdpr":
                    return <Gdpr {...props} />
                default:
                    return <p>{translate({lang, info: "error"})}</p>
            }
        })()}
    </>
}

export default OtherPages