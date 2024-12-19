let theShoe = [];
let theDiscard = [];
let playerWinningHands = 0;
let bankerWinningHands = 0;
let tieHands = 0;
let dragon7Hands = 0;
let panda8Hands = 0;
let totalHands = 0;
let myRunningChipTotal = 1000;

let playerTotal = null;
let bankerTotal = null;
let playerWins = false;
let bankerWins = false;
let resultIsADragon = false;
let resultIsATie = false;
let resultIsAPanda = false;
let playerTotalCards = 0;
let bankerTotalCards = 0;
let playerHand = [];
let bankerHand = [];
let playerBet = 0;
let bankerBet = 0;
let dragonBet = 0;
let tieBet = 0;
let pandaBet = 0;

document
  .getElementById("aboutTheGame")
  .addEventListener("click", explainTheGame);
document.getElementById("shuffleButton").addEventListener("click", createShoe);
document.getElementById("dealButton").addEventListener("click", dealAHand);

document.getElementById("dealButton").disabled = true;

function explainTheGame() {
  console.log("WELCOME TO BACCARAT EASILY!!!");
  console.log("To play baccarat, you must bet on a side, Player or Banker.");
  console.log("The value of a hand is the sum of the cards.");
  console.log("10, J, Q, and K are worth 0 points.");
  console.log("A is 1 point, 2 is 2 points, 3 is 3 points, etc.");
  console.log(
    "The value of a hand is the LAST digit of the total of all the cards."
  );
  console.log("For example 9+8 is not 17, but instead 7");
  console.log("Whichever side gets closest to 9, without going over wins!");
  console.log("You cannot bet on BOTH the player and the banker. Either or.");
  console.log(
    "There are three optional bonus bets: Dragon 7, Tie, and Panda 8"
  );
  console.log("The Dragon is a bet that the bank wins with a three card 7.");
  console.log("The Tie is a bet that the player and banker tie.");
  console.log("The Panda is a bet that the Player wins with a three card 8.");
  console.log(
    "A tutorial: https://www.caesars.com/casino-gaming-blog/latest-posts/table-games/baccarat/how-to-play-baccarat#.WysD-adKhPY"
  );
  console.log(
    "Another link: http://www.bay101.com/Table-Games/How-to-Play-EZ-Baccarat"
  );
  console.log(
    "A link for the banker hit chart: http://photos1.blogger.com/blogger/4295/1891/1600/baccarat-table02.2.jpg"
  );
  console.log("Let's shuffle!");
  console.log("Press the Shuffle the Deck button to shuffle.");
  console.log("Then make your bets.");
  console.log("Press Deal to deal a hand.");
}

function createShoe() {
  theDiscard = [];
  theShoe = [];
  createTheShoe();
  shuffleTheCards(theShoe);
  burnCards(theShoe, theDiscard);

  function card(name, suit, value, deck, image) {
    this.name = name;
    this.image = image;
    this.suit = suit;
    this.deck = deck;
    this.value = value > 10 ? 0 : value;
  }

  function createTheShoe() {
    this.names = [
      "Ace",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Jack",
      "Queen",
      "King"
    ];

    this.images = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K"
    ];

    this.suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
    this.decks = 8;
    if (theShoe.length === 0) {
      for (let deck = 1; deck <= this.decks; deck++) {
        for (let suit = 0; suit < suits.length; suit++) {
          for (let name = 0; name < names.length; name++) {
            theShoe.push(
              new card(
                this.names[name],
                this.suits[suit],
                name + 1,
                deck,
                this.images[name]
              )
            );
          }
        }
      }
    }
    return theShoe;
  }

  function shuffleTheCards() {
    for (let i = 0; i < 1000; i++) {
      let location1 = Math.floor(Math.random() * theShoe.length);
      let location2 = Math.floor(Math.random() * theShoe.length);
      let temp = theShoe[location1];
      theShoe[location1] = theShoe[location2];
      theShoe[location2] = temp;
    }
  }

  function burnCards() {
    let numBurnCards = theShoe[0].value === 0 ? 10 : theShoe[0].value;
    for (let i = 0; i <= numBurnCards; i++) {
      theDiscard.push(theShoe.shift());
    }
    document.getElementById("dealButton").disabled = false;
    document.querySelector("#myChipTotal").innerHTML = myRunningChipTotal;
    console.log("The deck is shuffled. We are ready to play.");
  }
}

//-----------------------------------------------------------------------------------

function dealAHand() {
  clearTheTable();
}

function clearTheTable() {
  document.querySelector("#playerFirst .suit").innerHTML = "";
  document.querySelector("#playerFirst .image").innerHTML = "";
  document.querySelector("#playerSecond .suit").innerHTML = "";
  document.querySelector("#playerSecond .image").innerHTML = "";
  document.querySelector("#bankerFirst .suit").innerHTML = "";
  document.querySelector("#bankerFirst .image").innerHTML = "";
  document.querySelector("#bankerSecond .suit").innerHTML = "";
  document.querySelector("#bankerSecond .image").innerHTML = "";
  document.querySelector("#playerThird .suit").innerHTML = "";
  document.querySelector("#playerThird .image").innerHTML = "";
  document.querySelector("#bankerThird .suit").innerHTML = "";
  document.querySelector("#bankerThird .image").innerHTML = "";
  document
    .querySelector("#playerFirst")
    .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
  document
    .querySelector("#playerSecond")
    .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
  document
    .querySelector("#bankerFirst")
    .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
  document
    .querySelector("#bankerSecond")
    .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
  document
    .querySelector("#playerThird")
    .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
  document
    .querySelector("#bankerThird")
    .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
  dealFirstFourCards();
}

function dealFirstFourCards() {
  playerHand.push(theShoe.shift());
  playerTotalCards++;
  bankerHand.push(theShoe.shift());
  bankerTotalCards++;
  playerHand.push(theShoe.shift());
  playerTotalCards++;
  bankerHand.push(theShoe.shift());
  bankerTotalCards++;
  console.log(playerHand, bankerHand)
  showFirstFourCards();
}

function suitChanger(suit) {
  if (suit === "Spades") {
    return "&spades;";
  } else if (suit === "Hearts") {
    return "&hearts;";
  } else if (suit === "Clubs") {
    return "&clubs;";
  } else if (suit === "Diamonds") {
    return "&diams;";
  }
}

function showFirstFourCards() {
  if (playerHand[0]) {
    document.querySelector("#playerFirst .suit").innerHTML = suitChanger(
      playerHand[0].suit
    );
    document.querySelector("#playerFirst .image").innerHTML =
      playerHand[0].image;
    document.querySelector("#playerFirst").classList.add(playerHand[0].suit);
  }
  if (playerHand[1]) {
    document.querySelector("#playerSecond .suit").innerHTML = suitChanger(
      playerHand[1].suit
    );
    document.querySelector("#playerSecond .image").innerHTML =
      playerHand[1].image;
    document.querySelector("#playerSecond").classList.add(playerHand[1].suit);
  }
  if (bankerHand[0]) {
    document.querySelector("#bankerFirst .suit").innerHTML = suitChanger(
      bankerHand[0].suit
    );
    document.querySelector("#bankerFirst .image").innerHTML =
      bankerHand[0].image;
    document.querySelector("#bankerFirst").classList.add(bankerHand[0].suit);
  }
  if (bankerHand[1]) {
    document.querySelector("#bankerSecond .suit").innerHTML = suitChanger(
      bankerHand[1].suit
    );
    document.querySelector("#bankerSecond .image").innerHTML =
      bankerHand[1].image;
    document.querySelector("#bankerSecond").classList.add(bankerHand[1].suit);
  }
  totalTheHands();
}

function totalTheHands() {
  playerTotal = (playerHand[0].value + playerHand[1].value) % 10;
  bankerTotal = (bankerHand[0].value + bankerHand[1].value) % 10;
  compareHandsForNaturals();
}

function compareHandsForNaturals() {
  if (
    playerTotal === 8 ||
    playerTotal === 9 ||
    bankerTotal === 8 ||
    bankerTotal === 9
  ) {
    compareHandsFinal();
  } else {
    drawThirdCards();
  }
}

function drawThirdCards() {
  if (playerTotal <= 5) {
    playerHand.push(theShoe.shift());
    playerTotalCards++;
  }
  if (!playerHand[2]) {
    if (bankerTotal <= 5) {
      bankerHand.push(theShoe.shift());
      bankerTotalCards++;
    }
  }
  if (playerHand[2]) {
    if (bankerTotal === 0 || bankerTotal === 1 || bankerTotal === 2) {
      bankerHand.push(theShoe.shift());
      bankerTotalCards++;
    } else if (bankerTotal === 3 && playerHand[2].value !== 8) {
      bankerHand.push(theShoe.shift());
      bankerTotalCards++;
    } else if (bankerTotal === 3 && playerHand[2].value === 8) {
      // console.log("Banker 3 vs 8 exception fires");
    } else if (
      bankerTotal === 4 &&
      [2, 3, 4, 5, 6, 7].includes(playerHand[2].value)
    ) {
      bankerHand.push(theShoe.shift());
      bankerTotalCards++;
    } else if (
      bankerTotal === 5 &&
      [4, 5, 6, 7].includes(playerHand[2].value)
    ) {
      bankerHand.push(theShoe.shift());
      bankerTotalCards++;
    } else if (bankerTotal === 6 && [6, 7].includes(playerHand[2].value)) {
      bankerHand.push(theShoe.shift());
      bankerTotalCards++;
    }
  }
  playerTotal = playerHand[2]
    ? (playerHand[0].value + playerHand[1].value + playerHand[2].value) % 10
    : (playerHand[0].value + playerHand[1].value) % 10;
  bankerTotal = bankerHand[2]
    ? (bankerHand[0].value + bankerHand[1].value + bankerHand[2].value) % 10
    : (bankerHand[0].value + bankerHand[1].value) % 10;
  showThirdCards();
}

function showThirdCards() {
  if (playerHand[2]) {
    document.querySelector("#playerThird .suit").innerHTML = suitChanger(
      playerHand[2].suit
    );
    document.querySelector("#playerThird .image").innerHTML =
      playerHand[2].image;
    document.querySelector("#playerThird").classList.add(playerHand[2].suit);
  }
  if (bankerHand[2]) {
    document.querySelector("#bankerThird .suit").innerHTML = suitChanger(
      bankerHand[2].suit
    );
    document.querySelector("#bankerThird .image").innerHTML =
      bankerHand[2].image;
    document.querySelector("#bankerThird").classList.add(bankerHand[2].suit);
  }
  compareHandsFinal();
}

function compareHandsFinal() {
  if (playerTotal > bankerTotal) {
    playerWins = true;
  } else if (playerTotal < bankerTotal) {
    bankerWins = true;
  } else if (playerTotal === bankerTotal) {
    resultIsATie = true;
    console.log("It is a TIE. The bank and player both have", bankerTotal);
  }
  bonusHands();
}

function bonusHands() {
  if (resultIsATie === true) {
    console.log("TIE PAYS 8 TO 1");
  } else if (
    bankerWins === true &&
    bankerTotalCards === 3 &&
    bankerTotal === 7 &&
    bankerHand[2].value === 1
  ) {
    resultIsADragon = true;
    console.log("Rare Dragon!");
    console.log("DRAGON 7 PAYS 40 TO 1!!!");
    dragon7Hands++;
  } else if (
    bankerWins === true &&
    bankerTotalCards === 3 &&
    bankerTotal === 7
  ) {
    resultIsADragon = true;
    console.log("DRAGON 7 PAYS 40 TO 1!!!");
    dragon7Hands++;
  } else if (
    playerWins === true &&
    playerTotalCards === 3 &&
    playerTotal === 8 &&
    bankerTotalCards === 3 &&
    bankerTotal === 7
  ) {
    resultIsAPanda = true;
    console.log("Panda kills the Dragon!");
    console.log("PANDA 8 PAYS 25 TO 1!!!");
    panda8Hands++;
  } else if (
    playerWins === true &&
    playerTotalCards === 3 &&
    playerTotal === 8
  ) {
    resultIsAPanda = true;
    console.log("PANDA 8 PAYS 25 TO 1!!!");
    panda8Hands++;
  } else if (
    playerWins === true &&
    playerTotal === 7 &&
    playerTotalCards === 2 &&
    bankerTotal === 6 &&
    bankerTotalCards === 2
  ) {
    // console.log("Player BBQ's banker!");
  } else if (
    bankerWins === true &&
    playerTotal === 6 &&
    playerTotalCards === 2 &&
    bankerTotal === 7 &&
    bankerTotalCards === 2
  ) {
    // console.log("Banker BBQ's player!");
  } else if (
    bankerWins === true &&
    playerTotalCards === 3 &&
    playerTotal === 8
  ) {
    // console.log("Banker killed the Panda!");
  } else if (
    playerWins === true &&
    bankerTotalCards === 3 &&
    bankerTotal === 7
  ) {
    // console.log("Player killed the Dragon!");
  } else {
    console.log("No bonuses ocurred this hand");
  }
  countHandTotals();
}

function countHandTotals() {
  if (playerWins === true) {
    playerWinningHands++;
  } else if (bankerWins === true) {
    bankerWinningHands++;
  } else if (resultIsATie === true) {
    tieHands++;
  } else {
    console.log("Error in countHandTotals");
  }
  totalHands++;
  console.log("Hand number:", totalHands);
  console.log("Player Winning Hands:", playerWinningHands);
  console.log("Banker Winning Hands:", bankerWinningHands);
  console.log("Dragons:", dragon7Hands);
  console.log("Ties:", tieHands);
  console.log("Pandas:", panda8Hands);
  updateRunningChipTotal();
}

function updateRunningChipTotal() {
  playerBet = parseInt(document.getElementById("playerBet").value, 10);
  bankerBet = parseInt(document.getElementById("bankerBet").value, 10);
  dragonBet = parseInt(document.getElementById("dragonBet").value, 10);
  tieBet = parseInt(document.getElementById("tieBet").value, 10);
  pandaBet = parseInt(document.getElementById("pandaBet").value, 10);
  console.log("playerTotal=", playerTotal);
  console.log("bankerTotal=", bankerTotal);
  myRunningChipTotal =
    myRunningChipTotal - playerBet - bankerBet - dragonBet - tieBet - pandaBet;
  document.querySelector("#myChipTotal").innerHTML = myRunningChipTotal;
  if (resultIsAPanda === true) {
    myRunningChipTotal =
      myRunningChipTotal + 2 * playerBet + 1 * pandaBet + 25 * pandaBet;
    console.log("You win", pandaBet * 25, "dollars for the PANDA!");
    if (playerBet) {
      console.log(
        "The PLAYER wins with",
        playerTotal,
        "points against the banker's",
        bankerTotal,
        ". You win",
        playerBet,
        "dollars."
      );
    } else if (bankerBet) {
      console.log(
        "Sorry, the PLAYER wins with",
        playerTotal,
        "points against the banker's",
        bankerTotal,
        ". You lose",
        bankerBet,
        "dollars."
      );
    }
    console.log("The dragon and tie bets lose.");
  } else if (resultIsADragon === true) {
    myRunningChipTotal =
      myRunningChipTotal + 1 * bankerBet + 1 * dragonBet + 40 * dragonBet;
    console.log("You win", dragonBet * 40, "dollars for the DRAGON!");
    if (bankerBet) {
      console.log("The BANKER bet pushes on a dragon.");
    } else if (playerBet) {
      console.log(
        "Sorry, the BANKER wins with",
        bankerTotal,
        "points against the player's",
        playerTotal,
        ". You lose",
        playerBet,
        "dollars."
      );
    }
    console.log("The panda and tie bets lose.");
  } else if (playerWins === true) {
    myRunningChipTotal = myRunningChipTotal + 2 * playerBet;
    if (playerBet) {
      console.log(
        "The PLAYER wins with",
        playerTotal,
        "points against the banker's",
        bankerTotal,
        ". You win",
        playerBet,
        "dollars."
      );
    } else if (bankerBet) {
      console.log(
        "Sorry, the PLAYER wins with",
        playerTotal,
        "points against the banker's",
        bankerTotal,
        ". You lose",
        bankerBet,
        "dollars."
      );
    }
    console.log("The panda, dragon, and tie bets lose.");
  } else if (bankerWins === true && resultIsADragon === false) {
    myRunningChipTotal = myRunningChipTotal + 2 * bankerBet;
    if (bankerBet) {
      console.log(
        "The BANKER wins with",
        bankerTotal,
        "points against the player's",
        playerTotal,
        ". You win",
        bankerBet,
        "dollars."
      );
    } else if (playerBet) {
      console.log(
        "Sorry, the BANKER wins with",
        bankerTotal,
        "points against the player's",
        playerTotal,
        ". You lose",
        playerBet,
        "dollars."
      );
    }
    console.log("The panda, dragon, and tie bets lose.");
  } else if (resultIsATie === true) {
    myRunningChipTotal =
      myRunningChipTotal +
      1 * bankerBet +
      1 * playerBet +
      1 * tieBet +
      8 * tieBet;
    console.log("You win", tieBet * 8, "dollars.");
    console.log("The banker and player push on a tie.");
    console.log("The panda and dragon bets lose.");
  }
  document.querySelector("#myChipTotal").innerHTML = "";
  document.querySelector("#myChipTotal").innerHTML = myRunningChipTotal;
  console.log("Your chip total is:", myRunningChipTotal);
  discardCards();
}

function discardCards() {
  for (let i = 0; i < playerHand.length; i++) {
    theDiscard.push(playerHand[i]);
  }
  playerHand = [];
  for (let j = 0; j < bankerHand.length; j++) {
    theDiscard.push(bankerHand[j]);
  }
  bankerHand = [];
  resetAll();
}

function resetAll() {
  playerTotal = null;
  bankerTotal = null;
  playerWins = false;
  bankerWins = false;
  resultIsATie = false;
  resultIsADragon = false;
  resultIsAPanda = false;
  playerTotalCards = 0;
  bankerTotalCards = 0;
  seeIfThereIsEnoughMoney();
}

function seeIfThereIsEnoughMoney() {
  if (myRunningChipTotal === 0) {
    console.log("You have run out of money. Please restart the game.");
    stopTheGame();
  }
  seeIfThereAreEnoughCards();
}

function seeIfThereAreEnoughCards() {
  if (theShoe.length < 52) {
    console.log("The cut card is out. Please reshuffle.");
    stopTheGame();
  }
  console.log(
    "-------------------Hand",
    totalHands,
    " is over------------------------>"
  );
}

function stopTheGame() {
  console.log("Game stopped. Shuffle the deck again to reset.");
  document.getElementById("dealButton").disabled = true;
  playerWinningHands = 0;
  bankerWinningHands = 0;
  tieHands = 0;
  dragon7Hands = 0;
  panda8Hands = 0;
  totalHands = 0;
}

module.exports = {}