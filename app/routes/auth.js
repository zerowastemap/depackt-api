/**
 * Auth router
 * @file auth.js
 * @author Augustin Godiscal
 */

// Module dependencies

import {login, logout} from '../controllers/auth'

/**
 * @function
 * @param {Object} router
 */

export default (router) => {
  router
    .route('/login')
    .post(login)

  router
    .route('/logout')
    .post(logout)
}
