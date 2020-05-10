

module.exports = class player{

    constructor(username){
        this.users = [];
        this.username = username;
        this.affectionTokens;
        this.cardsInHand = [];
        this.cardsPlayed = [];
        this.immune = true;
        this.eliminated = false;
        this.inGame = true;

    }

}
