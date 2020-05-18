module.exports = class player{
    constructor(nickname, playerId) {
        this.nickname = nickname;
        this.playerId = playerId;
        this.cardsInHand = [];
        this.cardsPlayed = [];
        this.immune = true;
        this.eliminated = false;
        this.inGame = true;
    }
}
