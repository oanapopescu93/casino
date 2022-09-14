import React from 'react'
import { setCookie } from '../../utils'

class Language extends React.Component {
	constructor(props) {
		super(props)
        this.state = {
			lang_change: props.lang_change,
	  	}
        this.click_lang = this.click_lang.bind(this)    
	}
    
    click_lang(lang){
        switch (lang) {
            case 'eng':
                setCookie("casino_lang", "eng", 336) //will expire after 14 days
                this.state.lang_change('eng')
                break
            case 'ro':
                setCookie("casino_lang", "ro", 336) //will expire after 14 days
                this.state.lang_change('ro')
                break
            default:
                setCookie("casino_lang", "eng", 336) //will expire after 14 days
                this.state.lang_change('eng')
                break			
        }
    }

    render(){
        return (
            <div id="crop_language_container">
                <div className="crop_language_box color_yellow" onClick={()=>this.click_lang('eng')}>
                    <span>ENG</span>
                </div>
                <div className="crop_language_box color_yellow" onClick={()=>this.click_lang('ro')}>
                    <span>RO</span>
                </div>                
            </div>
        )
    }
}

export default Language