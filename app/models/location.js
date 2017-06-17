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

const emailValidator = validate({
  validator: 'isEmail',
  message: 'Please provide a valid email'
})

const urlValidator = validate({
  validator: 'isURL',
  passIfEmpty: true,
  message: 'Please provide a valid url'
})

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

const LocationSchema = new Schema({
  id: Number,
  title: {
    type: String,
    required: [true, 'Title is required']
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
  tags: [],
  address: {
    streetName: String,
    streetNumber: Number,
    zip: Number,
    country: String,
    countryCode: String,
    region: String,
    city: String,
    location: {
      lat: Number,
      lng: Number
    }
  },
  geometry: {
    location: {'type': {type: String, enum: 'Point', default: 'Point'}, coordinates: { type: [Number], default: [0, 0] }}
  },
  kind: String,
  cover: {
    width: String,
    height: String,
    src: {
      type: String,
      validate: isHttpsUrl
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

LocationSchema.plugin(autoIncrement.plugin, {
  model: 'Location',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

LocationSchema.index({'geometry.location': '2dsphere'})

export default mongoose.model('Location', LocationSchema)
