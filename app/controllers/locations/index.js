/**
  * Locations controller
  * @file index.js
  * @author Augustin Godiscal
  */

/**
  * Module dependencies
  */

import Location from '../../models/location'
import slug from 'slug'

/**
  * Find locations
  * using only [<longitude>, <latitude>] and distance in km
  * @name find
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const find = async (req, res, next) => {
  const { limit = 100, longitude = 4.351710, latitude = 50.850340, distanceKm = 50 } = req.query

  for (let n of [longitude, latitude, limit, distanceKm]) {
    if (isNaN(n)) return res.status(400).json({message: 'Parameter should be a valid number'})
  }

  const maxDistanceInMeters = distanceKm * 1000

  try {
    const locations = await Location
      .find({
        'address.location': {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $minDistance: 0,
            $maxDistance: maxDistanceInMeters
          }
        }
      })
      .select('-_id id slug title url email tags address kind cover featured')
      .limit(limit)

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
    return res.status(500).json({ status: 500, err })
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
  const { title, url, openingDate, email, tags, address, kind, featured = false } = req.body

  try {
    let location = await new Location({
      title,
      openingDate,
      url,
      email,
      tags,
      address,
      kind,
      featured
    })

    if (title) {
      location.slug = slug(title).toLowerCase()
    }

    location.save((err) => {
      if (err) {
        return res.json({ err })
      }
      return res.json(location)
    })
  } catch (err) {
    return res.status(500).json({ status: 500, err })
  }
}

/**
  * Update a location
  * @name update
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const update = async (req, res, next) => {
  const { id } = req.params

  try {
    let location = await Location.findOneAndUpdate({ id }, req.body, { upsert: true })
    return res.json({
      message: 'Location successfully updated',
      data: location
    })
  } catch (err) {
    return res.status(500).json({ status: 500, err })
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
