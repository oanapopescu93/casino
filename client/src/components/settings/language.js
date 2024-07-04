import React from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { changeLanguage } from '../../reducers/settings'

function Language(props) {  
	let dispatch = useDispatch()  
  let language_array = [
    {id: "ENG", text: "English", icon: ""},
    {id: "ES", text: "Español", icon: ""},
    {id: "DE", text: "Deutsch", icon: ""},
    {id: "FR", text: "Français", icon: ""},
    {id: "IT", text: "Italiano", icon: ""},
    {id: "RU", text: "Русский", icon: ""},
    {id: "PT", text: "Português", icon: ""},
    {id: "RO", text: "Română", icon: ""},
    {id: "ZH", text: "中文", icon: ""},
  ]
  let chosen_language = language_array.filter((x)=>{
    return x.id === props.title
  })
  let title = "English"
  if(chosen_language && chosen_language[0]){
    title = chosen_language[0].text
  }

  function handleSelect(choice){
		dispatch(changeLanguage(choice))
  }

  return <div className="language">
    <DropdownButton title={title} id="language_button"  className="shadow_convex" onSelect={handleSelect}>
      {language_array.map((item, i)=>{
          return <Dropdown.Item key={i} eventKey={item.id}>
            <span>{item.text}</span>
          </Dropdown.Item>
      })}
    </DropdownButton>
  </div>
}

export default Language