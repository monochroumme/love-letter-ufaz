const pics = require('../content/pics');

// testing
	// global
	let maxTokens = 7;

	// player bottom
	let card1 = pics.baron,
		card2 = pics.princess,
		username = 'monochroumme',
		tokens = 3;


exports.index = function(req, res, next){
    res.render('index', {
        pageTitle: 'Love Letter',
        maxTokens,
        playerBottom: {
	        card1,
	        card2,
	        username,
	        tokens
        },
        playerTop: {
        	card1: true,
        	card2: true,
        	username: 'ruf',
        	tokens: 5
        },
        playerRight: {
        	card1: true,
        	card2: true,
        	username: 'magic',
        	tokens: 0
        },
        playerLeft: {
        	card1: true,
        	card2: true,
        	username: 'covid',
        	tokens: 6
        },
        deck: {
        	cardsDismissed: [0, 1, 2],
        	cardsInDeck: 15,
        	cardsPlayed: [1, 5, 3, 6]
        }
    });
};

exports.room = function(req, res, next){
    res.render('index', {
        pageTitle: 'Love Letter - In Game',
        maxTokens,
        playerBottom: {
	        card1,
	        card2,
	        username,
	        tokens
        },
        playerTop: {
        	card1: true,
        	card2: true,
        	username: 'ruf',
        	tokens: 5
        },
        playerRight: {
        	card1: true,
        	card2: true,
        	username: 'magic',
        	tokens: 0
        },
        playerLeft: {
        	card1: true,
        	card2: true,
        	username: 'covid',
        	tokens: 6
        },
        deck: {
        	cardsDismissed: [0, 1, 2],
        	cardsInDeck: 15,
        	cardsPlayed: [1, 5, 3, 6]
        }
    });
};
