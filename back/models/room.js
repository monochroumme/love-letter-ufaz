module.exports = class room {
  constructor(roomCode, maxPlayers, roomStatus, hostPlayerId) {
    this.socketHandler = require('../controllers/socketHandler');
    this.shuffle = require('../utils/shuffle');
    this.roomCode = roomCode;
    this.inGame = false;
    this.started = false;
    this.roomStatus = roomStatus;
    this.players = [];
    this.winners = [];
    this.chat = [];
    this.hostPlayerId = hostPlayerId; // socket ID of the host player
    this.maxPlayers = maxPlayers;
    this.dismissedCards = [0];
    this.playedCards = [];
    this.currentDeck = [];
    this.currentPlayer; // socket ID of player
    if (maxPlayers == 4)
      this.maxTokens = 4;
    else if (maxPlayers == 3)
      this.maxTokens = 5;
    else if (maxPlayers == 2)
      this.maxTokens = 7;
  }

  getPlayerTokens(playerId) {
    return this.winners.filter(v => v == playerId).length;
  }

  getRoomModalData() {
    let data = {
      roomCode: this.roomCode,
      maxTokens: this.maxTokens,
      players: []
    }
    this.players.forEach(player => {
      data.players.push({
        nickname: player.nickname,
        tokens: this.getPlayerTokens(player.playerId),
        status: player.isReady
      })
    });
    return data;
  }

  isDisconnectedPlayer(playerId) {
    let player;
    return player = this.players.find(v => v.playerId == playerId) && !player.isConnected ? true : false;
  }

  isEveryoneReady() {
    if (this.players.length != this.maxPlayers) return false;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].playerId != this.hostPlayerId && !this.players[i].isReady) return false;
    }
    return true;
  }

  startGame() {
    this.started = true;
    this.socketHandler.sendAll(this.roomCode, 'hide-room-modal');
    this.startRound();
  }

  startRound() {
    // hide everything in UI
    this.socketHandler.sendAll(this.roomCode, 'hide-everything');
    // choosing who will play first
    if (this.winners.length == 0) { // if it's the first round
      this.currentPlayer = this.players[parseInt(Math.random() * this.players.length)].playerId;
    } else {
      this.currentPlayer = this.winners[this.winners.length - 1];
    }

    // shuffling all 16 cards and putting them in the current deck
    this.currentDeck = this.shuffle([1,1,1,1,1,2,2,3,3,4,4,5,5,6,7,8]);
    // putting one card aside (already it is in the dismissedCards as 0)
    this.currentDeck.splice(parseInt(Math.random() * this.currentDeck.length), 1);
    // if we have only 2 players, then put 3 more cards aside
    if (this.maxPlayers == 2) {
      for (let i = 0; i < 3; i++) {
        this.dismissedCards.push(this.currentDeck.splice(parseInt(Math.random() * this.currentDeck.length), 1)[0]);
      }
    }

    // give everyone one card
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].cardsInHand[0] = this.currentDeck.splice(parseInt(Math.random() * this.currentDeck.length), 1)[0];
    }

    this.socketHandler.sendAllMessage(this.roomCode, {
      from: 'SERVER',
      message: `round ${this.winners.length + 1} will begin in 10 seconds!`
    });
    
    // send the game info (hearts, nicknames, cards)
    this.sendGameDataIndividually();
    // show everything
    this.socketHandler.sendAll(this.roomCode, 'show-everything');

    // start the round in 10 seconds
    setTimeout(() => {
      // TODO handle bug if smn leaves before the round starts in these 10 seconds
      this.socketHandler.sendAllMessage(this.roomCode, {
        from: 'SERVER',
        message: `round ${this.winners.length + 1} begins`
      });
      this.turn();
      // let the current player play
      this.inGame = true;
    }, 10000);
    // TODO handle bug if smn leaves before the round starts in these 10 seconds
    // countdown
    setTimeout(() => {
      this.socketHandler.sendAllMessage(this.roomCode, {
        from: 'SERVER',
        message: `3`
      });
    }, 7000);
    setTimeout(() => {
      this.socketHandler.sendAllMessage(this.roomCode, {
        from: 'SERVER',
        message: `2`
      });
    }, 8000);
    setTimeout(() => {
      this.socketHandler.sendAllMessage(this.roomCode, {
        from: 'SERVER',
        message: `1`
      });
    }, 9000);
  }

  sendGameDataIndividually() {
    for (let i = 0; i < this.players.length; i++) {
      let gamedata = {
        maxTokens: this.maxTokens,
        deck: {
          cardsDismissed: this.dismissedCards,
          cardsInDeck: this.currentDeck.length,
          cardsPlayed: this.playedCards
        },

        playerBottom: {
          nickname: this.players[i].nickname,
          tokens: this.getPlayerTokens(this.players[i].playerId),
          card: this.players[i].cardsInHand[0]
        },
        playerTop: null,
        playerRight: null,
        playerLeft: null
      };
      let otherPlayers = this.players.filter(v => v.playerId != this.players[i].playerId);
      // top player
      if (otherPlayers.length >= 1) {
        gamedata.playerTop = {
          nickname: otherPlayers[0].nickname,
          tokens: this.getPlayerTokens(otherPlayers[0].playerId)
        };
      }
      // left player
      if (otherPlayers.length >= 2) {
        gamedata.playerLeft = {
          nickname: otherPlayers[1].nickname,
          tokens: this.getPlayerTokens(otherPlayers[1].playerId)
        };
      }
      // right player
      if (otherPlayers.length == 3) {
        gamedata.playerRight = {
          nickname: otherPlayers[2].nickname,
          tokens: this.getPlayerTokens(otherPlayers[2].playerId)
        };
      }
      this.socketHandler.sendIndividual(this.players[i].playerId, 'update-game-data', gamedata);
    }
  }

  // player's turn
  turn() {
    // is player connected?
    if (!this.players.find(v => v.playerId == this.currentPlayer).isConnected) {
      this.nextPlayer();
      this.turn();
      return;
    }

    // say who's turn it is
    this.socketHandler.sendAllMessage(this.roomCode, {
      from: 'SERVER',
      message: `${this.players.find(v => v.playerId == this.currentPlayer).nickname}'s turn`
    });
    // give the current player another card
    let card;
    this.players.find(v => v.playerId == this.currentPlayer).cardsInHand.push(card = this.currentDeck.splice(parseInt(Math.random() * this.currentDeck.length), 1)[0]);
    // show the cards update
    // current player
    this.socketHandler.sendIndividual(this.currentPlayer, 'new-card-self', card);
    // other players
    let currentPlayerIndex = this.players.map(v => v.playerId).indexOf(this.currentPlayer);
    if (this.players.length == 2) {
      if (currentPlayerIndex == 0) {
        this.socketHandler.sendIndividual(this.players[1].playerId, 'new-card-other', 'TOP');
      } else if (currentPlayerIndex == 1) {
        this.socketHandler.sendIndividual(this.players[0].playerId, 'new-card-other', 'TOP');
      }
    } else if (this.players.length == 3) {
      if (currentPlayerIndex == 0) {
        this.socketHandler.sendIndividual(this.players[1].playerId, 'new-card-other', 'TOP');
        this.socketHandler.sendIndividual(this.players[2].playerId, 'new-card-other', 'TOP');
      } else if (currentPlayerIndex == 1) {
        this.socketHandler.sendIndividual(this.players[0].playerId, 'new-card-other', 'TOP');
        this.socketHandler.sendIndividual(this.players[2].playerId, 'new-card-other', 'LEFT');
      } else if (currentPlayerIndex == 2) {
        this.socketHandler.sendIndividual(this.players[1].playerId, 'new-card-other', 'LEFT');
        this.socketHandler.sendIndividual(this.players[0].playerId, 'new-card-other', 'LEFT');
      }
    } else if (this.players.length == 4) {
      if (currentPlayerIndex == 0) {
        this.socketHandler.sendIndividual(this.players[1].playerId, 'new-card-other', 'TOP');
        this.socketHandler.sendIndividual(this.players[2].playerId, 'new-card-other', 'TOP');
        this.socketHandler.sendIndividual(this.players[3].playerId, 'new-card-other', 'TOP');
      } else if (currentPlayerIndex == 1) {
        this.socketHandler.sendIndividual(this.players[0].playerId, 'new-card-other', 'TOP');
        this.socketHandler.sendIndividual(this.players[2].playerId, 'new-card-other', 'LEFT');
        this.socketHandler.sendIndividual(this.players[3].playerId, 'new-card-other', 'LEFT');
      } else if (currentPlayerIndex == 2) {
        this.socketHandler.sendIndividual(this.players[0].playerId, 'new-card-other', 'LEFT');
        this.socketHandler.sendIndividual(this.players[1].playerId, 'new-card-other', 'LEFT');
        this.socketHandler.sendIndividual(this.players[3].playerId, 'new-card-other', 'RIGHT');
      } else if (currentPlayerIndex == 3) {
        this.socketHandler.sendIndividual(this.players[0].playerId, 'new-card-other', 'RIGHT');
        this.socketHandler.sendIndividual(this.players[1].playerId, 'new-card-other', 'RIGHT');
        this.socketHandler.sendIndividual(this.players[2].playerId, 'new-card-other', 'RIGHT');
      }
    }
  }

  nextPlayer() {
    this.currentPlayer = this.players.indexOf(v => v.playerId == this.currentPlayer).playerId;
  }

  handleChatAction(playerId, cardIndex) {
    // is it the current player?
    if (playerId == this.currentPlayer && this.started && this.inGame) {
      // does that player have a card at that index?
      let card = this.players.find(v => v.playerId == playerId).cardsInHand[cardIndex];
      if (card) {
        this.handleCard(playerId, card);
      } else {
        // send a message
        this.socketHandler.sendIndividual(playerId, 'chat-message', {
          from: 'SERVER',
          message: 'are you a cheater?'
        });
      }
    } else {
      // send a message
      this.socketHandler.sendIndividual(playerId, 'chat-message', {
        from: 'SERVER',
        message: 'wait for your turn'
      });
    }
  }

  handleCard(playerId, card) {
    if (card == 1) {

    } else if (card == 2) {

    } else if (card == 3) {
      if (this.maxPlayers == 2) {

      } else {
        this.socketHandler.sendIndividual(playerId, 'action-window', {
          action: 'CHOOSE-PLAYER',
          // players: 
        });
      }
    } else if (card == 4) {

    } else if (card == 5) {

    } else if (card == 6) {

    } else if (card == 7) {

    } else if (card == 8) {

    }
  }
}
