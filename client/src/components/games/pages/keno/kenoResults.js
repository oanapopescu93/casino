import React from 'react'
import { translate } from '../../../../translations/translate'

function KenoResults(props){ 
    const {lang, list, no_of_games, price_per_game, results} = props
    let list_results = results ? results.list_results : []
    let list_filtered = results ? results.list_filtered : []    

    return <div className="KenoResults_container shadow_convex">
        <div className="KenoResults">
            <div className="KenoResults_box">
                <h4>{translate({lang: lang, info: "no_of_games"})}: <span>{no_of_games}</span></h4>
                <h4>{translate({lang: lang, info: "price_per_game"})}: <span>{price_per_game}</span></h4>
                <h4>{translate({lang: lang, info: "your_numbers"})}: </h4>
                {list && list.length>0 ? <ul>
                    {list.map(function(item, i){
                        let comma = ", "
                        if(i === list.length-1){ //last element from the list will not have a comma
                            comma = ""
                        }
                        return <li key={i}>{item}{comma}</li>
                    })}
                </ul> : null}
            </div>
            {(() => {
                if(list_results && list_results.length>0){                  
                    return <>
                        <div className="KenoResults_box">
                            <h4>{translate({lang: lang, info: "lucky_numbers"})}: </h4>
                            <div className="KenoResults_matrix">
                                {list_results.map(function(items, i){                                     
                                    if(items && items.length>0){
                                        return <ul key={i}>
                                            {items.map(function(item, j){                                                 
                                                let comma = ", "
                                                if(j === items.length-1){ //last element from the list will not have a comma
                                                    comma = ""
                                                }
                                                return <li key={j}>{item}{comma}</li>
                                            })} 
                                        </ul>
                                    } else {
                                        return null
                                    }
                                })} 
                            </div>
                        </div>
                        <div className="KenoResults_box">
                            <h4>{translate({lang: lang, info: "results"})}: </h4>
                            <div className="KenoResults_matrix">
                                {(() => {
                                    if(list_filtered && list_filtered.length>0){
                                        return <ul>
                                            {list_filtered.map(function(item, i){
                                                let comma = ", "
                                                if(i === list_filtered.length-1){ //last element from the list will not have a comma
                                                    comma = ""
                                                }
                                                return <li key={i}>{item}{comma}</li>
                                            })}
                                        </ul>
                                    } else {
                                        return <p>{translate({lang: lang, info: "no_match"})}</p>
                                    }    
                                })()}   
                            </div>
                        </div>
                    </>
                }
            })()}            
        </div>
    </div>
}

export default KenoResults