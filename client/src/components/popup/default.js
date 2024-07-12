function Default(props){
    const {text} = props   
    return <>
        {text ? <div className="popup_body">{text}</div> : null}
    </>
}
export default Default