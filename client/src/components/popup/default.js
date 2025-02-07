function Default(props){
    const { text, html } = props
    return <>
        {text ? <>
            {html ? <div 
                    className="popup_body"
                    dangerouslySetInnerHTML={{ __html: text }}
                ></div> : <div className="popup_body">{text}</div>}
        </> : null}
    </>
}
export default Default