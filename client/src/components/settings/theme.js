import React from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { changeTheme } from '../../reducers/settings'
import { translate } from '../../translations/translate'
import { handleChangeTheme } from '../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

function Theme(props) {
  const {settings, title} = props
  const {lang} = settings

	let dispatch = useDispatch()
  let theme_array = [
    {text: "forest_green", color: "green"},
    {text: "saphire_purple", color: "purple"},
    {text: "radium_black", color: "black"},
    {text: "copper_night", color: "blue"},
  ]
  let myTitle = theme_array.find((x)=>{
    return x.color === title
  })

  function handleSelect(choice){
    dispatch(changeTheme(choice))
    handleChangeTheme(choice)
  }

  return <div className="theme">
    <DropdownButton title={translate({lang, info: myTitle.text})} id="theme_button"  className="shadow_convex" onSelect={handleSelect}>
      {theme_array.map((item, i)=>{
          return <Dropdown.Item key={i} eventKey={item.color}>
            <div className={"theme_box " + item.color}>
              <div className="theme_text">                
                <span>{translate({lang, info: item.text})}</span>
                {item.color === title ? <>&nbsp;<FontAwesomeIcon icon={faCircleCheck} /></> : null}
              </div>
            </div>
          </Dropdown.Item>
      })}
    </DropdownButton>
  </div>
}

export default Theme