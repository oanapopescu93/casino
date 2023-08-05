import React from 'react'
import { translate } from '../../translations/translate'
import Cell from './cell'

function List(props) {
    const {lang, itemList, template, type} = props

	return <>
        {(() => {
            if(template){
                return <>
                    {itemList.map(function(item, i){
                        return <div key={i} className='item'>
                            <Cell index={i+1} lang={lang} data={item} template={template} type={type}></Cell>
                        </div>
                    })}
                </>
            } else {
                return <p>{translate({lang: lang, info: "no_data"})}</p>
            }
        })()}        
    </>
}

export default List