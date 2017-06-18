/**
 * Server initialization
 * @file server.js
 * @author Augustin Godiscal
 */

// Module dependencies

import express from 'express'
import {urlencoded, json} from 'body-parser'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import session from 'express-session'
import path from 'path'
import passport from 'passport'
import connectMongo from 'connect-mongo'
import cors from 'cors'

const MongoStore = connectMongo(session)

export default (app, config) => {
  app.disable('x-powered-by')

  app.use(compress({
    filter: (req, res) => {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
    },
    threshold: 512
  }))

  app.use(logger('dev'))

  app.use(cookieParser())

  app.use(urlencoded({extended: true}))
  app.use(json({type: '*/*'}))

  app.use(express.static(path.join(__dirname, '../../public')))

  if (process.env.APP_ENV === 'development') {
    app.use(express.static(path.join(__dirname, '../../doc')))
  }

  app.set('views', path.join(__dirname, '../../app/views'))
  app.set('view engine', 'pug')

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    key: 'sid',
    store: new MongoStore({
      url: config.db.uri,
      collection: 'sessions'
    }),
    cookie: {
      httpOnly: true
    }
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use(cors())
}
