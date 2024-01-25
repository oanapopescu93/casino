var poker_deck = []
var poker_players = []
var poker_dealer = null
var poker_hidden_players = []
var poker_pot = 0
let how_many_players = 4
let how_many_cards = 5
let how_many_rounds = 3
let poker_current_player = 0    
let poker_current_round = 0

function poker(data, user_join){ 
    switch(data.game){
        case "texas_holdem":
            how_many_cards = 2
            break
        default: //ex: 5_card_draw
            how_many_cards = 5
    }

    switch (data.action) {
        case 'start':    
            poker_players = []  
            poker_deck = []
            poker_hidden_players = []
            poker_current_player = 0    
            poker_current_round = 0 
            poker_pot = 0  
            
            // a certain number of players sit at the table 
            poker_players = createPlayers()
            
            // a certain number of cards are dealt to each player, only the user will see his own cards, the rest will be hidden
            poker_deck = createDeck(10000) 
            poker_players = dealHands("players")  
            poker_hidden_players = createHiddenPlayers()            
            
            payload = {action: "preflop_betting", players: poker_hidden_players}
            return payload
        case "preflop_betting":             
            poker_players = preflop_betting()
            poker_hidden_players = createHiddenPlayers()
            poker_dealer = dealHands("dealer")   
            payload = {action: "flop", players: poker_hidden_players, dealer: poker_dealer}
            return payload
        case "fold":
            poker_players = handleFold()
            poker_hidden_players = createHiddenPlayers()
            console.log(poker_dealer)
            payload = {action: "fold", players: poker_hidden_players, dealer: poker_dealer}
            return payload
        case "flop":
            payload = {action: "ceva", players: poker_hidden_players, dealer: poker_dealer}
            return payload
    }  
    
    function createDeck(turns){
        let suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
        let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
        for (let i = 0 ; i < values.length; i++){
            for(let j = 0; j < suits.length; j++){
                let weight = 0
                switch(values[i]){
                    case "J":
                        weight = 11
                        break    
                    case "Q":
                        weight = 12
                        break    
                    case "K":
                        weight = 13
                        break    
                    case "A":
                        weight = 14
                        break 
                    default:
                        weight = parseInt(values[i]) 
                }
                let card = { Value: values[i], Suit: suits[j], Weight: weight }
                poker_deck.push(card)
            }
        }		
        return shuffle(turns)
    }		
    function shuffle(turns){ 
        for (let i = 0; i < turns; i++){
            let a = Math.floor((Math.random() * poker_deck.length))
            let b = Math.floor((Math.random() * poker_deck.length))
            let tmp = poker_deck[a]		
            poker_deck[a] = poker_deck[b]
            poker_deck[b] = tmp
        }
        return poker_deck
    }

    function createPlayers(){        
        let players = []
        for(let i=0; i<how_many_players;i++){
            let player = {uuid: "player_"+i, user: "player_"+i, type: "bot", money: 100, fold: false} // if fewer than 4 players join, we add bots for the rest occupied sits
            if(user_join[i]){
                player.uuid = user_join[i].uuid
                player.user = user_join[i].user
                player.type = "human"
                player.money = user_join[i].money
                player.fold = false
            }
            players.push(player)
        }
        return players
    }
    function dealHands(who){
        switch(who){
            case "players":
                let players = [...poker_players]
                for(let i = 0; i < how_many_cards; i++){
                    for (let j = 0; j < players.length; j++){
                        let card = poker_deck.pop()
                        if(i === 0){
                            players[j].hand = []
                        } else {
                            if(data.uuid == players[j].uuid){
                                players[j].bet = data.bet
                            }	
                        }	
                        players[j].hand.push(card)
                    }
                }                
                players.sort((a, b) => b.Weight - a.Weight) //sort hand after the value of the card
                return players
            case "dealer":
                let dealer = {id: "dealer", hand: []}	
                for(let i = 0; i < 3; i++){ //the dealer will show 3 cards at the start of the game
                    let card = poker_deck.pop()
                    dealer.hand.push(card) 
                }
                return dealer
        }
    }
    function createHiddenPlayers(){
        let players = [...poker_players] 
        let hidden_players = []       
        for(let i in players){
            if(data.uuid === players[i].uuid){                
                if(players[i].hand){
                    players[i].handStrength = evaluateHand(players[i].hand)
                }
                hidden_players.push(players[i])
            } else {
                hidden_players.push({...players[i], hand: null})
            }
        }
        return hidden_players 
    }

    function preflop_betting(){
        let players = [...poker_players] 
        let index = poker_players.findIndex((x) => x.uuid === data.uuid)
        for(let i in players){
            if(parseInt(i) === index){
                players[index].bet = data.bet
            } else {
                if(players[i].hand){
                    let handStrength = evaluateHand(players[i].hand)
                    if (handStrength.strength >= 9) {
                        players[i].bet = data.bet + 1
                    } else if (handStrength >= 5) {
                        players[i].bet = data.bet
                    } else {
                        players[i].bet = data.bet - 1
                        if(players[i].bet < 1){
                            players[i].bet = 1
                        }
                    }
                }
            }
        }        
        return players
    }

    function handleFold(){
        let players = [...poker_players]
        let index = poker_players.findIndex((x) => x.uuid === data.uuid)
        players[index].fold = true
        return players
    }

    function evaluateHands(array){        
        for(let i in array){
            if(array[i].hand){
                array[i].handStrength = evaluateHand(array[i].hand)
            }
        }
        return array
    }

    function evaluateHand(hand){
        // Sort the hand by card weight in descending order
        hand.sort((a, b) => b.Weight - a.Weight)

        // Check for specific hand combinations in decreasing order of strength
        if (isRoyalFlush(hand)) return {text: 'Royal Flush', info: hand[0], strength: 10}
        if (isStraightFlush(hand)) return {text: 'Straight Flush', info: hand[0], strength: 9}
        if (isFourOfAKind(hand)) return {text: 'Four of a Kind', info: hand[0], strength: 8}
        if (isFullHouse(hand)) return {text: 'Full House', info: hand[0], strength: 7}
        if (isFlush(hand)) return {text: 'Flush', info: hand[0], strength: 6}
        if (isStraight(hand)) return {text: 'Straight', info: hand[0], strength: 5}
        if (isThreeOfAKind(hand)) return {text: 'Three of a Kind', info: hand[0], strength: 4}
        if (isTwoPair(hand)) return {text: 'Two Pair', info: hand[0], strength: 3}
        if (isOnePair(hand)) return {text: 'One Pair', info: hand[0], strength: 2}

        // If none of the above combinations, it is a high card hand
        return {text: 'High Card', info: hand[0], strength: 1}
    }
    // Helper functions to check hand combinations
    function isRoyalFlush(hand){
        const royalFlushValues = ['10', 'J', 'Q', 'K', 'A']
        const suits = new Set(hand.map((card) => card.Suit))
        if (suits.size !== 1) {
            return false // Not all cards have the same suit
        }
        const values = hand.map((card) => card.Value)
        const royalFlush = royalFlushValues.every((value) => values.includes(value))
        return royalFlush
    }    
    function isStraightFlush(hand){
        return isStraight(hand) && isFlush(hand)
    }
    function isFourOfAKind(hand){
        return countDuplicates(hand, 4)
    }
    function isFullHouse(hand){
        return countDuplicates(hand, 3) && countDuplicates(hand, 2)
    }
    function isFlush(hand){
        return hand.every((card) => card.Suit === hand[0].Suit)
    }
    function isStraight(hand){
        for (let i = 1; i < hand.length; i++) {
            if (hand[i].Weight !== hand[i - 1].Weight - 1){
                return false
            }
        }
        return true
    }  
    function isThreeOfAKind(hand){
        return countDuplicates(hand, 3)
    }
    function isTwoPair(hand){
        const pairs = countPairs(hand)
        return pairs === 2
    }  
    function isOnePair(hand){
        return countPairs(hand) === 1
    }  
    function countDuplicates(hand, count){
        const values = hand.map((card) => card.Value)
        const valueCounts = {}    
        for (const value of values) {
            valueCounts[value] = (valueCounts[value] || 0) + 1
        }    
        return Object.values(valueCounts).includes(count)
    }
    function countPairs(hand){
        const values = hand.map((card) => card.Value)
        const valueCounts = {}    
        for (const value of values) {
            valueCounts[value] = (valueCounts[value] || 0) + 1
        }    
        const pairs = Object.values(valueCounts).filter((count) => count === 2)
        return pairs.length
    }
    
    return {}
}

module.exports = {poker}