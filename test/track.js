// Docs https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/

const expect = require('chai').expect

const Track = require('../app/models/track')

/** @test {Track} */
describe('validate track', function () {
  it('should be invalid if url is empty', function (done) {
    let track = new Track()

    track.validate(function (err) {
      expect(err.errors.url).to.exist
      done()
    })
  })

  it('should be invalid url', function (done) {
    let track = new Track({
      url: 'i am not an url'
    })

    track.validate(function (err) {
      expect(err.errors.url).to.exist
      done()
    })
  })

  it('should be a valid url', function (done) {
    let track = new Track({
      url: 'https://soundcloud.com/sweet-track'
    })

    track.validate(function (err) {
      expect(err).not.exist
      done()
    })
  })
})
