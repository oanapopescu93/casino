import React from 'react';
function ShowResults(props){
    let lang = props.lang;
	return (
		<div className="show_results_container">
            <div className="show_results">
                <i className="fa fa-times show_results_close" ></i>
                <h1 className="header">{lang === "ro" ? <span>Alerta</span> : <span>Alert</span>}</h1>
                <div className="message"></div>
            </div>
        </div>
	);
}
export default ShowResults