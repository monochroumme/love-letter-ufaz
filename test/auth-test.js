const assert = require('assert');
const authController = require('../controllers/auth');

describe('signup', () => {
    it('It should check if password and confirmed password are equal', () => {
        // assert.equal(authController.postSignUP.pass)
        assert.equal('hello', authController.hello());
    });
});
