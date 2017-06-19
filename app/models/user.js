/**
 * User mongoose model
 * @file user.js
 * @author Augustin Godiscal
 */

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema

mongoose.Promise = global.Promise // See http://mongoosejs.com/docs/promises.html

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  active: {
    type: Boolean,
    'default': false
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  strict: true
})

UserSchema.path('email').validate((email) => {
  return email.length
}, 'Email cannot be blank')

UserSchema.path('email').validate(function (email, fn) {
  const User = mongoose.model('User')

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

UserSchema.path('username').validate((username) => {
  return username.length
}, 'Username cannot be blank')

UserSchema.path('password').validate(function (password) {
  return password.length && this.password.length
}, 'Password cannot be blank')

UserSchema.pre('save', function (next) {
  var user = this
  var saltRounds = 14

  if (!user.isModified('password')) return next()

  bcrypt.hash(user.password, saltRounds, function (err, hash) {
    if (err) return next(err)
    user.password = hash
    next()
  })
})

/**
 * Methods
 */

UserSchema.methods = {

  /**
    * Compare password
    * @param {String} candidatePassword
    * @param {Function} cb
    * @this {Object} model
    * @api private
    */

  comparePassword (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return cb(err)
      cb(null, isMatch)
    })
  }
}

/**
 * Statics
 */

UserSchema.statics = {

  /**
    * Load
    * @param {Object} options
    * @param {Function} cb
    * @this {Object} model
    * @api private
    */

  load (options, cb) {
    const { id, select = 'id username email' } = options
    return this.findOne({ _id: id })
      .select(select)
      .exec(cb)
  }
}

export default mongoose.model('User', UserSchema)
