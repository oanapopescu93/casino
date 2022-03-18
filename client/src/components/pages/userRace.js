import React from 'react';
import { useDispatch } from 'react-redux'
import $ from 'jquery'; 
import Panel from './panel_control';
import Race from './games/race';

function UserRace(props){
	let user = props.user;
    let user_id = props.user_id;
    let socket = props.socket;
    let lang = props.lang;
    let money = props.money;
    let user_table = props.user_table;
    let race = props.race;
    const dispatch = useDispatch();
  
	var payload = {
        id: user_id, 
        user: user, 
        user_table: user_table, 
        time: new Date().getTime(), 
        lang: lang
    }
    socket.emit('username', payload);
    socket.on('is_online', function(data) {
        if(typeof $('#chatmessages') !== "undefined"){
            $('#chatmessages').append(data);
        }
    }); 
    
    return(
        <>
            <Race open_race={race} lang={lang} socket={socket} user={user} dispatch={dispatch}></Race>
            <Panel lang={lang} user_id={user_id} user={user} money={money} user_table={user_table} socket={socket}></Panel>
        </>
    );
}

export default UserRace;