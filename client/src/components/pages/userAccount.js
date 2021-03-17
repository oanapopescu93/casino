import React, {Component} from 'react';
import $ from 'jquery'; 

// import carrot_img from '../img/icons/carrot_icon.png';
import market_img from '../img/icons/market_icon.png';
import inventory_img from '../img/icons/inventory_icon.png';

import AccountProfile from './account_profile';
import AccountMarket from './account_market';

var socket;
var account_info = {};
var self;

class UserAccount extends Component {
	constructor(props) {
		super(props);	
		account_info = props;
		socket = props.socket;

		self = this;

		self.state = {
			visible: true,
			market: []
		}
	}	

	componentDidMount() {
		var payload = {
			'id': account_info.user_id, 
			'user': account_info.user, 
			'type': account_info.type, 
			'user_table': account_info.user_table
		}
		socket.emit('market_send', payload);	
		socket.on('market_read', function(data){
			self.setState({ market: data});
		});	
	}
	
	account_choose_tab = function(link){	
		if(link === "account_profile"){			
			this.setState({ visible: true })
			$('#account_profile').addClass('active');
			$('#account_market').removeClass('active');
		} else if(link === "account_market"){
			this.setState({ visible: false })
			$('#account_profile').removeClass('active');
			$('#account_market').addClass('active');
		}
	}	
  
	render() {
		$('.full-height').attr('id', 'user_account')		
		return (
			<div className="color_yellow">	
				<div className="account_tabs_container">
					<div id="account_profile" className="account_tabs active" onClick={()=>this.account_choose_tab("account_profile")}><img alt="inventory_img" className="account_img" src={inventory_img} /> Profile</div>
					<div id="account_market" className="account_tabs" onClick={()=>this.account_choose_tab("account_market")}><img alt="market_img" className="account_img" src={market_img} /> Market</div>
				</div>
				
				{ this.state.visible ? <AccountProfile info={account_info}></AccountProfile> : null }
				{ !this.state.visible ? <AccountMarket info={account_info} market={self.state.market}></AccountMarket> : null }
			</div>
		);
		
	}
}

export default UserAccount;