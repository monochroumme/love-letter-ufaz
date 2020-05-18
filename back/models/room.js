module.exports = class room {
    constructor(roomCode, maxPlayers, roomStatus, hostPlayerId) {
        this.roomCode = roomCode;
        this.gameStatus = 'BREAK'; // BREAK / IN-GAME
    	this.roomStatus = roomStatus;
        this.players = [];
        this.winners = [];
		this.chat = [];
		this.hostPlayerId = hostPlayerId; // socket ID of the host player
		this.maxPlayers = maxPlayers;
        this.dismissedCards = [];
        this.playedCards = [];
        this.currentDeck = [];
        this.currentPlayer; // socket ID of player
    }
}
 