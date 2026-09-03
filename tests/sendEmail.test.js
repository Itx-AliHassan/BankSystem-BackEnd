const test = require('node:test')
const assert = require('node:assert/strict')

const emailUtils = require('../src/utils/sendEmail')

test('email utility exposes a sender function', () => {
  assert.equal(typeof emailUtils.sendEmail, 'function')
  assert.equal(typeof emailUtils.sendWelcomeEmail, 'function')
})
