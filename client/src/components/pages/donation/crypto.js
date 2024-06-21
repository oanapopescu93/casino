import React from 'react'
import { translate } from '../../../translations/translate'
function CryptoDonation(props){    
    const {lang, list} = props
    const cryptoDonation = list.filter(x => x.type === "crypto")
    return <>
        {cryptoDonation && cryptoDonation.length > 0 ? <>
            <h2>{translate({lang: lang, info: "crypto_donation_title"})}</h2>
            <p>{translate({lang: lang, info: "crypto_donation_text"})}</p>
            <ul>
                {cryptoDonation
                    .filter(item => item.text !== "")
                    .map((item, i) => (
                        <li key={i} className="donation_link donation_link_crypto">
                            {item.link ? <>
                                <a href={item.link}><strong>{item.title}: </strong> <span>{item.text}</span></a>
                            </> : <><strong>{item.title}: </strong> <span>{item.text}</span></>}
                        </li>
                    ))
                }
            </ul>
        </> : null}
    </>
}
export default CryptoDonation