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

export const slot_calculate_money = function(money_sum) {
	return {
		type: "slot_calculate_money",
		money: money_sum
	}
}
export const slot_get_history = function(history) {
	return {
		type: "slot_get_history",
		history: history
	}
}

export const craps_calculate_money = function(money_sum) {
	return {
		type: "craps_calculate_money",
		money: money_sum
	}
}
export const craps_get_history = function(history) {
	return {
		type: "craps_get_history",
		history: history
	}
}

export const race_calculate_money = function(money_sum) {
	return {
		type: "race_calculate_money",
		money: money_sum
	}
}
export const race_get_history = function(history) {
	return {
		type: "race_get_history",
		history: history
	}
}

export const game_visible = function(data) {
	return {
		type: "game_visible",
		visibility: data
	}
}

export const game_page = function(data) {
	return {
		type: "game_page",
		page: data
	}
}