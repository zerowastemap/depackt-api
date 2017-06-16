/**
 * Routes initialization
 * @file routes.js
 * @author Augustin Godiscal
 */

/*
 * Module dependencies
 */

import express from 'express'
import requireDir from 'require-dir'
import _isNaN from 'lodash/isNaN'
import _parseInt from 'lodash/parseInt'

const routesPath = '../../app/routes/'
const routes = requireDir(routesPath)

export default (app) => {
  app.get('/:client_id?', (req, res, next) => {
    const clientId = req.query.client_id
    if (clientId) {
      console.log(clientId)
    }
    next()
  })

  app.param('id', function (req, res, next, id) {
    id = _parseInt(id)

    if (_isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: `Parameter 'id: ${id}' should be an integer`
      })
    }

    next()
  })

  /*
   * Initialize all routes
   */

  Object.keys(routes).forEach((routeName) => {
    var router = express.Router()

    require(routesPath + routeName)(router) // Initialize the route to add its functionality to router

    app.use('/' + routeName, router) // Add router to the speficied route name in the app
  })

  app.get('/', (req, res) => {
    res.render('api/index')
  })

  app.use('*', (req, res) => {
    res.redirect('/')
  })

  /*
   * Error handling
   */

  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500)
      res.render('500', {
        message: err.message,
        error: err
      })
    })
  }

  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('500', {
      message: err.message,
      error: {}
    })
  })
}
