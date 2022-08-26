import React from 'react';
import { useSelector} from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';

import Game from '../games/game';
import Keno from '../games/keno';
import Race from '../games/race';

import Sapou from '../partials/sapou';
import UserAccount from '../account/userAccount';
import Panel from '../panel/panel_control';
import About from '../other_pages/about';
import Support from '../other_pages/support';
import Terms from '../other_pages/terms';
import Privacy from '../other_pages/privacy';
import Questions from '../other_pages/questions';
import Career from '../other_pages/career_empty';

function UserChoice(props) {
	let visible = useSelector(state => state.visibility);
    let socket = props.socket;
	let lang = props.lang;
	let data = props.data;	
	data.lang = props.lang;
	data.socket = props.socket;
    let choice = props.choice;
	return (
		<div className="userPage"> 
			<Row>
				<Col sm={12}>	
					{(() => {
                        switch (visible) {
                            case "game":
                                return (
                                    <>
                                        {(() => {
                                            switch (choice) {
                                                case "game":
                                                    return (
                                                        <>
                                                            <Game lang={lang} info={data} socket={socket}></Game>
										                    <Panel lang={lang} info={data} socket={socket}></Panel>
                                                        </>
                                                    )
                                                case "race":
                                                    return (
                                                        <>
                                                            <Race info={data}></Race>
										                    <Panel lang={lang} info={data} socket={socket}></Panel>
                                                        </>
                                                    )
                                                case "keno":
                                                    return (
                                                        <>
                                                            <Keno info={props}></Keno>
                                                            <Panel lang={lang} info={data} socket={socket}></Panel>
                                                        </>
                                                    )
                                                default:
                                                    return(
                                                        <>
                                                            <Game lang={lang} info={data} socket={socket}></Game>
										                    <Panel lang={lang} info={data} socket={socket}></Panel>
                                                        </>
                                                    )						
                                            }
                                        })()}
                                    </>
                                )
                            case "about":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <About info={props}></About>
                                    </>
                                )	
                            case "account":
                                return (
                                    <>
                                        <UserAccount info={data}></UserAccount> 
                                        <Panel info={data}></Panel>
                                    </>												
                                )
                            case "about":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <About info={data}></About>
                                    </>
                                )	
                            case "support":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <Support info={data}></Support>
                                    </>
                                )
                            case "terms":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <Terms info={data}></Terms>
                                    </>
                                )
                            case "privacy":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <Privacy info={data}></Privacy>
                                    </>
                                )
                            case "questions":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
                                        <Questions info={data}></Questions>
                                    </>
                                )
                            case "career":
                                return (
                                    <>
                                        <Sapou lang={props.lang} page={visible}></Sapou>
										<Career info={data}></Career>
                                    </>
                                )
                            default:
                                return(
                                    <>
                                        <Game lang={lang} info={data} socket={socket}></Game>
                                        <Panel lang={lang} info={data} socket={socket}></Panel>
                                    </>
                                )						
                        }
					})()}			
				</Col>
			</Row>
		</div>
	);
}

export default UserChoice;