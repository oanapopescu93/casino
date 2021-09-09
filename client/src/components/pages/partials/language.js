import React from 'react';

var self;
class Language extends React.Component {
	constructor(props) {
		super(props);
		self = this;
        self.state = {
			lang_change: props.lang_change,
	  	};
        self.click_lang = self.click_lang.bind(self);
		self.setCookie = self.setCookie.bind(self);	        
	}
    
    click_lang(lang){
        switch (lang) {
            case 'eng':
                self.setCookie("casino_lang", "eng", 30);
                self.state.lang_change('eng');
                break;
            case 'ro':
                self.setCookie("casino_lang", "ro", 30);
                self.state.lang_change('ro');
                break;	
            default:
                self.setCookie("casino_lang", "eng", 30);
                self.state.lang_change('eng');
                break;				
          }          
    }

	setCookie = function(cname,cvalue,exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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