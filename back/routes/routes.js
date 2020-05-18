const express = require('express');
const router = express.Router();
const cards = require('../content/cards');

router.get('/', function(req, res, next){
    res.render('index', {
        pageTitle: 'Love Letter',
        maxTokens: 7,
        playerBottom: {
	        card1: cards.baron,
	        card2: cards.princess,
	        nickname: 'monochroumme',
	        tokens: 3
        },
        playerTop: {
        	card1: true,
        	card2: true,
        	nickname: 'ruf',
        	tokens: 5
        },
        playerRight: {
        	card1: true,
        	card2: true,
        	nickname: 'magic',
        	tokens: 0
        },
        playerLeft: {
        	card1: true,
        	card2: true,
        	nickname: 'covid',
        	tokens: 6
        },
        deck: {
        	cardsDismissed: [0, 1, 2],
        	cardsInDeck: 15,
        	cardsPlayed: [1, 5, 3, 6]
        },
        room: false
    });
});

router.get('/:room', function(req, res, next) {
    res.render('index', {
        pageTitle: 'Love Letter - In Game',
        maxTokens: 7,
        playerBottom: {
            card1: cards.baron,
            card2: cards.princess,
            nickname: 'monochroumme',
            tokens: 3
        },
        playerTop: {
        	card1: true,
        	card2: true,
        	nickname: 'ruf',
        	tokens: 5
        },
        playerRight: {
        	card1: true,
        	card2: true,
        	nickname: 'magic',
        	tokens: 0
        },
        playerLeft: {
        	card1: true,
        	card2: true,
        	nickname: 'covid',
        	tokens: 6
        },
        deck: {
        	cardsDismissed: [0, 1, 2],
        	cardsInDeck: 15,
        	cardsPlayed: [1, 5, 3, 6]
        },
        room: true
    });
});

module.exports = router;
