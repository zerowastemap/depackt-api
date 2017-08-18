/**
  * Locations controller
  * @file index.js
  * @author Augustin Godiscal
  */

/**
  * Module dependencies
  */

import {log} from 'winston'
import Location from '../../models/location'
import slug from 'slug'
import dataSet from '../../../public/data.json'
import cache from 'memory-cache'
import _ from 'lodash'

/**
  * List everything
  * @name list
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const list = async (req, res, next) => {
  try {
    const locations = await Location
      .find({})
      .select('slug cover active map title url email tags address kind cover featured')

    if (locations.length) {
      return res.json({data: locations})
    }

    return res.status(404).json({ status: 404, message: 'No locations found', data: [] })
  } catch (err) {
    return res.status(500).json({ status: 500, err })
  }
}

/**
  * Search locations using mongodb only
  * @name search
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const search = async (req, res, next) => {
  const { q = '', selection = 'supermarket grocery-store market webshop coop' } = req.query

  const query = q.split(/[\s,+]+/)

  const r = query.map((item) => {
    return '(' + _.escapeRegExp(item) + ')'
  }).join('|')

  const regex = {
    $regex: new RegExp(r, 'i')
  }

  try {
    const locations = await Location.find({
      active: true
    })
    .where('kind').in(selection.split(' '))
    .or([
      {
        'address.city': regex
      },
      {
        'title': regex
      },
      {
        'tags': regex
      }
    ])
    .select('slug cover title url tags address kind cover featured')

    return res.json({data: locations})
  } catch (err) {
    return res.status(500).json({ status: 500, err })
  }
}

/**
  * Search locations using elasticsearch
  * @name elasticsearch
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const elasticsearch = (req, res, next) => {
  const { q, selection } = req.query

  const query = {
    'bool': {
      'must': [
        {
          'multi_match': {
            'query': q,
            'fields': ['title', 'tags', 'address.zip', 'address.city', 'address.country'],
            'fuzziness': 'AUTO'
          }
        }
      ]
    }
  }

  if (selection) {
    let kinds = ['supermarket', 'market', 'grocery-store', 'webshop', 'event', 'association']
    let exclude = kinds.filter((item) => {
      if (!selection.split(' ').includes(item)) return item
    })
    query.bool.must.push({'terms': {'kind': selection.split(' ')}})

    query.bool['must_not'] = {
      'terms': { 'kind': exclude }
    }
  }

  Location.search(query, {
    hydrate: true,
    hydrateOptions: {
      select: 'slug cover title url tags address kind cover featured'
    }
  }, (err, results) => {
    if (err) return next(err)
    var data, i$, ref$, len$, item
    if (results.hits.total === 0 || results == null) {
      return res.status(404).json({status: 404, data: []})
    }
    data = []
    for (i$ = 0, len$ = (ref$ = results.hits.hits).length; i$ < len$; ++i$) {
      item = ref$[i$]
      data.push(item)
    }
    cache.put(q, data, 8.64e+7, (key, value) => {
      log('info', `Cached ${key}`)
    })
    return res.json({data})
  })
}

/**
  * Locate using only [<longitude>, <latitude>] and distance in km
  * where map = true
  * @name find
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const locate = async (req, res, next) => {
  const { limit = 100, latitude = 50.850340, longitude = 4.351710, distanceKm = 50 } = req.query
  const cached = cache.get(`${latitude}:${longitude}:${distanceKm}`)

  if (cached) return res.json({ cached: true, data: cached })

  for (let n of [latitude, longitude, limit, distanceKm]) {
    if (isNaN(n)) {
      return res.status(400).json({
        message: 'All parameters should be valid numbers'
      })
    }
  }

  const maxDistanceInMeters = distanceKm * 1000

  try {
    const locations = await Location
      .find({
        'geometry.location': {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $minDistance: 0,
            $maxDistance: maxDistanceInMeters
          }
        }
      })
      .where({map: true, active: true})
      .select('slug cover title url tags address kind cover featured')
      .limit(limit)

    if (locations.length) {
      cache.put(`${latitude}:${longitude}:${distanceKm}`, locations, 8.64e+7, (key, value) => {
        log('info', `Cached ${key}`)
      })

      return res.json({
        data: locations
      })
    }

    return res.status(404).json({ status: 404, message: 'No locations found', data: [] })
  } catch (err) {
    return res.status(500).json({ status: 500, err })
  }
}

/**
  * Add locations in bulk
  * @name bulk
  * @function
  * @param {Object} req
  * @param {Object} res
  * @param {Object} next
  */

export const bulk = async (req, res, next) => {
  const { payload = dataSet.data } = req.body

  try {
    // NOTE: Won't throw an error as long as majority of inserts succeeded
    let locations = await Location.insertMany(payload, { ordered: false })

    return res.json({data: locations})
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
  const {
    title,
    url,
    geometry,
    openingDate,
    email,
    tags,
    address,
    kind,
    featured = false
  } = req.body

  try {
    let location = await new Location({
      title,
      openingDate,
      url,
      email,
      geometry,
      tags,
      address,
      kind,
      featured
    })

    location.cover.src = `https://maps.depackt.be/assets/001.jpg`

    if (title) {
      location.slug = slug(title).toLowerCase()
    }

    location.save((err, location) => {
      if (err) return res.json({ err })
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
  const { title, email, address, url, tags, featured, kind, active, map } = req.body

  if (!address.location) {
    return res.status(400).json({
      status: 400,
      message: 'Address needs a location',
      data: null
    })
  }

  try {
    let location = await Location.findOneAndUpdate({ _id: id }, {
      title,
      email,
      address,
      url,
      tags,
      kind,
      featured,
      active,
      map
    }, { upsert: true })
    if (location) {
      return res.json({
        message: 'Location successfully updated',
        data: location
      })
    } else {
      res.status(404).json({status: 404, message: 'Not found', data: null})
    }
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
    } else {
      return res.status(404).json({status: 404, message: 'Not found', data: null})
    }
  } catch (err) {
    return next(err)
  }
}
