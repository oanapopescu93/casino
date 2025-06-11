import React, {useState} from 'react'
import { translate } from '../../../translations/translate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faCheck } from '@fortawesome/free-solid-svg-icons'

function BankDonation(props){    
    const {lang, list} = props
    const [copy, setCopy] = useState(false)
    const bankDonation = list.find(x => x.type === "bank")

    function copyToClipboard(item){
        navigator.clipboard.writeText(item.text).then(() => {
            setCopy(true)
            setTimeout(()=>{
                setCopy(false)
           }, 1000)
        })
        .catch(err => {
            console.error('Failed to copy IBAN: ', err)
        })
    }

    return <>
        {bankDonation ? <>
            <h2>{translate({lang, info: "bank_donation_title"})}</h2>
            <p>{translate({lang, info: "bank_donation_text"})}</p>
            <div className="iban" onClick={()=>copyToClipboard(bankDonation)}>
                <strong className="iban_label">{bankDonation.title}:</strong>&nbsp;
                <span className="iban_text selectable">{bankDonation.text}</span>&nbsp;
                <span className="iban_icon"><FontAwesomeIcon icon={copy ? faCheck : faClone} /></span>
            </div>
        </> : null}
    </>
}

export default BankDonation