/**
  * Locations controller
  * @file index.js
  * @author Augustin Godiscal
  */

/**
  * Module dependencies
  */

import Location from '../../models/location'

/**
  * Show a location
  * @name show
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const show = async (req, res, next) => {
  try {
    let location = await Location.findOne({id: req.params.id})

    if (location) {
      return res.json({
        status: 200,
        data: location
      })
    }

    return res.status(404).json({
      status: 404,
      message: 'Resource not found',
      data: null
    })
  } catch (err) {
    return next(err)
  }
}

/**
  * Remove a location
  * @name remove
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const remove = async (req, res, next) => {
  try {
    let location = await Location.findOne({
      id: req.params.id
    })

    if (location) {
      await location.remove()
      return res.json({
        message: 'Location successfully deleted',
        data: location
      })
    }
  } catch (err) {
    return next(err)
  }
}

/**
  * Add a location
  * @name add
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const create = async (req, res, next) => {
  try {
    let location = await new Location({
      url: req.body.url
    }).save()

    return res.json(location)
  } catch (err) {
    return next(err)
  }
}

/**
  * List locations
  * @name list
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const list = async (req, res, next) => {
  let limit = 100

  try {
    let locations = await Location.find().limit(limit)

    if (locations.length) {
      return res.json({
        status: 200,
        data: locations
      })
    }

    return res.status(404).json({
      status: 404,
      message: 'No locations found',
      data: null
    })
  } catch (err) {
    return next(err)
  }
}
