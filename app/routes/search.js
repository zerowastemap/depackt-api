/**
 * Search router
 * @file search.js
 * @author Augustin Godiscal
 */

'use strict'

import {query} from '../controllers/search'

/**
 * @function
 * @param {Object} router
 */

export default (router) => {
  router.param('q', (req, res, next, q) => {
    // do stuff
  })

  router
    .route('/queries/q?')
    .get(query)
}
