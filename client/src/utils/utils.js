export const isEmpty = (element)=>{
  let empty = true
  if(typeof element !== "undefined" && element !== 'null' && element !== null && element !== '' && element !== 'N/A'){
    empty = false
  }
  return empty
}

export const formatDate = (date, format = 'd.m.Y H:i')=>{	//d.m.Y H:i, d-m-Y H:i, m/d/Y H:i, d-m-Y h:i A, m/d/Y h:i A
  let d = new Date(date)
  const pad = (num) => (num < 10 ? '0' : '') + num // Helper function to pad numbers with leading zeros

  const yyyy = d.getFullYear()
  const MM = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const HH24 = pad(d.getHours())
  const hh12 = pad((d.getHours() % 12) || 12) // Convert to 12-hour format
  const mm = pad(d.getMinutes())
  const ss = pad(d.getSeconds())
  const ampm = d.getHours() < 12 ? 'AM' : 'PM'

  let formattedDate = format
    .replace('d', dd)
    .replace('m', MM)
    .replace('Y', yyyy)
    .replace('H', HH24)
    .replace('i', mm)
    .replace('s', ss)
    .replace('h', hh12)
    .replace('A', ampm)

  return formattedDate
}

export const roundNumber = (number, precision = 1000)=>{
  var result = Math.round(number / precision) *  precision
  return result
}

export const setCookie = (cname, cvalue, hours=12)=>{
  let d = new Date()
  d.setTime(d.getTime() + (hours * 60 * 60 * 1000))
  let expires = "expires=" + d.toGMTString()
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}
export const getCookie = (cname)=>{
  let name = cname + "="
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ""
}

export const sortList = (arrayForSort=[], sort_by="", asc=true)=>{
  let list = [...arrayForSort]
  if(list && list.length>0){
    if(sort_by === ""){
      let done = false
      if(asc){
        while (!done) {
          done = true
          for (let i = 1; i < list.length; i += 1) {
              if (list[i - 1] > list[i]){
                  done = false
                  let tmp = list[i - 1]
                  list[i - 1] = list[i]
                  list[i] = tmp
              }
          }
        }
      } else {
        while (!done) {
          done = true
          for (let i = 1; i < list.length; i += 1) {
              if (list[i - 1] < list[i]){
                  done = false
                  let tmp = list[i - 1]
                  list[i - 1] = list[i]
                  list[i] = tmp
              }
          }
        }
      }
    } else {
      let done = false
      if(asc){
        while (!done) {
          done = true
          for (let i = 1; i < list.length; i += 1) {
              if (list[i - 1][sort_by] > list[i][sort_by]){
                  done = false
                  let tmp = list[i - 1]
                  list[i - 1] = list[i]
                  list[i] = tmp
              }
          }
        }
      } else {
        while (!done) {
          done = true
          for (let i = 1; i < list.length; i += 1) {
              if (list[i - 1][sort_by] < list[i][sort_by]){
                  done = false
                  let tmp = list[i - 1]
                  list[i - 1] = list[i]
                  list[i] = tmp
              }
          }
        }
      }
    }
  }
  return list
}

export const getWindowDimensions = ()=>{
  const { innerWidth: width, innerHeight: height } = window
  return {width, height}
}

export const capitalizeFirstLetter = (string)=>{
  if(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  return string
}

export const randomIntFromInterval = (min, max)=>{ // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const postData = async (url = "", data = {})=>{
  try {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    })
    if (!response.ok) {
      console.error('response:', response)
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  } 
}

export const getData = async (url = "")=>{
  try {
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    })
    if (!response.ok) {
      console.error('response:', response)
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  } 
}

export const checkoutData = ()=>{	
  const monthOptions = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
  let date = new Date().getFullYear()-1
  const yearOptions = Array.from({length: 10}, (_, i) => i + date)
  return {monthOptions, yearOptions}
}

export const paymentErrors = ()=>{	
  return {
    name: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_name" },
    email: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_email" },
    phone: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_phone" },
    country: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_country" },
    city: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_city" },
    cardNumber: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_cardNumber" },
    month: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_month" },
    year: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_year" },
    cvv: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_cvv" },
    bitcoinAddress: { fill: true, validate: true, fill_message: "fill_field", validate_message: "validate_message_bitcoinAddress" }
  }
}

export const getProducts = (cart, market)=>{
  let array = []
  for(let i in cart){
      let index = market.findIndex((x) => x.id === cart[i].id)
      if(index !== -1){
          let elem = {...market[index], qty: cart[i].qty, cardId: cart[i].cartId}
          array.push(elem)
      }
  }
  return array
}

export const convertCurrency = (value=0, currency="USD", exchangeRates=null, shorten=true)=>{  
  if (value <= 0) {
    console.error("convertCurrency-value-error--> ", value)
    return value
  }
  if(!exchangeRates){
    console.error("convertCurrency-exchangeRates-error--> ", exchangeRates)
    return value
  }
  const rate = exchangeRates[currency]
  if(!rate){
    console.error("convertCurrency-rate-error--> ", rate)
    return value
  }
  let result = parseInt(value) * rate
  if (shorten) {
      result = parseFloat(result.toFixed(2))
  }
  return result
}

export const showCardNumber = (value)=>{
  let result = ""
  if(!value){
    return result
  }
  const lastFourDigits = value.slice(-4)
  result = "***" + lastFourDigits
  return result
}