import React from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { changeCurrency } from '../../reducers/settings';

function Currency(props) {
  const {title, currencies, lang} = props  
	let dispatch = useDispatch()

  let item_name_lang = "name_eng"
  switch (lang) {
    case "DE":
      item_name_lang = "name_de"
      break
    case "ES":
      item_name_lang = "name_es"
      break
    case "FR":
      item_name_lang = "name_fr"
      break
    case "IT":
      item_name_lang = "name_it"
      break
    case "PT":
      item_name_lang = "name_pt"
      break
    case "RO":
      item_name_lang = "name_ro"
      break
    case "RU":
      item_name_lang = "name_ru"
      break
    case "ENG":
    default:
      item_name_lang = "name_eng"
      break
}

  function handleSelect(choice){
		dispatch(changeCurrency(choice))
  }

  return <div className="currency">
    <DropdownButton title={title} id="currency_button"  className="shadow_convex" onSelect={handleSelect}>
      {currencies.map(function(item, i){
        return <Dropdown.Item key={i} eventKey={item.id}><span>{item[item_name_lang]}</span></Dropdown.Item>
      })}
    </DropdownButton>
  </div>
}

export default Currency