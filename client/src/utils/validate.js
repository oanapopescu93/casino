export const validateInput = function(input="", type){
    let regex = ''
    switch(type){
      case "email":
        regex = '^[a-zA-Z0-9]+[@]+[a-zA-Z0-9]+[.]+[a-zA-Z]{2,4}$'
        //letters+numbers+"."+"_" + @ + letters+numbers+"."+"_" + letters(2-4 characters)
        break
      case "pass":				
				regex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
				// At least one upper case English letter, (?=.*?[A-Z])
				// At least one lower case English letter, (?=.*?[a-z])
				// At least one digit, (?=.*?[0-9])
				// At least one special character, (?=.*?[#?!@$%^&*-])
				// Minimum eight in length .{8,}
				break
      case "bitcoin_address":
        regex = '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$'
        // an identifier of 26-35 alphanumeric characters
        // beginning with the number 1 or 3
        // random digits
        // uppercase
        // lowercase letters
        // with the exception that the uppercase letter O, uppercase letter I, lowercase letter l, and the number 0 are never used to prevent visual ambiguity.
        break
      default:
        regex = ''
        break
    }		
    let regex_exp = new RegExp(regex)			
    let pass_result = regex_exp.test(input)
    // pass_result = true //to make any input valid
    return pass_result
}
  
export const validateCard = function(val) {
    // remove all non digit characters
    let value = val.replace(/\D/g, '')
    let sum = 0
    let shouldDouble = false
    // loop through values starting at the rightmost side
    for (let i = value.length - 1; i >= 0; i--) {
        let digit = parseInt(value.charAt(i))
  
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9
      }
  
      sum += digit
      shouldDouble = !shouldDouble
    }
    
    let valid = (sum % 10) === 0
    let accepted = false
    
    // loop through the keys (visa, mastercard, amex, etc.)
    Object.keys(acceptedCreditCards).forEach(function(key) {
        let regex = acceptedCreditCards[key]
      if (regex.test(value)) {
        accepted = true
      }
    })
    
    return valid && accepted
}
  
export const validateCVV = function(my_card, my_cvv){
    // remove all non digit characters
    let creditCard = my_card.replace(/\D/g, '')
    let cvv = my_cvv.replace(/\D/g, '')
    // american express and cvv is 4 digits
    if ((acceptedCreditCards.amex).test(creditCard)) {
      if((/^\d{4}$/).test(cvv))
        return true
    } else if ((/^\d{3}$/).test(cvv)) { // other card & cvv is 3 digits
      return true
    }
    return false
}
  
var acceptedCreditCards = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
    diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
}

export const validateCardMonthYear = function(exYear, exMonth) {
  let today = new Date()
  let someday = new Date()
  someday.setFullYear(exYear, exMonth, 1)
  if(someday.getTime() < today.getTime()){
    return false
  }
  return true
}