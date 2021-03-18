import React, { useState } from 'react';
import { ReactComponent as Bitcoin } from '../../img/icons/bitcoin-love-heart.svg';
import qr_code from '../../img/icons/qr_code.png';

import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Donate(){
    const [show, setShow] = useState(false);

	function handleClose(){ setShow(false) };
    function handleShow(){ setShow(true) };

    function click_donate(){
        handleShow();
    }

	return (
        <>
            <div style={{'display': 'none'}} id="donate" className="text-center" onClick={click_donate}>
                <Bitcoin></Bitcoin>
            </div>
            <Modal className="casino_modal" id="donate_modal" show={show} onHide={handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Donation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img id="qr_code" src={qr_code}/>
                    <p><b>Bitcoin Address: </b>bc1q4jkjwh0qh84qrlam5uncl3hfhgkka0uhrncc7w</p>
                </Modal.Body>
                <Modal.Footer>
                    <p>Please play and donate if you liked our games.</p>
                </Modal.Footer>				
            </Modal>
        </>
	);
}

export default Donate;