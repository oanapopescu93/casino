let monkey_blackjack = []
let blackjack_deck = new Array()
let hidden_dealer = {}
let blackjack_current_player = 0
let blackjack_players = []
let blackjack_dealer = {}

function blackjack(data, how_lucky, user_join){
    let is_lucky = Math.floor(Math.random() * 100)
    if(is_lucky % how_lucky === 0){
        monkey_blackjack = true
    }
    monkey_blackjack = true
    let game_start = false
    
    switch (data[0]) {
        case 'start':
            if(!game_start){
                let suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
                let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

                blackjack_deck = createDeck(suits, values, 10000)

                blackjack_players = []
                blackjack_players = user_join
                dealHands()

                hidden_dealer.id = blackjack_dealer.id
                hidden_dealer.hand = []
                hidden_dealer.hand.push(blackjack_dealer.hand[0])
                game_start = true
                return ['start', blackjack_players, hidden_dealer, blackjack_deck.length-1]
            } else {
                return "Game has begun. Please wait for the next round."
            }
        case 'pause':
            if(!game_start){
                return ['pause']
            } else {					
                hidden_dealer.id = blackjack_dealer.id
                hidden_dealer.hand = []
                hidden_dealer.hand.push(blackjack_dealer.hand[0])
                return ['pause', blackjack_players, hidden_dealer]
            }
        case 'hit':
            hitMe()
            if(blackjack_players[blackjack_current_player].lose !== true){
                return ['hit', blackjack_players, hidden_dealer, blackjack_deck.length-1]
            } else {
                return ['hit', blackjack_players, blackjack_dealer, blackjack_deck.length-1]
            }
        case 'stay':
            if(blackjack_current_player != blackjack_players.length-1){
                blackjack_current_player++
                return ['stay', blackjack_players, hidden_dealer, blackjack_deck.length-1]
            } else {
                blackjack_win_lose()
                return ['stay', blackjack_players, blackjack_dealer, blackjack_deck.length-1]
            }
    }

    function createDeck(suits, values, turns){
        blackjack_deck = new Array()
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
                    if(data[1].uuid == blackjack_players[j].uuid){
                        blackjack_players[j].bets = data[1].bets
                    }	
                }	
                blackjack_players[j].hand.push(card)
            }
        }
        points('deal_hands')
        check('busted')
        check('blackjack')
    }		
    function hitMe(){
        let card = blackjack_deck.pop()
        blackjack_players[blackjack_current_player].hand.push(card)
        points('hit_me')
        check('busted')
        check('blackjack')
    }		
    function points(reason){
        switch (reason) {
            case 'deal_hands':
                for(let i in blackjack_players){
                    let points = 0
                    for(let j in blackjack_players[i].hand){
                        points = points + blackjack_players[i].hand[j].Weight
                    }
                    blackjack_players[i].points = points
                    blackjack_players[i].lose = false
                    blackjack_players[i].win = false
                }	
                break
            case 'hit_me':
                let points_hit_me = 0
                for(let j in blackjack_players[blackjack_current_player].hand){
                    points_hit_me = points_hit_me + blackjack_players[blackjack_current_player].hand[j].Weight
                }
                blackjack_players[blackjack_current_player].points = points_hit_me
                blackjack_players[blackjack_current_player].lose = false
                blackjack_players[blackjack_current_player].win = false
                break	
            case 'dealer':
                let points_dealer = 0
                for(let i in blackjack_dealer.hand){
                    points_dealer = points_dealer + blackjack_dealer.hand[i].Weight
                }
                blackjack_dealer.points = points_dealer
                break		
        }	
    }		
    function check(reason){
        switch (reason) {
            case 'busted':
                if(blackjack_players[blackjack_current_player].points > 21){				
                    blackjack_players[blackjack_current_player].lose = true
                } 				
                break
            case 'blackjack':
                for(let i in blackjack_players){
                    if(blackjack_players[i].points === 21){
                        blackjack_players[blackjack_current_player].win = true
                    } 
                }	
                break			
        }		
    }
    function check_dealer(dealer, player){
        //check if dealer has more points than players
        let dealer_points = dealer.points
        let player_points = player.points
        if(dealer_points < player_points){
            return false
        } else {
            return true
        }
    }		
    function blackjack_win_lose(){
        //check any instant blackjack wins 
        let blackjack = false
        for(let i in blackjack_players){
            if(blackjack_players[i].win){
                blackjack = true
                break
            }
        }
    
        if(!blackjack){
            let max = -1
        
            //ger player with max points
            let score = 0
            for(let i in blackjack_players){
                if(!blackjack_players[i].lose && blackjack_players[i].points > score){
                    max = i
                    score = blackjack_players[i].points
                }
            }
    
            //check dealer points
            points('dealer')
            let bigger = check_dealer(blackjack_dealer, blackjack_players[max])
            
            while (!bigger) {
                let card = blackjack_deck.pop()
                if(monkey_blackjack){
                    console.log(blackjack_dealer.points, blackjack_players[0].points)
                }
                blackjack_dealer.hand.push(card)
    
                points('dealer')
                bigger = check_dealer(blackjack_dealer, blackjack_players[max])
    
                if(blackjack_dealer.points > 21){				
                    blackjack_dealer.lose = true
                    bigger = true
                } 
            }
    
            if(max !== -1){
                if(blackjack_players[max].points > blackjack_dealer.points){
                    blackjack_players[max].win = true
                } else {
                    blackjack_dealer.win = true
                    if(!blackjack_dealer.lose){
                        blackjack_dealer.win = true
                    } else {
                        blackjack_players[max].win = true
                    }
                }	
            } else {	
                blackjack_dealer.win = true
            }
        } else {
            blackjack_dealer.win = false
        }
    }
}

module.exports = {blackjack}