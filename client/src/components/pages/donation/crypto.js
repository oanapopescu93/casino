import React, { useState } from 'react'
import { translate } from '../../../translations/translate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faCheck } from '@fortawesome/free-solid-svg-icons'

function CryptoDonation(props){    
    const {lang, list} = props
    const [index, setIndex] = useState(-1)
    const [copy, setCopy] = useState(false)
    const cryptoDonation = list.filter(x => x.type === "crypto")

    function copyToClipboard(i, item){
        navigator.clipboard.writeText(item.text).then(() => {
            setIndex(parseInt(i))
            setCopy(true)            
            setTimeout(()=>{
                setIndex(-1)
                setCopy(false)
           }, 1000)
        })
        .catch(err => {
            console.error('Failed to copy IBAN: ', err)
        })
    }

    return <>
        {cryptoDonation && cryptoDonation.length > 0 ? <>
            <h2>{translate({lang, info: "crypto_donation_title"})}</h2>
            <p>{translate({lang, info: "crypto_donation_text"})}</p>
            <ul>
                {cryptoDonation
                    .filter(item => item.text !== "")
                    .map((item, i) => {
                        if(item.text !== "-"){
                            if(item.link){
                                return <li key={i} className="donation_link donation_link_crypto selectable">
                                    <a href={item.link}>
                                        <span className="crypto_label">{item.title}:</span>&nbsp;
                                        <strong className="crypto_text selectable">{item.text}</strong>
                                    </a>
                                </li>
                            }
                            return <li key={i} className="donation_link donation_link_crypto selectable" onClick={()=>copyToClipboard(i, item)}>
                                <span className="crypto_label">{item.title}:</span>&nbsp;
                                <strong className="crypto_text selectable">{item.text}</strong>&nbsp;
                                <span className="crypto_icon"><FontAwesomeIcon icon={copy && index === parseInt(i) ? faCheck : faClone} /></span>
                            </li>
                        } else {
                            return
                        }                        
                    })
                }
            </ul>
            <a className="mybutton button_transparent donation_button shadow_convex" href="https://nowpayments.io/donation?api_key=Z1KG9J0-GNHMNQE-PT6HD64-ET6GTWK" target="_blank" rel="noreferrer noopener">
                {translate({lang, info: "donate_with_nowpayments"})}
            </a>
        </> : null}
    </>
}

export default CryptoDonation