export const checkWinterMonths = function(){
    let winter = false
    const d = new Date()
    if(d.getMonth() === 0 || d.getMonth() === 1 || d.getMonth() === 11){
        winter = true
    }
    return winter
}

export const checkEaster = function(){
    let easter = false
    const d = new Date()
  
    let date_from = Easter(d.getFullYear()) // 3 days before the catholic easter
    date_from.setDate(date_from.getDate() - 3)
  
    let date_to = Easter(d.getFullYear())
    date_to.setDate(date_to.getDate() + 10) //3 days to get to ortodox easter and one more week
  
    if(d >= date_from && d <= date_to){
      easter = true
    }
  
    return easter
}
  
function Easter(Y) {
    var C = Math.floor(Y/100)
    var N = Y - 19*Math.floor(Y/19)
    var K = Math.floor((C - 17)/25)
    var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15
    I = I - 30*Math.floor((I/30))
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11))
    var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4)
    J = J - 7*Math.floor(J/7)
    var L = I - J
    var M = 3 + Math.floor((L + 40)/44)
    var D = L + 28 - 31*Math.floor(M/4)
  
    let d = new Date()
    d.setDate(D)
    d.setMonth(M-1)
    return d
}

export const checkOccasion = function(type){
    let occasion = false
    let d = new Date()
    let day = -1
    let month = -1
    let interval = [0, 0]

    switch(type){
        case "halloween":
            day = 31
            month = 9
            interval = [7, 0] //only one week before halloween, after it passes, it will disappear
            break
        case "christmas":
            day = 25
            month = 11
            interval = [7, 7] //one week before and after christmas
            break
        default:
    }

    if(day !== -1 && month !== -1){
        let date_from = new Date()
        date_from.setDate(day)
        date_from.setMonth(month)
        date_from.setDate(date_from.getDate() - interval[0])
    
        let date_to = new Date()
        date_to.setDate(day)
        date_to.setMonth(month)
        date_to.setDate(date_to.getDate() + interval[1])
    
        if(d >= date_from && d <= date_to){
            occasion = true
        }
    }    
  
    return occasion
}