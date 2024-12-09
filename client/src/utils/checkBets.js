export const checkBets = (data, handleErrors) => {
    const { bets, money, lang } = data

    if (parseInt(bets) > parseInt(money)) {
        handleErrors("error", "no_money", lang)
        return false
    }
    if (parseInt(bets) === 0) {
        handleErrors("error", "no_bets", lang)
        return false
    }
    return true
}
