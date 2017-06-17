/**
 * labels router
 * @file labels.js
 * @author Augustin Godiscal
 */

// Module dependencies

import {create, find, update, remove} from '../controllers/locations'

/**
 * @function
 * @param {Object} router
 */

export default (router) => {
  router
    .route('/:id')
    .put(update)
    .delete(remove)

  router
    .route('/')
    .post(create)
    .get(find)
}
