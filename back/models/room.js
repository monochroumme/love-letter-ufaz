const Player = require('./player'); //Player object

module.exports = class room {

    constructor(){
        this.players = [];
        this.winners = [];
        this.dismissedCards = [];
        this.currentDeck = [];
        this.currentPlayer; // will be socket ID of player
        this.playedCards= [];
    }
}
 

// players: [] (player class)
// roundNumber: int
// winners: [] (her roundun winneri, orderle)
// currentDeck: indi deck-de ne kartlar var
// dismissedCards: [] (iqra bashlayanda bir ya 4 kart dismissed olacaq, onlar burda olacaq)
// currentPlayer: playerId (hash (sha1 code))
// playedCards: [] (cardId-ler)