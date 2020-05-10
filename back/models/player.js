

module.exports = class player{

    constructor(username){

        this.username = username;
        this.affectionTokens;
        this.cardsInHand = [];
        this.cardsPlayed = [];
        this.immune = true;
        this.eliminated = false;
        this.inGame = true;

    }

}


// cardsInHand: [] (cardId-ler)
// cardsPlayed: [] (yene de)
// immune: bool (handmaid immune eleye biler next player turn-e qeder)
// affectionTokens: int
// playerId: (hash (sha1))
// eliminated: bool
// inGame: bool (iqradan cixibsa false)