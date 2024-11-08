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
  const {lang, title} = props
	let dispatch = useDispatch()
  let theme_array = [
    {text: "green", color: "green"},
    {text: "purple", color: "purple"},
    {text: "black", color: "black"},
  ]

  function handleSelect(choice){
    dispatch(changeTheme(choice))
    handleChangeTheme(choice)
  }

  return <div className="theme">
    <DropdownButton title={translate({lang: lang, info: title})} id="theme_button"  className="shadow_convex" onSelect={handleSelect}>
      {theme_array.map((item, i)=>{
          return <Dropdown.Item key={i} eventKey={item.text}>
            <div className={"theme_box " + item.color}>
              <div className="theme_text">                
                <span>{translate({lang: lang, info: item.text})}</span>
                {item.text === title ? <>&nbsp;<FontAwesomeIcon icon={faCircleCheck} /></> : null}
              </div>
            </div>
          </Dropdown.Item>
      })}
    </DropdownButton>
  </div>
}

export default Theme