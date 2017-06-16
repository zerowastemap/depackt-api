/**
 * Users router
 * @file users.js
 * @author Augustin Godiscal
 */

// Module dependencies

import * as users from '../controllers/users'

/**
 * @function
 * @param {Object} router
 */

export default (router) => {
  router.param('id', users.load)

  router.route('/:id')
    .get(users.show)

  router
    .route('/forgot')
    .post(users.forgotPassword)

  router
    .route('/')
    .post(users.create)
    .get(users.list)
}
