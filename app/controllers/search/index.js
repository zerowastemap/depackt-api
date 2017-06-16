/**
  * Search controller
  * @file search.js
  * @author Augustin Godiscal
  */

// Module dependencies

import Track from '../../models/track'

/**
  * Simple query
  * @name query
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const query = async (req, res, next) => {
  try {
    let query = await Track.find({
      title: req.query.q
    })

    return res.json(query)
  } catch (err) {
    return next(err)
  }
}
