import React from 'react'
import { translate } from '../../translations/translate'

function KenoPrizeTable(props){    
    const {settings, kenoPrizes} = props
    const {lang} = settings
    
    return <div className="keno_rules_container">
        {kenoPrizes && kenoPrizes.length>0 ? <div className="keno_rules">
            {kenoPrizes.map((items, i)=>{ 
                let x = i+1
                return <div key={i} className="keno_rules_box">
                    <div className="keno_rules_box_header">{translate({lang: lang, info: "keno_numbers_played"})}: {x}</div>
                    <div className="keno_rules_box_body">
                        <div className="keno_rules_items">
                            <div className="keno_rules_item">{translate({lang: lang, info: "keno_numbers_matched"})}</div>
                            <div className="keno_rules_item">{translate({lang: lang, info: "keno_win"})}</div>
                        </div>
                        {items.map((item, j)=>{ 
                            return <div key={j} className="keno_rules_items">
                                <div className="keno_rules_item">{item.numbers_matched}</div>
                                <div className="keno_rules_item">{item.win}</div>
                            </div>
                        })}
                    </div>
                </div>
            })}
        </div> : null}
    </div>
}

export default KenoPrizeTable