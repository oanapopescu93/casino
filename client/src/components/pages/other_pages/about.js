import React from 'react';
// import $ from 'jquery'; 
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import under_construction_icon from '../../img/icons/under_construction_icon.png'
import {game_visible} from '../../actions/actions'

var dispatch;

function handleBack() {
    dispatch(game_visible("game"))
}

function About(props){
    var lang = props.lang;
    dispatch = props.dispatch;

	return (
        <Row>
            <Col sm={12}>
                <h2>{lang === "ro" ? <span>Despre noi</span> : <span>About us</span>}</h2>
                <img className="under_construction_icon" alt="under construction" src={under_construction_icon} />
            </Col>
            <Col sm={12}>
                <Button className="button_table shadow_convex" type="button" onClick={handleBack}>
                    {lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
                </Button>
            </Col>
        </Row>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(About)