// requires the modal and the chat

const playerBottomCard1 = document.querySelector('#player-bottom-card1'),
			playerBottomCard2 = document.querySelector('#player-bottom-card2'),
			playerBottomCard1Img = document.querySelector('#player-bottom-card1 img'),
			playerBottomCard2Img = document.querySelector('#player-bottom-card2 img'),
			playerBottomNickname = document.querySelector('#player-bottom-nickname'),
			playerBottomTokens = document.querySelector('#player-bottom-tokens'),

			playerTopCard1 = document.querySelector('#player-top-card1'),
			playerTopCard2 = document.querySelector('#player-top-card2'),
			playerTopNickname = document.querySelector('#player-top-nickname'),
			playerTopTokens = document.querySelector('#player-top-tokens'),

			playerLeftCard1 = document.querySelector('#player-left-card1'),
			playerLeftCard2 = document.querySelector('#player-left-card2'),
			playerLeftNickname = document.querySelector('#player-left-nickname'),
			playerLeftTokens = document.querySelector('#player-left-tokens'),

			playerRightCard1 = document.querySelector('#player-right-card1'),
			playerRightCard2 = document.querySelector('#player-right-card2'),
			playerRightNickname = document.querySelector('#player-right-nickname'),
			playerRightTokens = document.querySelector('#player-right-tokens'),

			deck = document.querySelector('.deck-center'),
			playedDeck = document.querySelector('.deck-right'),
			dismissedDeck = document.querySelector('.deck-left'),
			playerLeft = document.querySelector('#player-left'),
			playerRight = document.querySelector('#player-right');

let	playerBottomCard1Id = -1,
		playerBottomCard2Id = -1,
		playerTopCard1Exists = false,
		playerTopCard2Exists = false,
		playerLeftCard1Exists = false,
		playerLeftCard2Exists = false,
		playerRightCard1Exists = false,
		playerRightCard2Exists = false;

socket.on('hide-room-modal', data => {
	modal.classList.remove('active');
	setTimeout(() => {
		modal.style.display = 'none';
	}, 2100);
});

// hide everything except nicknames and tokens
socket.on('hide-everything', () => {
	document.querySelectorAll('.hidable').forEach(h => {
		h.classList.add('hidden');
	});
});

socket.on('show-everything', () => {
	setTimeout(() => {
		document.querySelectorAll('.hidable').forEach(h => {
			h.classList.remove('hidden');
		});
	}, 500)
});

socket.on('update-game-data', data => {
	// filling the deck
	deck.innerHTML = '';
	dismissedDeck.innerHTML = '';
	playedDeck.innerHTML = '';
	for (let i = 0; i < data.deck.cardsInDeck; i++) {
		let card = document.createElement('div'),
				img = document.createElement('img');
		card.classList.add('card');
		card.classList.add('hidable');
		card.classList.add('hidden');
		card.style.zIndex = i;
		img.src = 'pics/card-0.png';
		card.appendChild(img);
		deck.appendChild(card);
	}
	for (let i = 0; i < data.deck.cardsDismissed.length; i++) {
		let card = document.createElement('div'),
				img = document.createElement('img');
		card.classList.add('card');
		card.classList.add('hidable');
		card.classList.add('hidden');
		card.style.zIndex = data.deck.cardsDismissed.length - i;
		img.src = `pics/card-${data.deck.cardsDismissed[i]}.png`;
		card.appendChild(img);
		dismissedDeck.appendChild(card);
	}
	for (let i = 0; i < data.deck.cardsPlayed.length; i++) {
		let card = document.createElement('div'),
				img = document.createElement('img');
		card.classList.add('card');
		card.classList.add('hidable');
		card.classList.add('hidden');
		card.style.zIndex = i;
		img.src = `pics/card-${data.deck.cardsPlayed[i]}.png`;
		card.appendChild(img);
		playedDeck.appendChild(card);
	}

	// bottom player
	if (data.playerBottom) {
		playerBottomCard1.classList.remove('hidable');
		playerBottomCard2.classList.remove('hidable');
		playerBottomNickname.innerHTML = data.playerBottom.nickname;
		playerBottomCard1Img.src = `pics/card-${data.playerBottom.card}.png`;
		playerBottomCard1Id = data.playerBottom.card,
		setTimeout(() => {
			playerBottomCard1.classList.remove('hidden');
		}, 500);
		playerBottomTokens.innerHTML = '';
		for (let i = 0; i < data.maxTokens; i++) {
			let img = document.createElement('img');
			if (i < data.playerBottom.tokens)
				img.src = 'pics/token-filled.svg';
			else
				img.src = 'pics/token-unfilled.svg';
			playerBottomTokens.appendChild(img);
		}
	}

	// top player
	if (data.playerTop) {
		playerTopCard1.classList.remove('hidable');
		playerTopCard2.classList.remove('hidable');
		playerTopNickname.innerHTML = data.playerTop.nickname;
		playerTopCard1Exists = true;
		setTimeout(() => {
			playerTopCard1.classList.remove('hidden');
		}, 500);
		playerTopTokens.innerHTML = '';
		for (let i = 0; i < data.maxTokens; i++) {
			let img = document.createElement('img');
			if (i < data.playerTop.tokens)
				img.src = 'pics/token-filled.svg';
			else
				img.src = 'pics/token-unfilled.svg';
			playerTopTokens.appendChild(img);
		}
	}

	// left player
	if (data.playerLeft) {
		playerLeftCard1.classList.remove('hidable');
		playerLeftCard2.classList.remove('hidable');
		playerLeftNickname.innerHTML = data.playerLeft.nickname;
		playerLeftCard1Exists = true;
		setTimeout(() => {
			playerLeftCard1.classList.remove('hidden');
		}, 500);
		playerLeftTokens.innerHTML = '';
		for (let i = 0; i < data.maxTokens; i++) {
			let img = document.createElement('img');
			if (i < data.playerLeft.tokens)
				img.src = 'pics/token-filled.svg';
			else
				img.src = 'pics/token-unfilled.svg';
			playerLeftTokens.appendChild(img);
		}
	} else {
		playerLeft.style.display = 'none';
	}

	// right player
	if (data.playerRight) {
		playerRightCard1.classList.remove('hidable');
		playerRightCard2.classList.remove('hidable');
		playerRightNickname.innerHTML = data.playerRight.nickname;
		playerRightCard1Exists = true;
		setTimeout(() => {
			playerRightCard1.classList.remove('hidden');
		}, 500);
		playerRightTokens.innerHTML = '';
		for (let i = 0; i < data.maxTokens; i++) {
			let img = document.createElement('img');
			if (i < data.playerRight.tokens)
				img.src = 'pics/token-filled.svg';
			else
				img.src = 'pics/token-unfilled.svg';
			playerRightTokens.appendChild(img);
		}
	} else {
		playerRight.style.display = 'none';
	}
});

socket.on('new-card-self', cardId => {
	if (playerBottomCard1Id == -1) {
		playerBottomCard1Img.src = `pics/card-${cardId}.png`;
		playerBottomCard1Id = cardId;
		setTimeout(() => {
			playerBottomCard1.classList.remove('hidden');
		}, 1);
	} else if (playerBottomCard2Id == -1) {
		playerBottomCard2Img.src = `pics/card-${cardId}.png`;
		playerBottomCard2Id = cardId;
		setTimeout(() => {
			playerBottomCard2.classList.remove('hidden');
		}, 1);
	}
});

socket.on('new-card-other', side => {
	if (side == 'TOP') {
		if (!playerTopCard1Exists) {
			playerTopCard1Exists = true;
			playerTopCard1.classList.remove('hidden');
		} else if (!playerTopCard2Exists) {
			playerTopCard2Exists = true;
			playerTopCard2.classList.remove('hidden');
		} else {
			console.error('ERROR: something went wrong with obtaining a new card');
		}
	} else if (side == 'LEFT') {
		if (!playerLeftCard1Exists) {
			playerLeftCard1Exists = true;
			playerLeftCard1.classList.remove('hidden');
		} else if (!playerLeftCard2Exists) {
			playerLeftCard2Exists = true;
			playerLeftCard2.classList.remove('hidden');
		} else {
			console.error('ERROR: something went wrong with obtaining a new card');
		}
	} else if (side == 'RIGHT') {
		if (!playerRightCard1Exists) {
			playerRightCard1Exists = true;
			playerRightCard1.classList.remove('hidden');
		} else if (!playerRightCard2Exists) {
			playerRightCard2Exists = true;
			playerRightCard2.classList.remove('hidden');
		} else {
			console.error('ERROR: something went wrong with obtaining a new card');
		}
	}
});

// card1 and card2 buttons
playerBottomCard1.onclick = () => {
	
};
playerBottomCard2.onclick = () => {
	
};
