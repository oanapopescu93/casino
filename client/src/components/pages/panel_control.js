import React from 'react';
import { connect } from 'react-redux';
import {game_visible} from '../actions/actions'
import $ from 'jquery';

import ChatForm from './chatForm'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import carrot_img from '../img/icons/carrot_icon.png';

function Panel(props){
    var user = props.user;
    var type = props.type;
    var user_table = props.user_table;
    var money = props.money;
    var socket = props.socket;
    var dispatch = props.dispatch;

    setTimeout(function(){ 	
        var prev_click = "";

		function open_panel(){
			$('.panel_container').toggleClass('open');
		}
		
		$('.button_container').click(function(){
            var next_click = $(this).attr('panel');     

            if(prev_click === next_click || prev_click === ""){           
                open_panel();
            } else if(!$('.panel_container').hasClass('open')){
                $('.panel_container').addClass('open');
            }
            
            $('.panel_box').hide();
            $('#'+next_click).show();
            prev_click = next_click;	
		});
	}, 0);

    function handleClick(link) {
        console.log('logout', link)
		switch (link) {
			case "account":
                dispatch(game_visible(false))
			  	break;
			case "casino":
				dispatch(game_visible(true))
				break;
			case "logout":				
				setCookie("casino_user", '', 1);
				setCookie("casino_email", '', 1);
				var url_back01 = window.location.href.split('/table/');
				window.location.href = url_back01[0];
			 	break;
			default:
				var url_back02 = window.location.href.split('/table/');
				window.location.href = url_back02[0];
		  }
	}

	function setCookie(cname,cvalue,exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	return (
		<div className="panel_container">
            <div id="user_button" panel="user_panel_box" className="button_container">            
                <div>
                    <FontAwesomeIcon icon={faUserCircle} />
                    <h4>User</h4>
                </div>
            </div>
            <div id="chat_button" panel="chat_panel_box" className="button_container">
                <div>
                    <FontAwesomeIcon icon={faComments} />
                    <h4>Chat</h4>
                </div>
            </div>
            <div id="user_panel_box" className="panel_box">
                <ul className="user_list">
                    <li id="user_list_user" className="user_list_item" onClick={() => handleClick('casino')}>
                        <div id="user_name">{user}</div>
                        <div id="user_money"><span>{money}</span><img alt="carrot_img" className="currency_img" src={carrot_img} /></div>
                    </li>
                    <li id="user_list_account" className="user_list_item" onClick={() => handleClick('account')}>My account</li>
                    <li id="user_list_logout" className="user_list_item" onClick={() => handleClick('logout')}>Logout</li>
                </ul>
            </div>
            <div id="chat_panel_box" className="panel_box">
                <ChatForm user={user} type={type} user_table={user_table} socket={socket}></ChatForm>
            </div>
        </div>	
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Panel)