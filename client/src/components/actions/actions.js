export const roulette_calculate_money = function(money_sum) {
	return {
		type: "roulette_calculate_money",
		money: money_sum
	}
}
export const roulette_get_history = function(history) {
	return {
		type: "roulette_get_history",
		history: history
	}
}

export const blackjack_calculate_money = function(money_sum) {
	return {
		type: "blackjack_calculate_money",
		money: money_sum
	}
}
export const blackjack_get_history = function(history) {
	return {
		type: "blackjack_get_history",
		history: history
	}
}

export const game_visible = function(data) {
	return {
		type: "game_visible",
		visibility: data
	}
}