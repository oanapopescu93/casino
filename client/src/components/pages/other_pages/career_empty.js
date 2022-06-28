import React from 'react';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {game_visible} from '../../actions/actions'
import Button from 'react-bootstrap/Button'

function Career(props){
    let lang = props.lang;
    let dispatch = props.dispatch;

    function handleBack() {
        if(dispatch){
            dispatch(game_visible("game"))
        }
    }

	return (
        <>
            <Row>
                <Col sm={12}>
                    <h2>{lang === "ro" ? <span>Cariera</span> : <span>Career</span>}</h2>
                    <p>{lang === "ro" ? <span>Nu avem joburi disponibile</span> : <span>No jobs available</span>}</p>
                </Col>
            </Row>
            <Col sm={12}>
                <Button className="button_table shadow_convex" type="button" onClick={()=>handleBack()}>
                    {lang === "ro" ? <span>Inapoi</span> : <span>Back</span>}
                </Button>
            </Col>
        </>
	);
}

function mapStateToProps(state) {	
	return { ...state }
}

export default connect(mapStateToProps)(Career)