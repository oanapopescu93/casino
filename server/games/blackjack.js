var blackjack_deck = []
var blackjack_hidden_dealer = {}
var blackjack_players = []
var blackjack_dealer = {}

function blackjack(data, user_join){
    let blackjack_current_player = 0
    let blackjack_game_end = false

    switch (data.action) {
        case 'start':
            let suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
            let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

            blackjack_deck = createDeck(suits, values, 10000)
            
            blackjack_players = user_join
            dealHands()

            blackjack_hidden_dealer.id = blackjack_dealer.id
            blackjack_hidden_dealer.hand = []
            blackjack_hidden_dealer.hand.push(blackjack_dealer.hand[0])

            checkBlackjack()
            
            if(blackjack_dealer.win){
                blackjack_game_end = true
                return {action: data.action, players: blackjack_players, dealer: blackjack_dealer, game_end: blackjack_game_end}
            } else {
                let check_player_win = blackjack_players.filter((x)=>{
                    if(x.win) return x
                })
                if(check_player_win.length > 0){ // one of the players won
                    blackjack_game_end = true
                    return {action: data.action, players: blackjack_players, dealer: blackjack_dealer, game_end: blackjack_game_end}
                } else {
                    return {action: data.action, players: blackjack_players, dealer: blackjack_hidden_dealer, game_end: blackjack_game_end}
                }
            } 
        case 'hit':
            blackjack_players = data.players
            let index_hit = blackjack_players.findIndex((x) => x.uuid === data.uuid)
            if(index_hit === blackjack_current_player){
                hitMe()
                checkForEndOfGame(index_hit)                
                if(blackjack_dealer.win){
                    blackjack_game_end = true
                    return {action: data.action, players: blackjack_players, dealer: blackjack_dealer, game_end: blackjack_game_end}
                } else {
                    let check_player_win = blackjack_players.filter((x)=>{
                        if(x.win) return x
                    })
                    if(check_player_win.length > 0){ // one of the players won
                        blackjack_game_end = true
                        return {action: data.action, players: blackjack_players, dealer: blackjack_dealer, game_end: blackjack_game_end}
                    } else {
                        return {action: data.action, players: blackjack_players, dealer: blackjack_hidden_dealer, game_end: blackjack_game_end}
                    }
                }                
            } else {
                return {action: 'not_current_player'} 
            }           
        case 'stand':
            blackjack_players = data.players
            let index_stand = blackjack_players.findIndex((x) => x.uuid === data.uuid)
            blackjack_current_player++
            checkForEndOfGame(index_stand)
            if(blackjack_current_player<blackjack_players.length){                
                return {action: data.action, players: blackjack_players, dealer: blackjack_hidden_dealer, game_end: blackjack_game_end}
            } else {
                blackjack_game_end = true
                return {action: data.action, players: blackjack_players, dealer: blackjack_dealer, game_end: blackjack_game_end}
            }
        case 'double_down':
            blackjack_players = data.players
            let index_double_down = blackjack_players.findIndex((x) => x.uuid === data.uuid)
            if(index_double_down === blackjack_current_player){
                hitMe()
                blackjack_current_player++
                checkForEndOfGame(index_double_down)
                if(blackjack_current_player<blackjack_players.length){                
                    return {action: data.action, players: blackjack_players, dealer: blackjack_hidden_dealer, game_end: blackjack_game_end}
                } else {
                    blackjack_game_end = true
                    return {action: data.action, players: blackjack_players, dealer: blackjack_dealer, game_end: blackjack_game_end}
                }
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
                    weight = 11				
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
        blackjack_dealer = {id: "dealer", hand: []}			
        for(let i = 0; i < 2; i++){	
            let card = blackjack_deck.pop()
            blackjack_dealer.hand.push(card)
            for (let j = 0; j < blackjack_players.length; j++){
                let card = blackjack_deck.pop()
                if(i === 0){
                    blackjack_players[j].hand = []
                } else {
                    if(data.uuid == blackjack_players[j].uuid){
                        blackjack_players[j].bets = data.bet
                    }	
                }	
                blackjack_players[j].hand.push(card)
            }
        }
        points(false)
    }	
    function checkBlackjack(){
        let dealerScore = points(true)
        if(dealerScore === 21){ //blackjack
            blackjack_dealer.win = true
        } else {
            for(let i in blackjack_players){
                let playerScore = blackjack_players[i].points   
                if(playerScore === 21){ //blackjack
                    blackjack_players[i].win = true
                }
            }
        }
    }

    function hitMe(){
        let card = blackjack_deck.pop()
        blackjack_players[blackjack_current_player].hand.push(card)
        points(false)
    }

    function points(dealer = false){
        if(dealer){
            let points = 0
            for(let i in blackjack_dealer.hand){
                points = points + blackjack_dealer.hand[i].Weight
            }
            return points
        } else {
            for(let i in blackjack_players){
                let points = 0
                for(let j in blackjack_players[i].hand){
                    points = points + blackjack_players[i].hand[j].Weight
                }
                blackjack_players[i].points = points
            }
        }
        
    }

    function checkForEndOfGame(index){        
        let playerScore = blackjack_players[index].points   
        let dealerScore = points(true)

        if(playerScore === 21){ //blackjack
            blackjack_players[index].win = true
        } else if(dealerScore === 21){ //blackjack
            blackjack_dealer.win = true
        } else {
            while (dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21) {
                let card = blackjack_deck.pop()
                blackjack_dealer.hand.push(card)
                dealerScore = points(true)
            }
    
            if (playerScore > 21) { //busted
                blackjack_dealer.win = true
            } else if (dealerScore > 21) { //busted
                blackjack_players[index].win = true
            } else {
                if(data.action === "stand" || data.action === "double_down"){         
                    if (playerScore > dealerScore){
                        blackjack_players[index].win = true
                    } else {
                        blackjack_dealer.win = true
                    }
                }
            }
        }
    }
    
    return {}
}

module.exports = {blackjack}