import React, { useState } from 'react';
import { connect } from 'react-redux';
import {game_visible} from '../actions/actions'
import $ from 'jquery'; 
import Modal from 'react-bootstrap/Modal'

import Settings from './control_settings'
import ChatForm from './chatForm'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faComments, faHome, faCog, faPowerOff } from '@fortawesome/free-solid-svg-icons'

import carrot_img from '../img/icons/carrot_icon.png';

import { setCookie } from '../utils';

function Panel(props){
    var user = props.user;
    var type = props.type;
    var user_table = props.user_table;
    var money = props.money;
    var socket = props.socket;
    var dispatch = props.dispatch;
    var game_title = props.user_table;
    var lang = props.lang;

    const [show, setShow] = useState(false);

	function handleClose(){ setShow(false) };
    function handleShow(){ setShow(true) };

    setTimeout(function(){ 	
        var prev_click = "";

        $('body').off('click').on('click', function(event) {
            if($(event.target).closest(".panel_container").length === 0){
                $('.panel_container').removeClass('open');
            }
        });

		function open_panel(){
			$('.panel_container').toggleClass('open');
		}

        $('.button_container').off('click').on('click', function(event) {
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
        var url_back01 = window.location.href.split('/table/');
		switch (link) {
			case "account":
                $('#user_list_user_game').removeClass('active');
			    $('#user_list_user_account').addClass('active');
                dispatch(game_visible('account'))
			  	break;
			case "casino":
                $('#user_list_user_game').addClass('active');
			    $('#user_list_user_account').removeClass('active');
				dispatch(game_visible('game'))
				break;
            case "salon":					
				window.location.href = url_back01[0]+"/salon";
			 	break;
            case "settings":	
                handleShow();
                break;
			case "logout":				
				setCookie("casino_user", '', 1);
				setCookie("casino_email", '', 1);
				window.location.href = url_back01[0];
			 	break;
            case "support":
                dispatch(game_visible('support'))
                break;
			default:
				var url_back02 = window.location.href.split('/table/');
				window.location.href = url_back02[0];
		  }
	}
    
	return (
        <>
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
                    <h4 id="user_title">{game_title}</h4>
                    <p id="user_subtitle">
                        <span id="user_name">{user}</span>
                        <span id="user_money"><span>{money}</span><img alt="carrot_img" className="currency_img" src={carrot_img} /></span>
                    </p>
                    <p id="user_list_user">
                        <span id="user_list_user_game" className="user_list_button active" onClick={() => handleClick('casino')}>{lang === "ro" ? <span>Joc</span> : <span>Game</span>}</span>
                        <span id="user_list_user_account" className="user_list_button" onClick={() => handleClick('account')}>{lang === "ro" ? <span>Contul meu</span> : <span>My account</span>}</span>
                    </p>
                    <ul className="user_list">
                        <li id="user_list_salon" className="user_list_item" onClick={() => handleClick('salon')}>{lang === "ro" ? <span><FontAwesomeIcon icon={faHome} /> Salon</span> : <span><FontAwesomeIcon icon={faHome} /> Salon</span>}</li>
                        <li id="user_list_settings" className="user_list_item" onClick={() => handleClick('settings')}>{lang === "ro" ? <span><FontAwesomeIcon icon={faCog} /> Setari</span> : <span><FontAwesomeIcon icon={faCog} /> Settings</span>}</li>
                        <li id="user_list_logout" className="user_list_item" onClick={() => handleClick('logout')}>{lang === "ro" ? <span><FontAwesomeIcon icon={faPowerOff} /> Delogare</span> : <span><FontAwesomeIcon icon={faPowerOff} /> Logout</span>}</li>
                    </ul>
                    <div id="support_button" onClick={() => handleClick('support')}>{lang === "ro" ? <span>Suport</span> : <span>Support</span>}</div>
                </div>
                <div id="chat_panel_box" className="panel_box">
                    <ChatForm user={user} type={type} user_table={user_table} socket={socket}></ChatForm>
                </div>
            </div>

            <Modal className="casino_modal" id="settings_modal" show={show} onHide={handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>{lang === "ro" ? <span>Setari</span> : <span>Settings</span>}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Settings></Settings>
                </Modal.Body>				
            </Modal>
        </>	
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Panel)