import React from 'react'

function Spinner(props){
    const { size = 'medium', color = '#000', text } = props

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'spinner-small'
            case 'large':
                return 'spinner-large'
            case 'medium':
            default:
                return 'spinner-medium'
        }
    }

    return <div className="spinner-container" style={{ color: color }}>
        <div className={`spinner ${getSizeClass()}`}>
            <div className="bounce1" style={{ backgroundColor: color }}></div>
            <div className="bounce2" style={{ backgroundColor: color }}></div>
            <div className="bounce3" style={{ backgroundColor: color }}></div>
        </div>
        {text && <p className="spinner-text">{text}</p>}
    </div>
}

export default Spinner