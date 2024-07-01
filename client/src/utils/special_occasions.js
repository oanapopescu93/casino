export const checkWinterMonths = ()=>{
    let winter = false
    let today = new Date()
    if(today.getMonth() === 0 || today.getMonth() === 1 || today.getMonth() === 11){ // january, february or december
        winter = true
    }
    return winter
}

export const checkEaster = ()=>{
    let easter = false
    let today = new Date()
    let currentYear = today.getFullYear()

    let catholicEasterDate = Easter(currentYear, "catholic")
    let orthodoxEasterDate = Easter(currentYear, "orthodox")

    // Calculate 3 days before Catholic Easter
    let threeDaysBeforeCatholicEaster = new Date(catholicEasterDate)
    threeDaysBeforeCatholicEaster.setDate(catholicEasterDate.getDate() - 3)

    // Calculate 3 days after Orthodox Easter
    let threeDaysAfterOrthodoxEaster = new Date(orthodoxEasterDate)
    threeDaysAfterOrthodoxEaster.setDate(orthodoxEasterDate.getDate() + 3)

    if(today >= threeDaysBeforeCatholicEaster && today <= threeDaysAfterOrthodoxEaster){
      easter = true
    }

    return easter
}

function Easter(year, type="catholic") {
    if(type === "catholic"){
        // Gauss algorithm to calculate the date of Easter
        let a = year % 19
        let b = Math.floor(year / 100)
        let c = year % 100
        let d = Math.floor(b / 4)
        let e = b % 4
        let f = Math.floor((b + 8) / 25)
        let g = Math.floor((b - f + 1) / 3)
        let h = (19 * a + b - d - g + 15) % 30
        let i = Math.floor(c / 4)
        let k = c % 4
        let l = (32 + 2 * e + 2 * i - h - k) % 7
        let m = Math.floor((a + 11 * h + 22 * l) / 451)
        let month = Math.floor((h + l - 7 * m + 114) / 31)
        let day = ((h + l - 7 * m + 114) % 31) + 1
        let date = new Date(year, month - 1, day)
        return date
    } else {
        // Find the Julian Easter Sunday date
        let a = year % 4
        let b = year % 7
        let c = year % 19
        let d = (19 * c + 15) % 30
        let e = (2 * a + 4 * b - d + 34) % 7
        let month = Math.floor((d + e + 114) / 31)
        let day = ((d + e + 114) % 31) + 1
        let julianEaster = new Date(year, month - 1, day)
        
        // Find the number of days skipped in the Gregorian calendar
        let gregorianEaster = new Date(julianEaster);
        gregorianEaster.setDate(julianEaster.getDate() + 13)
    
        return new Date(gregorianEaster.getFullYear(), gregorianEaster.getMonth(), gregorianEaster.getDate())
    }
    
}

export const checkOccasion = (type)=>{
    let occasion = false
    let today = new Date()
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
            interval = [14, 7] //two week before and one week after christmas
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
    
        if(today >= date_from && today <= date_to){
            occasion = true
        }
    }
  
    return occasion
}