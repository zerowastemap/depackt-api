/**
  * Users controller
  * @file users.js
  * @author Augustin Godiscal
  */

// Module dependencies.

import User from '../../models/user'
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
      .select('username email')
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

/**
  * Update one user
  * @name update
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const update = async (req, res, next) => {
  const { username, email } = req.body
  try {
    const user = await User.findOneAndUpdate({
      _id: req.params.id
    }, { username, email }, {
      upsert: true
    })

    if (user) {
      return res.json(user)
    } else {
      return res.status(404).json({message: 'Not found'})
    }
  } catch (err) {
    return next(err)
  }
}

/**
  * Deactivate one user
  * @name desactivate
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const deactivate = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await User.findOneAndUpdate({
      _id: id
    }, { active: false }, {
      upsert: true
    })

    if (user) {
      let { username, email, active } = user
      return res.json({data: { username, email, active }})
    } else {
      return res.status(404).json({message: 'Not found', desactivated: false})
    }
  } catch (err) {
    return next(err)
  }
}

/**
  * Remove one user
  * @name remove
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const remove = async (req, res, next) => {
  const { id } = req.params
  try {
    let user = await User.findOne({_id: id})

    if (user) {
      let { username, email } = user
      await user.remove()
      return res.json({ data: { username, email }, removed: true })
    } else {
      return res.status(404).json({message: 'Not found', removed: false})
    }
  } catch (err) {
    return next(err)
  }
}
