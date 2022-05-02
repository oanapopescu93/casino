import React from 'react';
import { setCookie } from '../../utils';

var self;
class Language extends React.Component {
	constructor(props) {
		super(props);
		self = this;
        self.state = {
			lang_change: props.lang_change,
	  	};
        self.click_lang = self.click_lang.bind(self);     
	}
    
    click_lang(lang){
        switch (lang) {
            case 'eng':
                setCookie("casino_lang", "eng", 30);
                self.state.lang_change('eng');
                break;
            case 'ro':
                setCookie("casino_lang", "ro", 30);
                self.state.lang_change('ro');
                break;	
            default:
                setCookie("casino_lang", "eng", 30);
                self.state.lang_change('eng');
                break;				
        }
    }

    render(){
        return (
            <div id="crop_language_container">
                <div className="crop_language_box color_yellow" onClick={()=>self.click_lang('eng')}>
                    <span>ENG</span>
                </div>
                <div className="crop_language_box color_yellow" onClick={()=>self.click_lang('ro')}>
                    <span>RO</span>
                </div>                
            </div>
        );
    };
}

export default Language;