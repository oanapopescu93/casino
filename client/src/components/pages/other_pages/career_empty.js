import React from 'react';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {game_visible} from '../../actions/actions'
import Button from 'react-bootstrap/Button'

function handleBack(dispatch) {
    dispatch(game_visible("game"))
}

function Career(props){
    let dispatch = props.dispatch;
	return (
        <>
            <Row>
                <Col sm={12}>
                    <h2>{props.lang === "ro" ? <span>Cariera</span> : <span>Career</span>}</h2>
                    <p>{props.lang === "ro" ? <span>Nu avem joburi disponibile</span> : <span>No jobs available</span>}</p>
                </Col>
            </Row>
            <Col sm={12}>
                <Button className="button_table shadow_convex" type="button" onClick={()=>handleBack(dispatch)}>
                    {props.lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
                </Button>
            </Col>
        </>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Career)