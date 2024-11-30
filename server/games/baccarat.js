var blackjack_deck = []
var blackjack_player = []
var blackjack_banker = []

function baccarat(data){ 
    switch (data.action) {
        case 'start':
            let suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
            let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

            blackjack_deck = createDeck(suits, values, 10000)
            dealHands()

            return {
                action: data.action, 
                player: blackjack_player, 
                banker: blackjack_banker,
                value_player: getValueCards(blackjack_player),
                value_banker: getValueCards(blackjack_banker),
            }
    } 

    function createDeck(suits, values, turns){
        for (let i = 0 ; i < values.length; i++){
            for(let j = 0; j < suits.length; j++){
                let weight = parseInt(values[i])
                if (values[i] == "J" || values[i] == "Q" || values[i] == "K"){
                    weight = 10		
                }
                if (values[i] == "A"){
                    weight = 1			
                }
                let card = { Value: values[i], Suit: suits[j], Weight: weight }
                blackjack_deck.push(card)
            }
        }		
        return shuffle(turns)
    }
    	
    function shuffle(turns){ 
        for (let i = 0; i < turns; i++){
            let a = Math.floor((Math.random() * blackjack_deck.length))
            let b = Math.floor((Math.random() * blackjack_deck.length))
            let tmp = blackjack_deck[a]		
            blackjack_deck[a] = blackjack_deck[b]
            blackjack_deck[b] = tmp
        }
        return blackjack_deck
    }

    function dealHands(){
        blackjack_player = []
        blackjack_banker = []
        for (let i = 0; i < 2; i++) {
            blackjack_player.push(blackjack_deck.pop())
            blackjack_banker.push(blackjack_deck.pop())
        }
    }

    function getValueCards(cards) {
        const totalValueCards = cards.reduce((sum, card) => sum + card.Weight, 0)        
        return totalValueCards % 10
    }

    return {}
}

module.exports = {baccarat}