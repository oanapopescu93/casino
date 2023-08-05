import React from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { changeDate } from '../../reducers/settings';

function Date(props) {
    let title = props.title
	let dispatch = useDispatch()

    function handleSelect(choice){
        dispatch(changeDate(choice))
    }

    return <div className="date">
        <DropdownButton title={title} id="date_button"  className="shadow_convex" onSelect={handleSelect}>
            <Dropdown.Item eventKey={"d.m.Y H:i"}><span>d.m.Y H:i</span></Dropdown.Item>
            <Dropdown.Item eventKey={"d-m-Y H:i"}><span>d-m-Y H:i</span></Dropdown.Item>
            <Dropdown.Item eventKey={"m/d/Y H:i"}><span>m/d/Y H:i</span></Dropdown.Item>
            <Dropdown.Item eventKey={"d-m-Y h:i A"}><span>d-m-Y h:i A</span></Dropdown.Item>
            <Dropdown.Item eventKey={"m/d/Y h:i A"}><span>m/d/Y h:i A</span></Dropdown.Item>
        </DropdownButton>
    </div>
}

export default Date