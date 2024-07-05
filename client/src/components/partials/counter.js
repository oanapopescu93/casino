import React, {useState} from 'react'

function Counter(props){  
  let [num, setNum]= useState(typeof props.num === "undefined" ? 1 : props.num)
  let min = props.min ? props.min : 0
  let max = props.max ? props.max : 100

  function increase(){
    if(num < max){
      setNum(Number(num) + 1)
      if(typeof props.update === "function"){
          props.update(Number(num) + 1)
      }
    }
  }
  function decrease(){
    if(num > min){
        setNum(Number(num) - 1)
        if(typeof props.update === "function"){
            props.update(Number(num) - 1)
        }
    }
  }

  function handleChange(e){
    setNum(e.target.value)
    if(typeof props.update === "function"){
        props.update(e.target.value)
    }
  }

  return <div className="counter">
    <div className="counter_minus_box">
        <div className="counter_minus shadow_convex" onClick={()=>decrease()}>-</div>
    </div>
    <div className="counter_input_box">
        <input className="input_light counter_input shadow_convex" type="text" value={num} onChange={(e)=>{handleChange(e)}}/>
    </div>
    <div className="counter_plus_box">
        <div className="counter_plus shadow_convex" onClick={()=>increase()}>+</div>
    </div>
  </div>
}
export default Counter