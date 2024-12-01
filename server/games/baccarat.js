var baccarat_deck = []
var baccarat_player = {
    hand: [],
    value_hand: null,
    win: false,
}
var baccarat_banker = {
    hand: [],
    value_hand: null,
    win: false,
}

function baccarat(data){ 
    switch (data.action) {
        case 'start':
            let suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
            let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

            baccarat_deck = createDeck(suits, values, 10000)
            dealHands()

            baccarat_player.value_hand = getValueCards(baccarat_player.hand)
            baccarat_banker.value_hand = getValueCards(baccarat_banker.hand)

            return {
                player: baccarat_player, 
                banker: baccarat_banker,
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
                baccarat_deck.push(card)
            }
        }		
        return shuffle(turns)
    }
    	
    function shuffle(turns){ 
        for (let i = 0; i < turns; i++){
            let a = Math.floor((Math.random() * baccarat_deck.length))
            let b = Math.floor((Math.random() * baccarat_deck.length))
            let tmp = baccarat_deck[a]		
            baccarat_deck[a] = baccarat_deck[b]
            baccarat_deck[b] = tmp
        }
        return baccarat_deck
    }

    function dealHands(){
        baccarat_player.hand = []
        baccarat_banker.hand = []
        for (let i = 0; i < 2; i++) {
            baccarat_player.hand.push(baccarat_deck.pop())
            baccarat_banker.hand.push(baccarat_deck.pop())
        }
        thirdCardStrategies()
    }

    function getValueCards(cards) {
        const totalValueCards = cards.reduce((sum, card) => sum + card.Weight, 0)        
        return totalValueCards % 10
    }

    function thirdCardStrategies(){
        //Third Card Rule for the Player
        const playerValue = getValueCards(baccarat_player.hand) 
        const bankerValue = getValueCards(baccarat_banker.hand)      
        
        if (playerValue >= 0 && playerValue <= 5) { // Player draws a third card
            baccarat_player.hand.push(baccarat_deck.pop())
        }
        
        // Check for natural win
        if (playerValue === 8 || playerValue === 9 || bankerValue === 8 || bankerValue === 9) {
            if (bankerValue > playerValue) {
                baccarat_banker.win = true // Banker natural win
            } else if (playerValue > bankerValue) {
                baccarat_player.win = true // Player natural win
            } else { // Natural tie
                baccarat_player.win = true
                baccarat_banker.win = true
            }
            return // No further actions if a natural win occurs
        }

        //Third Card Rule for the Banker
        const updatedBankerValue = getValueCards(baccarat_banker.hand)

        if (updatedBankerValue >= 7) { //Banker stands on 7, 8, or 9
            return
        }
        if (updatedBankerValue <= 2) { // Banker draws a third card if total is 0, 1, or 2           
            baccarat_banker.hand.push(baccarat_deck.pop())
            return
        }
    
        // Banker's action depends on the Player's third card (if drawn)
        if (baccarat_player.hand.length === 3) {
            const playerThirdCard = baccarat_player.hand[2].Weight

            if (updatedBankerValue === 3 && playerThirdCard !== 8) {
                baccarat_banker.hand.push(baccarat_deck.pop())
            } else if (updatedBankerValue === 4 && playerThirdCard >= 2 && playerThirdCard <= 7) {
                baccarat_banker.hand.push(baccarat_deck.pop())
            } else if (updatedBankerValue === 5 && playerThirdCard >= 4 && playerThirdCard <= 7) {
                baccarat_banker.hand.push(baccarat_deck.pop())
            } else if (updatedBankerValue === 6 && playerThirdCard >= 6 && playerThirdCard <= 7) {
                baccarat_banker.hand.push(baccarat_deck.pop())
            }
        }
    }

    return {}
}

module.exports = {baccarat}