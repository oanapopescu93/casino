var blackjack_deck = []
var blackjack_hidden_dealer = {}
var blackjack_players = []
var blackjack_dealer = {}

function blackjack(data, user_join, how_lucky){
    let monkey_blackjack = false
    let is_lucky = Math.floor(Math.random() * 100)
    if(is_lucky % how_lucky === 0){
        monkey_blackjack = true
    }
    // monkey_blackjack = true //only for test

    let blackjack_game_end = false
    blackjack_players = data.players ? data.players : []

    switch (data.action) {
        case 'start':
            let suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
            let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
            blackjack_deck = createDeck(suits, values, 10000)            
            createPlayer(user_join, data)
            createBots(data)
            dealHands()
            break
        case 'hit':
            let index_hit = blackjack_players.findIndex((x) => x.uuid === data.uuid)
            blackjack_players[index_hit].action = data.action
            hitMe(index_hit)
            dealerAction()
            botAction()
            break         
        case 'stand':
            let index_stand = blackjack_players.findIndex((x) => x.uuid === data.uuid)
            blackjack_players[index_stand].action = data.action
            dealerAction()
            botAction()
            break
        case 'double_down':
            let index_double_down = blackjack_players.findIndex((x) => x.uuid === data.uuid)
            blackjack_players[index_double_down].action = data.action
            blackjack_players[index_double_down].bets = 2 * blackjack_players[index_double_down].bets
            hitMe(index_double_down)
            dealerAction()
            botAction()
            break
        case "surrender":
            let index_surrender = blackjack_players.findIndex((x) => x.uuid === data.uuid)
            blackjack_players[index_surrender].action = data.action
            dealerAction()
            botAction()
            break
    }

    return end_game()

    function createPlayer(array, data){
        let index = array.findIndex((x) => x.uuid === data.uuid)
        let player = {...array[index], type: "human", action: data.action}
        blackjack_players.push(player)        
    }

    function createBots(data){
        let howManyPlayers = data.howManyPlayers
        let random_player_number = Math.floor(Math.random() * howManyPlayers)
        // random_player_number = 1 // just for test
        for (let i = 0; i < random_player_number; i++) {
            let t = parseInt(i) + 1
            let bot = {
                uuid: 'player_' + t,
                user: 'player ' + t,
                type: "bot",
                bets: 1,
                action: 'start',
            }    
            blackjack_players.push(bot)
        }
    }
    function botAction(){
        let decision = ['hit', 'stand', 'double_down', 'surrender']
        for(i in blackjack_players){
            if(blackjack_players[i].type === "bot"){
                let actionIndex = Math.floor(Math.random() * decision.length)
                let action = decision[actionIndex]
                blackjack_players[i].action = action
                switch (action) {
                    case 'hit':
                        let card = blackjack_deck.pop()        
                        blackjack_players[i].hand.push(card)
                        points(false)
                        break
                    case 'stand':
                    case 'surrender':
                        //nothing happens
                        break
                    case 'double_down':
                        blackjack_players[i].bets = 2 * blackjack_players[i].bets
                        hitMe(i)
                        break
                }
            }
        }
    }

    function dealerAction(){
        let decision = ['hit', 'stand', 'double_down', 'surrender']
        let actionIndex = Math.floor(Math.random() * decision.length)
        let action = decision[actionIndex]
        blackjack_dealer.action = action
        switch (action) {
            case 'hit':
                let card1 = blackjack_deck.pop()
                blackjack_dealer.hand.push(card1)
                points(false)
                break
            case 'stand':
            case 'surrender':
                //nothing happens
                break
            case 'double_down':
                blackjack_dealer.bets = 2 * blackjack_dealer.bets
                let card2 = blackjack_deck.pop()
                blackjack_dealer.hand.push(card2)
                break
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
        blackjack_dealer = {id: "dealer", user: "dealer", type: "dealer", hand: [], bets: 1, action: "start"}
        let index = blackjack_players.findIndex((x) => x.uuid === data.uuid)
        
        if(monkey_blackjack && index !== -1){
            blackjack_players[index].hand = [] 
            for(let i = 0; i < 2; i++){	
                blackjack_players[index].hand.push(forceBustHand(i))
            }
        }

        for(let i = 0; i < 2; i++){	
            let card = blackjack_deck.pop()
            blackjack_dealer.hand.push(card)

            for (let j = 0; j < blackjack_players.length; j++){
                if(monkey_blackjack && parseInt(j) === parseInt(index)){
                    continue
                } else {
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
        }
        points(false)
    }
    
    function forceBustHand(index){
        let arrayBustedCards = [
            { Value: "A", Suit: "Spades", Weight: 11 },
            { Value: "A", Suit: "Hearts", Weight: 11 },
            { Value: "A", Suit: "Diamonds", Weight: 11 },
            { Value: "A", Suit: "Clubs", Weight: 11 },

            { Value: "K", Suit: "Spades", Weight: 10 },
            { Value: "K", Suit: "Hearts", Weight: 10 },
            { Value: "K", Suit: "Diamonds", Weight: 10 },
            { Value: "K", Suit: "Clubs", Weight: 10 },

            { Value: "Q", Suit: "Spades", Weight: 10 },
            { Value: "Q", Suit: "Hearts", Weight: 10 },
            { Value: "Q", Suit: "Diamonds", Weight: 10 },
            { Value: "Q", Suit: "Clubs", Weight: 10 },

            { Value: "J", Suit: "Spades", Weight: 10 },
            { Value: "J", Suit: "Hearts", Weight: 10 },
            { Value: "J", Suit: "Diamonds", Weight: 10 },
            { Value: "J", Suit: "Clubs", Weight: 10 },

            { Value: "10", Suit: "Spades", Weight: 10 },
            { Value: "10", Suit: "Hearts", Weight: 10 },
            { Value: "10", Suit: "Diamonds", Weight: 10 },
            { Value: "10", Suit: "Clubs", Weight: 10 },
        ]

        let firstCard, secondCard
        do {
            firstCard = arrayBustedCards[Math.floor(Math.random() * arrayBustedCards.length)]
            secondCard = arrayBustedCards[Math.floor(Math.random() * arrayBustedCards.length)]
        } while (firstCard.Weight + secondCard.Weight <= 21)

        // Remove the selected cards from the deck if they exist
        removeCardFromDeck(firstCard)
        removeCardFromDeck(secondCard)

        return index === 0 ? firstCard : secondCard
    }
    function removeCardFromDeck(card) {
        for (let i = 0; i < blackjack_deck.length; i++) {
            if (
                blackjack_deck[i].Value === card.Value &&
                blackjack_deck[i].Suit === card.Suit
            ) {
                blackjack_deck.splice(i, 1)
                break
            }
        }
    }

    function hitMe(index){
        let card = blackjack_deck.pop()        
        blackjack_players[index].hand.push(card)
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

    function checkBlackjack() {    
        let dealerScore = points(true)

        if (dealerScore === 21) { // Dealer Blackjack
            blackjack_dealer.result = 'blackjack'
            blackjack_dealer.win = true
            blackjack_game_end = true
            return {
                action: data.action, 
                players: blackjack_players, 
                dealer: blackjack_dealer, 
                game_end: blackjack_game_end, 
                result: {winner: "dealer"}
            }
        }

        for (let player of blackjack_players) {
            if (player.points === 21) { // First player to get Blackjack ends the game
                player.result = 'blackjack'
                player.win = true
                blackjack_game_end = true
                return {
                    action: data.action,
                    players: blackjack_players,
                    dealer: blackjack_dealer,
                    game_end: blackjack_game_end,
                    result: {winner: "player", player}
                }
            }
        }
        
        return
    }

    function checkDealerBusted(){
        let dealerScore = points(true)
        if (dealerScore > 21) {
            blackjack_dealer.result = 'busted'
            blackjack_dealer.win = false
            blackjack_game_end = true
            return {
                action: data.action, 
                players: blackjack_players, 
                dealer: blackjack_dealer,
                game_end: blackjack_game_end, 
                result: getPlayerWinner()
            }
        }
        return
    }

    function checkPlayesBusted(){
        blackjack_players.forEach((player) => {
            if (player.points > 21) { // busted
                player.result = 'busted'
                player.win = false
            }
        })
    }

    function checkDealerSurrender() {
        if (blackjack_dealer.action === "surrender") {
            blackjack_dealer.result = 'surrender'
            blackjack_dealer.win = false
            blackjack_game_end = true
            return {
                action: data.action, 
                players: blackjack_players, 
                dealer: blackjack_dealer, 
                game_end: blackjack_game_end, 
                result: getPlayerWinner()
            }
        }
        return
    }

    function checkAllPlayersStoodBustedOrSurrendered() {
        return blackjack_players.every(player => player.action === "stand" || player.action === "surrender" || player.result === "busted")
    }

    function getPlayerWinner (){
        let result = null
        let pointsMax = 0
        let dealerScore = points(true)
        let dealerBusted = dealerScore > 21 || blackjack_dealer.action === "surrender"

        // Determine the player with the highest valid points
        blackjack_players.forEach((player) => {
            if (player.action !== "surrender" && player.result !== "busted" && player.points > pointsMax) {
                pointsMax = player.points
                result = { winner: "player", player }
            }
        })

        let winPlayer = result?.player
        if (winPlayer && (dealerBusted || winPlayer.points > dealerScore)) {       
            return result
        }
        return {winner: "dealer"}
    }

    function end_game(){
        blackjack_game_end = false        

        // check players busted
        checkPlayesBusted()

        // Check if dealer surrendered
        let surrenderResult = checkDealerSurrender()
        if (surrenderResult) {
            return surrenderResult // If the dealer surrenders, the game ends here.
        }

        // check blackjack
        let blackjackResult = checkBlackjack()
        if (blackjackResult) {            
            return blackjackResult // If there's a Blackjack, the game ends here.
        }

        // check dealer busted
        let bustedDealerResult = checkDealerBusted()
        if (bustedDealerResult) {            
            return bustedDealerResult // If dealer is busted, the game ends here.
        }

        // Check if all players have either stood or surrendered
        let all = checkAllPlayersStoodBustedOrSurrendered() 
        if(all){            
            blackjack_game_end = true
            return {action: data.action, players: blackjack_players, dealer: blackjack_dealer, game_end: blackjack_game_end, result: getPlayerWinner()}
        }

        // still end game if the human player is busted
        let index = blackjack_players.findIndex((x) => x.uuid === data.uuid)
        if(blackjack_players[index] && blackjack_players[index].points > 21){            
            blackjack_game_end = true
            return {action: data.action, players: blackjack_players, dealer: blackjack_dealer, game_end: blackjack_game_end, result: null}
        }

        blackjack_hidden_dealer = {
            ...blackjack_dealer,
            hand: [blackjack_dealer.hand[0]] // Show only the first card
        }
        
        return {action: data.action, players: blackjack_players, dealer: blackjack_hidden_dealer, game_end: blackjack_game_end, result: null}
    }
}

module.exports = {blackjack}