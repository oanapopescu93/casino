import React from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { changeLanguage } from '../../reducers/settings';

function Language(props) {
  let title = props.title
	let dispatch = useDispatch()
  let language_array = ["ENG", "ES", "DE", "FR", "IT", "RO"]

  function handleSelect(choice){
		dispatch(changeLanguage(choice))
  }

  return <div className="language">
    <DropdownButton title={title} id="language_button"  className="shadow_convex" onSelect={handleSelect}>
      {language_array.map(function(item, i){
          return <Dropdown.Item key={i} eventKey={item}><span>{item}</span></Dropdown.Item>
      })}
    </DropdownButton>
  </div>
}

export default Language