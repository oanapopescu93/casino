import React, { useState, useEffect } from 'react'

function Counter(props){  
  const {num, update} = props
  let [number, setNumber]= useState(typeof num === "undefined" ? 1 : num)
  let min = props.min ? props.min : 1
  let max = props.max ? props.max : 100

  useEffect(() => {
    setNumber(typeof num === "undefined" ? 1 : props.num)
  }, [num])

  function increase(){
    if(number < max){
      setNumber(Number(number) + 1)
      update(Number(number) + 1)
    }
  }
  function decrease(){
    if(number > min){
      setNumber(Number(number) - 1)
      update(Number(number) - 1)
    }
  }

  function handleChange(e){
    setNumber(e.target.value)
    update(e.target.value)
  }

  return <div className="counter">
    <div className="counter_minus_box">
        <div className="counter_minus shadow_convex" onClick={()=>decrease()}>-</div>
    </div>
    <div className="counter_input_box">
        <input className="input_light counter_input shadow_convex" type="text" value={number} onChange={(e)=>{handleChange(e)}}/>
    </div>
    <div className="counter_plus_box">
        <div className="counter_plus shadow_convex" onClick={()=>increase()}>+</div>
    </div>
  </div>
}
export default Counter