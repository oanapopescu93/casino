import React from 'react';
import Button from 'react-bootstrap/Button'

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import vegetables_yellow from '../../img/icons/vegetables_yellow.png';

function Carousel(props){
	var socket = props.socket;	
	var lang = props.lang;
	var item_list = props.item_list;
	var template = props.template;
	var user = props.user;

	function my_click(id){
		if(lang === "ro"){
			alert('Nu exista metoda de plata inca.')
		} else {
			alert('No payment methods yet.')
		}
	}	

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
	
		function handleClick(table_name, table_id, table_type="", user) {
			var payload = {table_name, table_id, table_type, user}
			socket.emit('choose_table_send', payload);	
			socket.on('choose_table_read', function(data){
				window.location.href = '/table/' + data;
			});	
		}
		return (
			<div className="Owl_container">
				<OwlCarousel {...options}>
					{
						item_list.map(function(item, i){
							var button_id = "button_"+i;
							switch (item.table_name) {
								case "roulette":
								case "slots":
									return (
										<div key={i} className="table_inside">
											<div className="table_box shadow_concav">
												<div>
													<p>{lang === "ro" ? <span>Masa: </span> : <span>Tabel: </span>}{item.table_name} {item.table_id}</p>
													<p>{lang === "ro" ? <span>Tip: </span> : <span>Type: </span>}{item.table_type}</p>
													<Button id={button_id} className="button_table shadow_convex" type="button" onClick={()=>handleClick(item.table_name, item.table_id, item.table_type, user)}>
														{lang === "ro" ? <span>Joaca</span> : <span>Play</span>}
													</Button>
												</div>
											</div>
										</div>
									)
								case "blackjack":
									return (
										<div key={i} className="table_inside">
											<div className="table_box shadow_concav">
												<div>
													<p>{lang === "ro" ? <span>Masa: </span> : <span>Tabel: </span>}{item.table_name} {item.table_id}</p>
													<Button id={button_id} className="button_table shadow_convex" type="button" onClick={()=>handleClick(item.table_name, item.table_id, '', user)}>
														{lang === "ro" ? <span>Joaca</span> : <span>Play</span>}
													</Button>
												</div>
											</div>
										</div>
									)
								default:
									return (
										<div>
											{lang === "ro" ? <span>Nu exista masa!</span> : <span>Ups, no tabel!</span>}
										</div>										
									);					
							}
						})
					} 
				</OwlCarousel>
			</div>
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
			<div className="Owl_container">
				<OwlCarousel {...options}>
					{
						item_list.map(function(item, i){
							var id = item.id;
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
										<p>{lang === "ro" ? <span>Cantitate: </span> : <span>Qty: </span>}<b>{item.quantity}</b></p>
										<p>{lang === "ro" ? <span>Pret: </span> : <span>Pret: </span>}<b>{item.value}</b></p>
										{lang === "ro" ? 
											<Button className="button_table shadow_convex" id="item01" type="button" onClick={() => my_click(id)}>Click</Button> : 
											<Button className="button_table shadow_convex" id="item01" type="button" onClick={() => my_click(id)}>Buy</Button>
										}										
									</div>
								</div>												
							)
						})
					}
				</OwlCarousel>
			</div>
		);
	}
	
}

export default Carousel;