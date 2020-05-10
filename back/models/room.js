const Player = require('./player'); //Player object

module.exports = class room {

    constructor(){
        this.users = [];
        this.winners = [];
        this.dismissedCards = [];
        this.currentDeck = [];
        this.currentPlayer; // will be socket ID of player
        this.playedCards= [];
    }
}
 