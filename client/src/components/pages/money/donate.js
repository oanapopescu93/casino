import React, { useState } from 'react';
import $ from 'jquery'; 
import { ReactComponent as Bitcoin } from '../../img/icons/bitcoin-love-heart.svg';
import Modal from 'react-bootstrap/Modal'

var bitcoin = {};
function Donate(props){
    const [show, setShow] = useState(false);

	function handleClose(){ setShow(false) };
    function handleShow(){ setShow(true) };

    function click_donate(){
        if(typeof bitcoin !== "undefined" && bitcoin !== "" && bitcoin != null && bitcoin !== "null" && JSON.stringify(bitcoin) !== JSON.stringify({})){
            handleShow();
        } 
    }

    var socket = props.socket;    

    function get_wallet(){
        return new Promise(function(resolve, reject){
            socket.emit('donate_send', "");	
            socket.on('donate_read', function(data){
                resolve(data)
            });	
        });
    }
    
    get_wallet().then(function(data) {
        bitcoin = data;
        $('#donate').addClass("open");
    });

	return (
        <>
            <div id="donate" className="text-center" onClick={click_donate}>
                <Bitcoin></Bitcoin>
            </div>
            
            <Modal className="casino_modal" id="donate_modal" show={show} onHide={handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Donation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <a href="https://bitcoin.org" rel="nofollow" target="_NEW">BitCoin: </a>
                        <a rel="nofollow" href={bitcoin.link}><b>{bitcoin.text}</b></a>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <p>Please play and donate if you liked our games.</p>
                </Modal.Footer>				
            </Modal>
        </>
	);
}

export default Donate;