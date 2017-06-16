'use strict'

import LocalStrategy from 'passport-local'
import passport from 'passport'
import User from '../app/models/user'

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findOne({ id: id })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    let user = await User.findOne({ email: email })

    if (!user) return done(null, false, { message: 'Incorrect username.' })

    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err, false, { message: 'Error' }) }
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Incorrect password.' })
      }
    })
  } catch (err) {
    return done(err)
  }
}))
