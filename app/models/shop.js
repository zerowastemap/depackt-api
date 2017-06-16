/**
 * Location mongoose model
 * @file Location.js
 * @author Augustin Godiscal
 */

import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import validate from 'mongoose-validator'

const Schema = mongoose.Schema

mongoose.Promise = global.Promise // See http://mongoosejs.com/docs/promises.html

autoIncrement.initialize(mongoose)

/*
 * Validations
 */

const urlValidator = validate({
  validator: 'matches',
  arguments: /(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/,
  message: 'Please provide a valid https url'
})

const isAlphaNumeric = validate({
  validator: 'isAlphanumeric',
  passIfEmpty: true,
  message: 'Kind should contain alpha-numeric characters only'
})

const LocationSchema = new Schema({
  id: Number,
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    validate: urlValidator,
    required: true
  },
  email: {
    type: String
  },
  location: {
    name: String,
    zip: Number,
    city: String,
    region: String,
    country: String,
    coords: {
      lat: Number,
      long: Number
    }
  },
  locations: [{
    name: String,
    zip: Number,
    coords: {
      lat: Number,
      long: Number
    }
  }],
  cover: {
    type: String,
    validate: urlValidator
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

LocationSchema.plugin(autoIncrement.plugin, {
  model: 'Location',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

export default mongoose.model('Location', LocationSchema)
