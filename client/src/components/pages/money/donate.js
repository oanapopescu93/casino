import React, { useState } from 'react';
import $ from 'jquery'; 
import { ReactComponent as Bitcoin } from '../../img/icons/bitcoin-love-heart.svg';
import Modal from 'react-bootstrap/Modal'

var crypto = [];
function Donate(props){
    const [show, setShow] = useState(false);

	function handleClose(){ setShow(false) };
    function handleShow(){ setShow(true) };

    function click_donate(){
        if(typeof crypto !== "undefined" && crypto !== "" && crypto != null && crypto !== "null" && crypto.length>0){
            handleShow();
        } 
    }

    var socket = props.socket; 
    var lang = props.lang;   

    function get_wallet(){
        return new Promise(function(resolve, reject){
            socket.emit('donate_send', "");	
            socket.on('donate_read', function(data){
                resolve(data)
            });	
        });
    }
    
    get_wallet().then(function(data) {
        crypto = data;
        $('#donate').addClass("open");
    });

	return (
        <>
            <div id="donate" className="text-center" onClick={click_donate}>
                <Bitcoin></Bitcoin>
            </div>
            
            <Modal className="casino_modal" id="donate_modal" show={show} onHide={handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>{lang === "ro" ? <span>Suport</span> : <span>Support</span>}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {																					
						crypto.map(function(item, i){
                            return(
                                <p key={i}><span>{item.type}: </span><a rel="nofollow" href={item.link}><b>{item.text}</b></a></p>
                            )
                        })
                    }
                </Modal.Body>
                <Modal.Footer>
                    {lang === "ro" ? null : <p>Feel free to support us if you like our app.</p>}                    
                </Modal.Footer>				
            </Modal>
        </>
	);
}

export default Donate;