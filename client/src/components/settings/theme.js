import React from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { changeTheme } from '../../reducers/settings'
import { translate } from '../../translations/translate'

function Theme(props) {
  const {lang, title} = props
	let dispatch = useDispatch()
  let theme_array = [
    {text: "green", color: "green"},
    {text: "purple", color: "purple"},
    {text: "black", color: "black"},
  ]

  function handleSelect(choice){
    dispatch(changeTheme(choice))
  }

  return <div className="theme">
    <DropdownButton title={translate({lang: lang, info: title})} id="theme_button"  className="shadow_convex" onSelect={handleSelect}>
      {theme_array.map((item, i)=>{
          return <Dropdown.Item key={i} eventKey={item.text}>
            <div className="theme_box">
              <div className={"theme_color " + item.color}></div>
              <div className="theme_text">{translate({lang: lang, info: item.text})}</div>
            </div>
          </Dropdown.Item>
      })}
    </DropdownButton>
  </div>
}

export default Theme