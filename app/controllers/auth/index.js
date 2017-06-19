/**
 * Login controller
 * @file index.js
 * @author Augustin Godiscal
 */

import passport from 'passport'

/**
 * Authenticate user using passport local strategy
 * @name login
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */

export const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      return res.status(400).json({status: 400, 'message': 'Missing user infos'})
    }
    req.logIn(user, err => {
      if (err) return next(err)
      return res.json({'message': 'Logged successfully'})
    })
  })(req, res, next)
}

/**
 * Log out user
 * @name logout
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */

export const logout = (req, res, next) => {
  req.logout()
  res.json({'message': 'User successfully logged out'})
}

/**
 * Simple authorization token check
 * because normal auth is not ready
 * @name challenge
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */

export const challenge = (req, res, next) => {
  if (process.env.AUTH_TOKEN !== req.headers['auth-token']) {
    return res.status(401).json({status: 401, message: 'Not authorized', data: null})
  }
  next()
}
