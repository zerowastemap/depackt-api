/**
 * isAuthenticated middleware
 * @file isAuthenticated.js
 * @author Augustin Godiscal
 */

/**
 * Tell if user is authenticated
 * @name isAuthenticated
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */

export const isAuthenticated = (req, res, next) => {
  next()
}
