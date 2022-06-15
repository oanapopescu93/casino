import React, {Component} from 'react';
import $ from 'jquery'; 

// import carrot_img from '../img/icons/carrot_icon.png';
import market_img from '../img/icons/market_icon.png';
import inventory_img from '../img/icons/inventory_icon.png';

import AccountProfile from './account_profile';
import AccountMarket from './account_market';

class UserAccount extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true,
			market: [],
			account_info: props.info,
			socket: props.socket,
			lang: props.lang,
		}
	}	

	componentDidMount() {
		let self = this;		
		self.setState({ lang: self.props.lang });
		let payload = {
			id: self.state.account_info.user_id, 
			user: self.state.account_info.user, 
			type: self.state.account_info.type, 
			user_table: self.state.account_info.user_table
		}
		self.state.socket.emit('market_send', payload);
		self.state.socket.on('market_read', function(data){
			self.setState({ market: data});
		});	
		// fetch("/api/market", {
		// 	headers : { 
		// 		'Content-Type': 'application/json',
		// 		'Accept': 'application/json'
		// 	},
		// 	method: "POST",
		// 	body: JSON.stringify(payload)
		// })
		// .then(function(response) {
		// 	return response.text();
		// })
		// .then(function(text) {
		// 	var data = JSON.parse(text)
		// 	self.setState({ market: data.data});
		// })
		// .catch(error => {
		// 	console.error("There has been a problem with your fetch operation:", error);
		// });    
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
		$('.full-height').attr('id', 'user_account');
		let lang = this.props.lang;
		return (
			<div className="color_yellow">	
				<div className="account_tabs_container">
					<div id="account_profile" className="account_tabs active" onClick={()=>this.account_choose_tab("account_profile")}><img alt="inventory_img" className="account_img" src={inventory_img} />
						{lang === "ro" ? <span>Profil</span> : <span>Profile</span>}
					</div>
					<div id="account_market" className="account_tabs" onClick={()=>this.account_choose_tab("account_market")}><img alt="market_img" className="account_img" src={market_img} /> Market</div>
				</div>
				
				{ this.state.visible ? <AccountProfile info={this.state.account_info} lang={lang}></AccountProfile> : 
					<AccountMarket info={this.state.account_info} lang={lang} market={this.state.market}></AccountMarket>
				}
			</div>
		);
		
	}
}

export default UserAccount;