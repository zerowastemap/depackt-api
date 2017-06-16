/**
 * labels router
 * @file labels.js
 * @author Augustin Godiscal
 */

// Module dependencies

import {show, create, list} from '../controllers/locations'

/**
 * @function
 * @param {Object} router
 */

export default (router) => {
  router
    .route('/:id')
    .get(show)

  router
    .route('/')
    .post(create)
    .get(list)
}
