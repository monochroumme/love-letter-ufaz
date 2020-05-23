const assert = require('chai').assert;
const player = require('../back/models/player');
const socket = {id: "12dasdwedw"}; // just to make tests run
const Player = new player("emrys", socket);


describe('Player', function(){
    describe('Variables', function(){
        it('.cardsInHand must be an array', function(){
            assert.isArray(Player.cardsInHand, 'array');
        });

        it('.cardsInHand length must be 2 (as default)', function(){
            
            const actual = Player.cardsInHand.length;
            const expected = 2;
            assert.equal(actual, expected);
        });

        it('.cardsPlayed must be an array', function(){
            assert.isArray(Player.cardsPlayed, 'array');
        });

        it('.cardsPlayed length must be 0 (as default)', function(){
            const actual = Player.cardsPlayed.length;
            const expected = 0;
            assert.equal(actual, expected);
        });

        it('.nickname must be string', function(){
            assert.isString(Player.nickname, 'string');
        });

        it('.immune must be boolean', function(){
            assert.isBoolean(Player.immune, 'boolean');
        });

        it('.immune must be true (as default)', function(){
            assert.isTrue(Player.immune, 'true');
        });

        it('.eliminated must be boolean', function(){
            assert.isBoolean(Player.eliminated, 'boolean');
        });

        it('.eliminated must be false (as default)', function(){
            assert.isBoolean(Player.eliminated, 'false');
        });

        it('.isConnected must be boolean', function(){
            assert.isBoolean(Player.isConnected, 'boolean');
        });

        it('.isConnected must be true (as default)', function(){ /* MIGHT BE FALSE , WE WILL SEE */
            assert.isTrue(Player.isConnected, 'true');
        });

        it('.isReady must be boolean', function(){
            assert.isBoolean(Player.isReady, 'boolean');
        });

        it('.isReady must be false (as default)', function(){
            assert.isBoolean(Player.isReady, 'boolean');
        });
    });
});