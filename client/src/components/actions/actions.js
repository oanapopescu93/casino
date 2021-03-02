export const calculate_money = function(money_sum) {
	return {
		type: "calculate_money",
		money: money_sum
	}
}
export const get_history = function(history) {
	return {
		type: "get_history",
		history: history
	}
}

export const game_visible = function(data) {
	return {
		type: "game_visible",
		visibility: data
	}
}