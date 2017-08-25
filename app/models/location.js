/**
 * Location mongoose model
 * @file Location.js
 * @author Augustin Godiscal
 */

import mongoose from 'mongoose'
import validate from 'mongoose-validator'
import mongoosastic from 'mongoosastic'

const Schema = mongoose.Schema

mongoose.Promise = global.Promise // See http://mongoosejs.com/docs/promises.html

/*
 * Validations
 */

const emailValidator = validate({
  validator: 'isEmail',
  passIfEmpty: true,
  message: 'Please provide a valid email'
})

const urlValidator = validate({
  validator: 'isURL',
  passIfEmpty: true,
  message: 'Please provide a valid url'
})

/*

const isHttpsUrl = validate({
  validator: 'matches',
  arguments: /(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/,
  message: 'Please provide a valid https url'
})

const isAlphaNumeric = validate({
  validator: 'isAlphanumeric',
  passIfEmpty: true,
  message: 'Should contain alpha-numeric characters only'
})

*/

const LocationSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    es_indexed: true,
    unique: true
  },
  slug: String,
  permalink: String,
  openingDate: Date,
  url: {
    type: String,
    validate: urlValidator
  },
  email: {
    type: String,
    validate: emailValidator
  },
  tags: {
    type: Array,
    es_indexed: true,
    default: ['bio']
  },
  address: {
    streetName: String,
    streetNumber: String,
    zip: {
      type: String,
      es_indexed: true
    },
    country: {
      type: String,
      es_indexed: true
    },
    countryCode: String,
    region: {
      type: String,
      es_indexed: true
    },
    province: {
      type: String,
      es_indexed: true
    },
    city: {
      type: String,
      es_indexed: true
    },
    location: {
      lat: Number,
      lng: Number
    }
  },
  formatted_address: {
    type: String,
    es_indexed: true
  },
  geometry: {
    location: {
      'type': {
        type: String,
        enum: 'Point',
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  kind: {
    type: String,
    enum: ['supermarket', 'grocery-store', 'market', 'webshop', 'event', 'association', 'coop'],
    required: true,
    es_indexed: true,
    default: 'market'
  },
  map: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    es_indexed: true,
    default: false
  },
  cover: {
    width: String,
    height: String,
    src: {
      type: String
    }
  },
  featured: {
    type: Boolean,
    'default': false
  },
  updatedAt: {
    type: Date,
    'default': Date.now
  },
  createdAt: {
    type: Date,
    'default': Date.now
  }
}, {
  strict: true
})

LocationSchema.index({'geometry.location': '2dsphere'})

/*
 * Elasticsearch
 */

LocationSchema.plugin(mongoosastic)

const Location = mongoose.model('Location', LocationSchema)

const stream = Location.synchronize()
let count = 0

stream.on('data', function (err, doc) {
  count++
})
stream.on('close', function () {
  console.log('indexed ' + count + ' documents!')
})
stream.on('error', function (err) {
  console.log(err)
})

Location.on('index', function (err) {
  if (err) {
    console.error('Location index error: %s', err)
  } else {
    console.info('Location indexing complete')
  }
})

export default Location
