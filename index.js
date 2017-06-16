'use strict'

require('dotenv').config() // Load environment variables into process.env

import {readFileSync} from 'fs'
import path from 'path'
import {log} from 'winston'
import {createServer} from 'spdy'
import express from 'express'
import helmet from 'helmet'

import database from './config/initializers/database'
import server from './config/initializers/server'
import routes from './config/initializers/routes'
import pkg from './package.json'
import './config/passport'

const app = express()

app.use(helmet())

const config = {
  db: {
    uri: process.env.DB_URI,
    host: process.env.DB_HOST
  },
  user: {
    username: process.env.APP_USER,
    password: process.env.APP_PASSWORD,
    email: process.env.APP_EMAIL
  }
}

database(config)

server(app, config)

/*
 * Load application routing
 */

routes(app)

const port = process.env.APP_PORT || 8080
const host = process.env.APP_HOST || '127.0.0.1'

/*
 * SSL options for spdy
 */

const options = {
  key: readFileSync(path.join(__dirname, 'server.key')),
  cert: readFileSync(path.join(__dirname, 'server.crt'))
}

createServer(options, app)
  .listen(port, host, (err) => {
    if (err) {
      console.error(err)
      return process.exit(1)
    }
    log('info', 'Depackt API is running', {
      port: port,
      version: pkg.version
    })
  })
