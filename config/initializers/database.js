/**
 * Database initialization
 * @file database.js
 * @author Augustin Godiscal
 */

import mongoose from 'mongoose'
import { log } from 'winston'

import User from '../../app/models/user'

export default (config) => {
  'use strict'

  const options = {
    db: {
      native_parser: true
    },
    server: {
      poolSize: 5
    }
  }

  const { uri } = config.db

  mongoose.connect(uri, options, async (err) => {
    if (err) throw err

    try {
      let {username} = config.user
      let user = await User.findOne({ username })

      if (!user) {
        let {
          username = 'user',
          email = 'dev@auggod.io',
          password = 'secret',
          active = true
        } = config.user

        user = new User({
          username,
          email,
          password,
          active
        })

        await user.save()

        log('info', 'Created a default user')
      }
    } catch (err) {
      throw (err)
    }
  })

  mongoose.connection.on('connected', () => {
    log('info', `Mongoose default connection open to ${uri}`)
  })

  // If the connection throws an error
  mongoose.connection.on('error', (err) => {
    log('info', `Mongoose default connection error: ${err}`)
  })

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    log('info', 'Mongoose default connection disconnected')
  })

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      log('info', 'Mongoose default connection disconnected through app termination')
      process.exit(0)
    })
  })
}
