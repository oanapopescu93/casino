import React from 'react';
import $ from 'jquery'; 
import { getCookie, setCookie } from '../utils';

var self;
class Settings extends React.Component {
	constructor(props) {
		super(props);
		self = this;
		self.state = {
              date: "DD/MM/YYYY H:M",
              currency: "carrot"
		};
        self.handleChoose = self.handleChoose.bind(self);
	}

    handleChoose(e, type, choose){  
        if(typeof type !== "undefined" && type !== ""){
            if(typeof choose !== "undefined" && choose !== ""){
                var target = e.target;
                var parent = target.parentElement.parentElement;
                $(parent).find('.dropbtn').text(choose);

                switch(type){
                    case "date":
                        setCookie("casino_date", choose, 1);
                       break;
                    case "currency":
                        setCookie("casino_currency", choose, 1);
                        break;		
                    default: 
                        break;
                }
            }
        }
    }

    componentDidMount(){
        if(getCookie("casino_date") !== ""){
            self.setState({ date: getCookie("casino_date") }); 
        }
        if(getCookie("casino_currency") !== ""){
            getCookie({ currency: getCookie("casino_currency") }); 
        }
    }
	
	render(){
		return (
            <div id="settings_container">
                        <div className="dropdown_group">
                            <p>Date</p>
                            <div className="dropdown">
                                <div className="dropbtn">{self.state.date}</div>
                                <div className="dropdown-content">
                                    <div onClick={(e) => self.handleChoose(e, "date", "DD/MM/YYYY H:M")} className="dropdown_item">DD/MM/YYYY H:M</div>
                                    <div onClick={(e) => self.handleChoose(e, "date", "MM/DD/YYYY H:M")} className="dropdown_item">MM/DD/YYYY H:M</div>
                                </div>
                            </div>
                        </div>
                        <div className="dropdown_group">
                            <div className="dropdown">
                                <div className="dropbtn">{self.state.currency}</div>
                                <div className="dropdown-content">
                                    <div onClick={(e) => self.handleChoose(e, "currency", "garlic")} className="dropdown_item">garlic</div>
                                    <div onClick={(e) => self.handleChoose(e, "currency", "onion")} className="dropdown_item">onion</div>
                                    <div onClick={(e) => self.handleChoose(e, "currency", "radish")} className="dropdown_item">radish</div>
                                    <div onClick={(e) => self.handleChoose(e, "currency", "carrot")} className="dropdown_item">carrot</div>
                                    <div onClick={(e) => self.handleChoose(e, "currency", "turnip")} className="dropdown_item">turnip</div>
                                    <div onClick={(e) => self.handleChoose(e, "currency", "potato")} className="dropdown_item">potato</div>
                                    <div onClick={(e) => self.handleChoose(e, "currency", "cabbage")} className="dropdown_item">cabbage</div>
                                </div>
                            </div>
                        </div>

                        {/* <div style={{'display': 'none'}}>
                            <div className="crop_vegetables_box">
                                <div className="crop_vegetables"><img alt="vegetable" className="vegetable radish" src={vegetables}/></div>
                                <p>100</p>
                            </div>
                            <div className="crop_vegetables_box">
                                <FontAwesomeIcon icon={faArrowsAltH} />
                            </div>                            
                            <div className="crop_vegetables_box">
                                <div className="crop_vegetables"><img alt="vegetable" className="vegetable onion" src={vegetables}/></div>
                                <p>50</p>
                            </div>
                            <div className="crop_vegetables_box">
                                <FontAwesomeIcon icon={faArrowsAltH} />
                            </div>  
                            <div className="crop_vegetables_box">
                                <div className="crop_vegetables"><img alt="vegetable" className="vegetable potato" src={vegetables}/></div>
                                <p>20</p>
                            </div>
                            <div className="crop_vegetables_box">
                                <FontAwesomeIcon icon={faArrowsAltH} />
                            </div>  
                            <div className="crop_vegetables_box">
                                <div className="crop_vegetables"><img alt="vegetable" className="vegetable carrot" src={vegetables}/></div>
                                <p>10</p>
                            </div>
                            <div className="crop_vegetables_box">
                                <FontAwesomeIcon icon={faArrowsAltH} />
                            </div>  
                            <div className="crop_vegetables_box">
                                <div className="crop_vegetables"><img alt="vegetable" className="vegetable cabbage" src={vegetables}/></div>
                                <p>1</p>
                            </div>
                        </div> */}
                        						
                    </div>
		);
	};
}

export default Settings;