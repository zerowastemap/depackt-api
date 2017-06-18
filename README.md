# Depackt API version 1.0.0

This is depackt official API repo.

# Installation

    npm install

# Development

    npm start

  or with pm2

    pm2 start index.js --interpreter ./node_modules/.bin/babel-node --name depackt-api

# Stack

  - [node](https://nodejs.org)
  - [express](http://expressjs.com/)
  - [mongoose](http://mongoosejs.com/)

# Docs

[We use esdoc](https://esdoc.org/)

## API Docs

All requests requires client id.
Some requests requires auth (session cookie based)

### Headers
    DEPACKT_CLIENT_ID: xxx

### Endpoints

- GET /locations

  - Query params
    
        ?latitude=Number default:50.850340
        ?longitude=Number default:4.351710
        ?distanceKm=Number default:50
        ?limit=Number default:100

- GET /locations/:id

- POST /locations

  Example payload
    {
      "url": "http://terrabio.be",
      "email": "info@terrabio.be",
      "title": "Marché Bio des Tanneurs",
      "featured": true,
      "openingDate": "2017-05-17",
      "tags": [
        "bio",
        "coffee",
        "tea",
        "vegan",
        "cheese"
      ],
      "kind": "market",
      "geometry": {
        "location": {
          "coordinates": [4.3466364, 50.8398696]
        }
      },
      "address": {
        "streetName": "Rue des Tanneurs",
        "streetNumber": 60,
        "zip": "1000", 
        "country": "Belgique",
        "countryCode": "BE",
        "region": "Bruxelles Capitale",
        "city": "Bruxelles",
        "location": {
          "lat": 50.8398696,
          "lng": 4.3466364
        }
      }
    } 

  Notes

  "title" is required
  "geometry.location" is required (this is mongo 2dsphere Point) [longitude, latitude] !
  "address" is required

- DELETE /locations/:id

- PUT /locations/:id

- /locations/search/:query

  Search for 'vrac' returns

    {
      status: 200,
      data: [
        {
          ... 
        }
      ]
    }

#### Auth and user management

- POST /auth/login
- GET /auth/logout
- POST /auth/signup ==> /users

#### Requires auth and/or specific role

- POST /users
- GET /users
- PUT /users/:id
- DELETE /users/:id
- GET /users/:id

## run ESDoc
  
    esdoc

## See the documentation

    open ./doc/index.html

# Testing

    npm test

# License

Copyright 2017 Augustin Godiscal

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Contact

Augustin Godiscal <hello@depackt.be>
