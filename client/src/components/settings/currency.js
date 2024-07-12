import React from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { changeCurrency } from '../../reducers/settings'

function Currency(props) {
  const {title, home} = props
  let currencies = home.finances.currencies ? home.finances.currencies : []
	let dispatch = useDispatch()  

  function handleSelect(choice){
		dispatch(changeCurrency(choice))
  }

  return <div className="currency">
    <DropdownButton title={title} id="currency_button"  className="shadow_convex" onSelect={handleSelect}>
      {currencies.map((item, i)=>{
        return <Dropdown.Item key={i} eventKey={item}><span>{item}</span></Dropdown.Item>
      })}
    </DropdownButton>
  </div>
}

export default Currency