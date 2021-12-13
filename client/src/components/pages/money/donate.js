import React from 'react';
import $ from 'jquery';
import { ReactComponent as Bitcoin } from '../../img/icons/bitcoin-love-heart.svg';
function Donate(props){
    var donations = props.info;
    var socket = props.socket; 
    setTimeout(function(){
        $('#donate').addClass("open");
    }, 500); 

    function click_donate(){        
        if(typeof donations !== "undefined" && donations !== "" && donations != null && donations !== "null" && donations.length>0){
            props.my_donation(donations);
        } 
    }    

    function get_wallet(){
        return new Promise(function(resolve, reject){
            if(donations === "null" || donations === null || typeof donations === "undefined" || donations === "" ){
                socket.emit('donate_send', "");	
                socket.on('donate_read', function(data){
                    resolve(data)
                });	
            } else {
                resolve(donations)
            }            
        });
    }    
    get_wallet().then(function(data) {
        donations = data;
    });  

	return (
        <>
            <div id="donate" className="text-center" onClick={click_donate}>
                <Bitcoin></Bitcoin>
            </div>
        </>
	);
}
export default Donate;