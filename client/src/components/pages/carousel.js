import React from 'react';
import Button from 'react-bootstrap/Button'

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

var socket;

function Carousel(props){
	socket = props.socket;	
	var item_list = props.item_list;
	var template = props.template;
	var user = props.user;

	function my_click(id){
		console.log('buy', id);
		alert('No payment methods yet')
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
									return (
										<div key={i} className="table_inside">
											<div className="table_box shadow_concav">
												<div>
													<p>Table: {item.table_name} {item.table_id}</p>
													<p>Type: {item.table_type}</p>
													<Button id={button_id} className="button_table shadow_convex" type="button" onClick={()=>handleClick(item.table_name, item.table_id, item.table_type, user)}>Play</Button>
												</div>
											</div>
										</div>
									)
								case "blackjack":
								case "slots":
									return (
										<div key={i} className="table_inside">
											<div className="table_box shadow_concav">
												<div>
													<p>Table: {item.table_name} {item.table_id}</p>
													<Button id={button_id} className="button_table shadow_convex" type="button" onClick={()=>handleClick(item.table_name, item.table_id, '', user)}>Play</Button>
												</div>
											</div>
										</div>
									)
								default:
									break;						
							}
						})
					} 
				</OwlCarousel>
			</div>
		);
	} else {
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
										<h3>{item.name}</h3>
										<p>Value: {item.value}</p>
										<p>Price: <b>{item.price}</b></p>
										<Button className="button_table shadow_convex" id="item01" type="button" onClick={() => my_click(id)}>Buy</Button>
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