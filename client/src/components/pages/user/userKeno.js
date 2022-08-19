import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux'
import keno_loading_icon from '../../img/icons_other/icons/yellow/keno.png'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Keno from '../games/keno'
import UserAccount from '../account/userAccount';
import Sapou from '../partials/sapou';
// import Panel from '../panel_control';

import About from '../other_pages/about';
import Support from '../other_pages/support';
import Terms from '../other_pages/terms';
import Privacy from '../other_pages/privacy';
import Questions from '../other_pages/questions';
import Career from '../other_pages/career_empty';

function Child(props) {
	let visible = useSelector(state => state.visibility);
	let socket = props.socket;
	let lang = props.lang;
	let data = props.data;
    let dispatch = useDispatch();
	return (
		<div className="userKeno"> 
			<Row>
				<Col sm={12}>	
					{(() => {
                        switch (visible) {
                            case "game":
                                return (
                                    <>
                                        <Keno lang={lang} socket={socket} info={data} dispatch={dispatch}></Keno>
                                        {/* <Panel lang={lang} info={data} socket={socket}></Panel> */}
                                    </>
                                )
                            case "about":
                                return (
                                    <>
                                        <Sapou lang={lang} page={visible}></Sapou>
                                        <About lang={lang} socket={socket}></About>
                                    </>
                                )	
                            case "account":
                                return (
                                    <>
                                        <UserAccount lang={lang} info={data} socket={socket}></UserAccount> 
                                        {/* <Panel lang={lang} info={data} socket={socket}></Panel> */}
                                    </>												
                                )	
                            case "support":
                                return (
                                    <>
                                        <Sapou lang={lang} page={visible}></Sapou>
                                        <Support lang={lang} info={data} socket={socket}></Support> 
                                        {/* <Panel lang={lang} info={data} socket={socket}></Panel> */}
                                    </>
                                )
                                case "terms":
                                    return (
                                        <>
                                            <Sapou lang={lang} page={visible}></Sapou>
                                            <Terms lang={lang} socket={socket}></Terms>
                                        </>
                                    )
                                case "privacy":
                                    return (
                                        <>
                                            <Sapou lang={lang} page={visible}></Sapou>
                                            <Privacy lang={lang} socket={socket}></Privacy>
                                        </>
                                    )
                                case "questions":
                                    return (
                                        <>
                                            <Sapou lang={lang} page={visible}></Sapou>
                                            <Questions lang={lang} socket={socket} dispatch={dispatch}></Questions>
                                        </>
                                    )
                                case "career":
                                    return (
                                        <>
                                            <Sapou lang={lang} page={visible}></Sapou>
                                            <Career lang={lang} socket={socket}></Career>
                                        </>
                                    )
                            default:
                                return(
                                    <>
                                        <Keno lang={lang} socket={socket} info={data} dispatch={dispatch}></Keno>
                                        {/* <Panel lang={lang} info={data} socket={socket}></Panel> */}
                                    </>
                                )						
                        }
					})()}			
				</Col>
			</Row>
		</div>
	);
}

function UserKeno(props){
	let socket = props.socket;
	let lang = props.lang;
	const [data, setData] = useState(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setTimeout(function(){
			setLoaded(true);
		}, 2000);
	}, []); 

	return loaded ? <Child data={data} lang={lang} socket={socket}></Child> : 
			<div>
				<img className="loading_icon" alt="loading_icon" src={keno_loading_icon} />
				<p className="color_yellow">Loading</p>
			</div>
}

export default UserKeno;