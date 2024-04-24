import React from 'react'
import { translate } from '../../translations/translate'
import Cell from './cell'

function List(props) {
	return <>
        {props.template ? <>
            {props.itemList.map(function(item, i){
                return <div key={i} className='item'>
                    <Cell index={i+1} data={item} {...props}></Cell>
                </div>
            })}
        </> : <p>{translate({lang: props.lang, info: "no_data"})}</p>}       
    </>
}

export default List