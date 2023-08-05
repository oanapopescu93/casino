function Default(props){     
    return <>
        {props.text ? <div className="popup_body">{props.text}</div> : null}
    </>
}
export default Default