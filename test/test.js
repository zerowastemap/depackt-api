const assert = require('assert')
const sinon = require('sinon')
const should = require('should/as-function')
const Assertion = should.Assertion

/** @test {Array} */
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4))
    })
  })
})

Assertion.add('true', function () {
  this.is.exactly(true)
})

require('should-sinon')

it('should get number of calls', function () {
  var callback = sinon.spy()
  callback()
  callback.should.be.calledOnce()
})

should(5).be.exactly(5).and.be.a.Number()
