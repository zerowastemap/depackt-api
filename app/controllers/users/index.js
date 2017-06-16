/**
  * Users controller
  * @file users.js
  * @author Augustin Godiscal
  */

// Module dependencies.

import User from '../../models/user'

import _isNaN from 'lodash/isNaN'
import _parseInt from 'lodash/parseInt'
import crypto from 'crypto-promise'

/**
  * Load user
  * @name load
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  * @param {Number} id
  */

export const load = async (req, res, next, id) => {
  id = _parseInt(id)

  if (_isNaN(id)) {
    return res.status(400).json({
      status: 400,
      message: `Parameter 'id' should be an integer`
    })
  }

  try {
    req.profile = await User.load({ id })
  } catch (err) {
    return next(err)
  }
  next()
}

/**
  * Get user by id
  * @name show
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const show = async (req, res, next) => {
  const { id } = req.params

  try {
    const user = await User.load({ id })

    return res.json({
      data: user
    })
  } catch (err) {
    return next(err)
  }
}

/**
  * Generate a token for password reset
  * @name forgotPassword
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const forgotPassword = async (req, res, next) => {
  const {email} = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'No account with that email address exists.'
      })
    }

    const rand = await crypto.randomBytes(20)

    user.resetPasswordToken = rand.toString('hex')
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

    await user.save()
  } catch (err) {
    return next(err)
  }
}

/**
  * Create a new user
  * @name create
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const create = async (req, res, next) => {
  const {username, email, password} = req.body

  try {
    const user = new User({
      username,
      email,
      password
    })

    await user.save()

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email
    })
  } catch (err) {
    return next(err)
  }
}

/**
  * List all users
  * @name list
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const list = async (req, res, next) => {
  const { active = true, limit = 100 } = req.query

  try {
    const users = await User
      .find({ active })
      .select('id username email')
      .limit(limit)

    if (users.length) {
      return res.json({
        status: 200,
        data: users
      })
    }

    return res.status(404)
      .json({
        status: 404,
        message: 'No users found',
        data: null
      })
  } catch (err) {
    return next(err)
  }
}
