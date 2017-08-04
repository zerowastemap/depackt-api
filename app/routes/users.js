/**
 * Users router
 * @file users.js
 * @author Augustin Godiscal
 */

// Module dependencies

import * as users from '../controllers/users'
import {challenge} from '../controllers/auth'

/**
 * @function
 * @param {Object} router
 */

export default (router) => {
  router.param('id', users.load)

  router.route('/:id')
    .get(challenge, users.show)
    .put(challenge, users.update)
    .delete(challenge, users.remove)

  router
    .route('/forgot')
    .post(challenge, users.forgotPassword)

  router
    .route('/desactivate')
    .put(challenge, users.deactivate)

  router
    .route('/')
    .get(challenge, users.list)
    .post(challenge, users.create)
}
