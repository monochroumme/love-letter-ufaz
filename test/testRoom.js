const assert = require('chai').assert;
const room = require('../back/models/room');
const Room = new room(134,4);

describe('Room', function(){ 
    describe('Variables', function(){ // Room variables

        it('.inGame type must be boolean', function(){
            assert.isBoolean(Room.inGame, 'boolean');
        });

        it('.inGame must return false at first', function(){
            const expected = false;
            const actual = Room.inGame;

            assert.equal(actual, expected);
        });

        it('.players must be an array', function(){
            assert.isArray(Room.players, 'array');
        });

        it('.chat must be an array', function(){
            assert.isArray(Room.chat, 'array');
        });

        it('.chat length must be 0 (as default)', function(){
            const actual = Room.chat.length;
            const expected = 0;
            assert.equal(actual, expected);
        });

        it('.winners must be an array', function(){
            assert.isArray(Room.winners, 'array');
        });

        it('.winners length must be 0 (as default)', function(){
            const actual = Room.winners.length;
            const expected = 0;
            assert.equal(actual, expected);
        });

        it('.playedCards players must be an array', function(){
            assert.isArray(Room.playedCards, 'array');
        });

        it('.playedCards length must be 0 (as default)', function(){
            const actual = Room.playedCards.length;
            const expected = 0;
            assert.equal(actual, expected);
        });

        it('.currentDeck must be an array', function(){
            assert.isArray(Room.currentDeck, 'array');
        });

       it('.curentDeck length must be 0', function(){
            const actual = Room.currentDeck.length;
            const expected = 0;
            assert.equal(actual, expected);
       });

        it('.dismissedCards must be an array', function(){
            assert.isArray(Room.dismissedCards, 'array');
        }); 

        it('.dismissedCards length must be 1', function(){
            const expected = 1;
            const actual = Room.dismissedCards.length;

            assert.strictEqual(expected, actual); // checks value and data type
            assert.equal(expected, actual); // checks value
        });

        it('.maxPlayers = 4 => .maxTokens should be 4', function(){
            assert.equal(Room.maxTokens, 4);
        });

        it('.maxPlayers = 3 => .maxTokens should be 5', function(){
            const roomTest = new room(135, 3);
            const expected = 5;
            const actual = roomTest.maxTokens;

            assert.equal(actual, expected);
        });

        it('.maxPlayers = 2 => .maxTokens should be 7', function(){
            const roomTest2 = new room(136, 3);
            const expected = 5;
            const actual = roomTest2.maxTokens;

            assert.equal(actual, expected);
        });
        
    });

    describe('Methods', function(){
        it('.getPlayerTokens(playerId) should return a number', function(){
            assert.isNumber(Room.getPlayerTokens(291), 'integer');
        });

        it('.getPlayerTokens(playerId) should return 1', function(){
            Room.winners.push(32);
            Room.winners.push(53);
            assert.equal(Room.getPlayerTokens(32), 1);
            assert.notEqual(Room.getPlayerTokens(65), 1);
        });

        it('.getPlayerTokens(playerId) should return 0', function(){
            assert.equal(Room.getPlayerTokens(65), 0);
        });

        it('.getRoomModalData should return an object', function(){
            assert.isObject(Room.getRoomModalData(), 'object');
        });

        it('.isDisconnectedPlayer(playerId) should return boolean', function(){
            let playerId = 432;
            assert.isBoolean(Room.isDisconnectedPlayer(playerId), 'boolean');
        });
        
        it('.isEveryOneReady() should return boolean', function(){
            assert.isBoolean(Room.isEveryoneReady(), 'boolean');
        });

        it('.isEveryOneReady() should return false', function(){
            assert.isFalse(Room.isEveryoneReady(), 'false');
        });

        
    });

});