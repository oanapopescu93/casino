import React from 'react'
import { translate } from '../../translations/translate'

function SlotsPrizeTable(props){    
    const {lang, slotsPrizes} = props
    let matrix = slotsPrizes.matrix
    
    return <div className="slots_rules_container">
        {matrix && matrix.length>0 ? <div className="slots_rules">
            {matrix.map(function(item, i){ 
                let small_matrix = item.matrix
                let length = small_matrix.length
                let prize = item.prize       
                return <div key={i} className="slots_rules_box">                    
                    <div className="slots_rules_left">
                        {small_matrix && length>0 ? <table><tbody>
                            {Array.from({ length: 3 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {small_matrix.slice(0, length).map((x, colIndex) => {
                                        let style = rowIndex === x[0] && colIndex === x[1] ? "selected" : ""
                                        return <td key={colIndex} x={x} row={rowIndex} col={colIndex} className={style} />
                                    })}
                                </tr>
                            ))}
                        </tbody></table> : null}
                    </div>
                    <div className="slots_rules_right">{translate({lang: lang, info: "prize"})}: {prize}</div>                   
                </div>
            })}
        </div> : null}
    </div>
}

export default SlotsPrizeTable