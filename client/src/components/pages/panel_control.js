import React, { useState } from 'react';
import { connect } from 'react-redux';
import {game_visible} from '../actions/actions'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import $ from 'jquery'; 
import Modal from 'react-bootstrap/Modal'

import ChatForm from './chatForm'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { faArrowsAltH } from '@fortawesome/free-solid-svg-icons'
import carrot_img from '../img/icons/carrot_icon.png';
import vegetables from '../img/icons/vegetables_black.png'

function Panel(props){
    var user = props.user;
    var type = props.type;
    var user_table = props.user_table;
    var money = props.money;
    var socket = props.socket;
    var dispatch = props.dispatch;
    var game_title = props.user_table;

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
		switch (link) {
			case "account":
                $('#user_list_user_game').removeClass('active');
			    $('#user_list_user_account').addClass('active');
                dispatch(game_visible(false))
			  	break;
			case "casino":
                $('#user_list_user_game').addClass('active');
			    $('#user_list_user_account').removeClass('active');
				dispatch(game_visible(true))
				break;
            case "salon":	
				var url_back01 = window.location.href.split('/table/');
				window.location.href = url_back01[0]+"/salon";
			 	break;
            case "settings":	
                handleShow();
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

    function settings_save(){   
        setCookie("casino_data", $('#settings_data').val(), 1);
		setCookie("casino_currency", $('#settings_currency').val(), 1);
        handleClose();
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
                        <span id="user_list_user_game" className="user_list_button active" onClick={() => handleClick('casino')}>Game</span>
                        <span id="user_list_user_account" className="user_list_button" onClick={() => handleClick('account')}>My account</span>
                    </p>
                    <ul className="user_list">
                        <li id="user_list_salon" className="user_list_item" onClick={() => handleClick('salon')}><span>Salon</span></li>
                        <li id="user_list_settings" className="user_list_item" onClick={() => handleClick('settings')}><span>Settings</span></li>
                        <li id="user_list_logout" className="user_list_item" onClick={() => handleClick('logout')}><span>Logout</span></li>
                    </ul>
                </div>
                <div id="chat_panel_box" className="panel_box">
                    <ChatForm user={user} type={type} user_table={user_table} socket={socket}></ChatForm>
                </div>
            </div>

            <Modal className="casino_modal" id="settings_modal" show={show} onHide={handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="settings_form" method="post" action="/settings">
                        <Form.Group>
                            <Form.Label for="settings_data">Date</Form.Label>
                            <Form.Control id="settings_data" name="settings_data" className="input_yellow" as="select">
                                <option>MM/DD/YYYY H:M</option>
                                <option>MM/DD/YYYY H:M</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label for="settings_currency">Currency</Form.Label>
                            <Form.Control id="settings_currency" name="settings_currency" className="input_yellow" as="select">
                                <option value="carrot">Carrot</option>
                                <option value="raddish">Radish</option>                                
                                <option value="cabbage">Cabbage</option>
                            </Form.Control>
                        </Form.Group>

                        <div>
                            <div className="crop_vegetables_box">
                                <div className="crop_vegetables"><img className="vegetable radish" src={vegetables}/></div>
                                <p>100</p>
                            </div>
                            <div className="crop_vegetables_box">
                                <FontAwesomeIcon icon={faArrowsAltH} />
                            </div>                            
                            <div className="crop_vegetables_box">
                                <div className="crop_vegetables"><img className="vegetable onion" src={vegetables}/></div>
                                <p>50</p>
                            </div>
                            <div className="crop_vegetables_box">
                                <FontAwesomeIcon icon={faArrowsAltH} />
                            </div>  
                            <div className="crop_vegetables_box">
                                <div className="crop_vegetables"><img className="vegetable potato" src={vegetables}/></div>
                                <p>20</p>
                            </div>
                            <div className="crop_vegetables_box">
                                <FontAwesomeIcon icon={faArrowsAltH} />
                            </div>  
                            <div className="crop_vegetables_box">
                                <div className="crop_vegetables"><img className="vegetable carrot" src={vegetables}/></div>
                                <p>10</p>
                            </div>
                            <div className="crop_vegetables_box">
                                <FontAwesomeIcon icon={faArrowsAltH} />
                            </div>  
                            <div className="crop_vegetables_box">
                                <div className="crop_vegetables"><img className="vegetable cabbage" src={vegetables}/></div>
                                <p>1</p>
                            </div>
                        </div>
                        
                        <Button onClick={settings_save} className="settings_save">Save</Button>							
                    </Form>
                </Modal.Body>				
            </Modal>
        </>	
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Panel)