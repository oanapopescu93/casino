import React from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { changeDate } from '../../reducers/settings'

function Date(props) {
    let title = props.title
	let dispatch = useDispatch()
    let date_format_array = ["d.m.Y H:i", "d-m-Y H:i", "m/d/Y H:i", "d-m-Y h:i A", "m/d/Y h:i A"]

    function handleSelect(choice){
        dispatch(changeDate(choice))
    }

    return <div className="date">
        <DropdownButton title={title} id="date_button"  className="shadow_convex" onSelect={handleSelect}>
            {date_format_array.map((item, i)=>{
                return <Dropdown.Item key={i} eventKey={item}><span>{item}</span></Dropdown.Item>
            })}
        </DropdownButton>
    </div>
}

export default Date