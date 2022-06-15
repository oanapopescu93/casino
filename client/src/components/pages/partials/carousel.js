import React, {Component} from 'react'
import Button from 'react-bootstrap/Button'

import $ from 'jquery'; 

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import vegetables_yellow from '../../img/icons/vegetables_yellow.png';
import rabbit_img_board from '../../img/race_imgs/rabbit.jpg';
import { showResults } from '../../utils';
import Stars from './stars';

class Carousel extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			socket: props.socket,
			lang: props.lang,
			item_list: props.item_list,			
			template: props.template,
			user: props.user,
			money: props.money,
			get_list: props.get_list,			
		};		

		this.text = {
			"salon": {
				"ro": {"table": "Masa: ","type": "Tip: ","play": "Joaca","error": "Nu exista masa!",},
				"eng": {"table": "Table: ","type": "Type: ","play": "Play","error": "Ups, no tabel!",}
			},
			"race": {
				"ro": {"delay": "Intarziere: ","health": "Sanatate: ","bet": "Pariaza: ","place": "Loc: ",},
				"eng": {"delay": "Delay: ","health": "Health: ","bet": "Bet: ","place": "Place: ",}
			},
			"market": {
				"ro": {"delay": "Intarziere: ","health": "Sanatate: ","bet": "Pariaza: ","place": "Loc: ",},
				"eng": {"delay": "Delay: ","health": "Health: ","bet": "Bet: ","place": "Place: ",}
			}
		}

		this.item_list_changed = props.item_list;

		this.handleClick = this.handleClick.bind(this);
		this.my_click = this.my_click.bind(this);
		this.decrease = this.decrease.bind(this);
		this.increase = this.increase.bind(this);
		this.dropdown = this.dropdown.bind(this);
	}

	componentDidMount(){
		$(".race_input").val(0)
	}

	componentDidUpdate(e) {
		//check if language has changed
		let self = this
		if(e.lang !== self.props.lang){
			//this is the only way you can update text in Owl Carousel (only way I have found yet). Ye, I know, it sucks.			
			let template = e.template;
			let lang = self.props.lang
			let rabbit_box_text = $('.rabbit_box_text')
			if(rabbit_box_text.length>0){
				rabbit_box_text.each(function() {
					let type = $(this).attr('type');
					let text = self.text[template][lang][type];
					$(this).text(text);
				  });
			}		
		}
	}
	
	handleClick(table_name, table_id, table_type="", user) {
		var payload = {table_name, table_id, table_type, user}
		this.state.socket.emit('choose_table_send', payload);	
		this.state.socket.on('choose_table_read', function(data){
			window.location.href = '/table/' + data;
		});	
	}

	my_click(id){
		if(this.state.lang === "ro"){
			alert('Nu exista metoda de plata inca.')
		} else {
			alert('No payment methods yet.')
		}
	}

	decrease(t, e){
		let target = $(e.target);
		let item_list = this.state.item_list;
		let input = target.closest('.bet_container').find('.race_input');
		if(item_list && item_list.length>0){
			if(item_list[t]){
				if(item_list[t].bet-1 >= 0){
					item_list[t].bet--					
					input.val(item_list[t].bet);
					this.item_list_changed = item_list
				}
			}
		}
	}

	increase(t, e){
		let target = $(e.target);	
		let item_list = this.state.item_list;
		let money = this.props.money;
		let input = target.closest('.bet_container').find('.race_input');
		if(item_list && item_list.length>0){
			if(item_list[t]){
				if(item_list[t].bet+1 > money){
					if(this.props.lang === "ro"){
						showResults("Nu ai suficienti morcovi!", "Du-te si cumpara din Market", 600);
					} else {
						showResults("You don't have enough carrots!", "Go and buy some from the Market.", 600);
					}
				} else {
					item_list[t].bet++					
					input.val(item_list[t].bet);
					this.item_list_changed = item_list
				}		
			}
		}
	}

	dropdown(t, value, e){
		let target = $(e.target);
		let place_box = target.closest('.place_box');
		place_box.find('li').removeClass('active');
		target.closest('li').addClass('active');
		let input = target.closest('.bet_container').find('.race_input');

		let item_list = this.state.item_list;
		if(item_list && item_list.length>0){
			if(item_list[t]){
				item_list[t].place = value;
			}
			input.val(item_list[t].bet)
			this.item_list_changed = item_list
		}
	}	

	render() {
		let self = this;
		let lang = this.props.lang;
		let user = this.props.user;
		let template = this.props.template;
		let item_list = this.state.item_list;
		return (
			<div className="Owl_container">
				{(() => {
					if(template === "salon"){
						const options = {
							items: 4,
							nav: false,
							rewind: true,
							autoplay: false,
							slideBy: 1,
							dots: false,
							loop:true,
							responsive:{
								0:{
									items:1
								},
								768:{
									items:3
								},
								1200:{
									items:4
								},
							}
						};
						return (
							<OwlCarousel {...options}>
								{
									item_list.map(function(item, i){
										let button_id = "button_"+i;
										switch (item.table_name) {
											case "roulette":
											case "slots":
												return (
													<div key={i} className="table_inside">
														<div className="table_box shadow_concav">
															<div>
																<p>{lang === "ro" ? <span className="rabbit_box_text" type="table">Masa: </span> : <span className="rabbit_box_text" type="table">Tabel: </span>}{item.table_name} {item.table_id}</p>
																<p>{lang === "ro" ? <span className="rabbit_box_text" type="type">Tip: </span> : <span className="rabbit_box_text" type="type">Type: </span>}{item.table_type}</p>
																<Button id={button_id} className="button_table shadow_convex" type="button" onClick={()=>self.handleClick(item.table_name, item.table_id, item.table_type, user)}>
																	{lang === "ro" ? <span className="rabbit_box_text" type="play">Joaca</span> : <span className="rabbit_box_text" type="play">Play</span>}
																</Button>
															</div>
														</div>
													</div>
												)
											case "blackjack":
											case "craps":
												return (
													<div key={i} className="table_inside">
														<div className="table_box shadow_concav">
															<div>
																<p>{lang === "ro" ? <span className="rabbit_box_text" type="table">Masa:</span> : <span className="rabbit_box_text" type="table">Tabel:</span>}{item.table_name} {item.table_id}</p>
																<Button id={button_id} className="button_table shadow_convex" type="button" onClick={()=>self.handleClick(item.table_name, item.table_id, '', user)}>
																	{lang === "ro" ? <span className="rabbit_box_text" type="play">Joaca</span> : <span className="rabbit_box_text" type="play">Play</span>}
																</Button>
															</div>
														</div>
													</div>
												)
											default:
												return (
													<div>
														{lang === "ro" ? <span className="rabbit_box_text" type="error">Nu exista masa!</span> : <span className="rabbit_box_text" type="error">Ups, no tabel!</span>}
													</div>										
												);					
										}
									})
								} 
							</OwlCarousel>
						);
					} else if(template === "market"){
						const options = {
							items: 4,
							nav: false,
							rewind: true,
							autoplay: false,
							slideBy: 1,
							dots: false,
							loop:true,
							responsive:{
								0:{
									items:1
								},
								768:{
									items:3
								},
							}
						};
				
						return(
							<OwlCarousel {...options}>
								{
									item_list.map(function(item, i){
										let id = item.id;
										return(
											<div key={i} className="table_inside">
												<div className="table_box shadow_concav">
													{(() => {
														return (
															<div className="crop_vegetables">
																<img alt="vegetable" className={'vegetable '+item.name} src={vegetables_yellow}></img>
															</div>
														)
													})()}    
													<h3>{item.name}</h3>
													<p>{lang === "ro" ? <span>Valoare: </span> : <span>Value: </span>}<b>{item.value}</b></p>
													<p>{lang === "ro" ? <span>Cantitate: </span> : <span>Quantity: </span>}<b>{item.quantity}</b></p>
													<p>{lang === "ro" ? <span>Pret: </span> : <span>Price: </span>}<b>{item.value}</b></p>
													{lang === "ro" ? 
														<Button className="button_table shadow_convex" id="item01" type="button" onClick={() => self.my_click(id)}>Click</Button> : 
														<Button className="button_table shadow_convex" id="item01" type="button" onClick={() => self.my_click(id)}>Buy</Button>
													}										
												</div>
											</div>												
										)
									})
								}
							</OwlCarousel>
						);
					} else if(template === "race"){
						const options = {
							items: 1,
							nav: false,
							rewind: true,
							autoplay: false,
							slideBy: 1,
							dots: false,
							loop:true,
							responsive:{
								0:{
									items:1
								},
								1024:{
									items:3
								},
							}
						};
						return(
							<>							
								<OwlCarousel {...options}>									
									{
										item_list.map(function(item, i){
											let rabbit_box_style = "rabbit_box_nr shadow_convex " + item.color;
											return(
												<div className="rabbit_box_container" key={i}>
													<div id={"rabbit_box_"+i} className="rabbit_inside">
														<div className="rabbit_box">
															<div className="rabbit_box_left">
																<div className="rabbit_box_pic">																			
																	<div className={rabbit_box_style}><p>{item.id}</p></div>
																	<img className="shadow_convex" src={rabbit_img_board} alt="rabbit_img_board" />																			
																</div>
																<div className="rabbit_box_name shadow_convex"><p>{item.name}</p></div>
																<div className="rabbit_box_info">
																	<p className="rabbit_info rabbit_delay">
																		{lang === "ro" ? <span className="rabbit_box_text" type="delay">Intarziere:</span> : <span className="rabbit_box_text" type="place">Delay:</span>}
																	{item.delay}</p>
																	<p className="rabbit_info rabbit_health">
																		{lang === "ro" ? <span className="rabbit_box_text" type="health">Sanatate:</span> : <span className="rabbit_box_text" type="place">Health:</span>}
																	</p>
																	<Stars score={item.health} max={item.health_max}></Stars>
																	{/* <p className="rabbit_info rabbit_max_speed">Max speed: {item.max_speed}</p>
																	<p className="rabbit_info rabbit_min_speed">Min speed: {item.min_speed}</p> */}
																</div>									
															</div>
															<div className="rabbit_box_right">
																<div className="rabbit_box_input">																	
																	{lang === "ro" ? <p className="rabbit_box_text" type="bet">Pariaza:</p> : <p className="rabbit_box_text" type="bet">Bet:</p>}																
																	<div className="bet_container">
																		<span onClick={(e)=>{self.decrease(i, e)}} className="rabbit_box_minus">-</span>
																		<input id={"race_input_"+i} className="race_input" readOnly type="text"></input>
																		<span onClick={(e)=>{self.increase(i, e)}} className="rabbit_box_plus">+</span>
																	</div>
																	{lang === "ro" ? <p className="rabbit_box_text" type="place">Loc:</p> : <p className="rabbit_box_text" type="place">Place:</p>}
																	<div className="place_container">
																		<ul className="place_box">
																			<li className="active" onClick={(e)=>{self.dropdown(i, 1, e)}} place="1">1</li>
																			<li onClick={(e)=>{self.dropdown(i, 2, e)}} place="2">2</li>
																			<li onClick={(e)=>{self.dropdown(i, 3, e)}} place="3">3</li>
																			<li onClick={(e)=>{self.dropdown(i, 4, e)}} place="4">4</li>
																			<li onClick={(e)=>{self.dropdown(i, 5, e)}} place="5">5</li>
																			<li onClick={(e)=>{self.dropdown(i, 6, e)}} place="6">6</li>
																		</ul>
																	</div>
																</div>																		
															</div>																													
														</div>																												
													</div>																												
												</div>											
											)
										})
									}
								</OwlCarousel>
							</>
						);
					}	
				})()}
			</div>
		)
	}
}

export default Carousel;