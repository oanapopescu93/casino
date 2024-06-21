import React from 'react'
import { translate } from '../../../translations/translate'
function BankDonation(props){    
    const {lang, list} = props
    const bankDonation = list.find(x => x.type === "bank")
    return <>
        {bankDonation ? <>
            <h2>{translate({lang: lang, info: "bank_donation_title"})}</h2>
            <p>{translate({lang: lang, info: "bank_donation_text"})}</p>
            <div className="iban">
                <strong>{bankDonation.title}:</strong> {bankDonation.text}
            </div>
        </> : null}
    </>
}
export default BankDonation