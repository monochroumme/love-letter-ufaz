module.exports = class player {
    constructor(nickname, socket) {
        this.nickname = nickname;
        this.socket = socket;
        this.playerId = socket.id;
        this.cardsInHand = [null,null];
        this.cardsPlayed = [];
        this.immune = true;
        this.eliminated = false;
        this.isConnected = true;
        this.isReady = false;
    }
}
