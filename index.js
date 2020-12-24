const cors = require('cors')
const express = require('express')
const fs = require('fs')
const { promisify } = require('util')

const writeFileAsync = promisify(fs.writeFile)

const app = express()
const http = require('http').Server(app)

const { DATABASE, PORT } = require('./config')

// Allow cross-domain requests
app.use(cors())

// Initialize body-parsing middleware
require('./middleware')(app)

// Initialize routing middleware
app.use('/api', require('./routes'))

// Error handling middleware
app.use((err, req, res) => {
  console.log('Request reached error handling', err)
  res.sendStatus(err.status || 500)
})

;(async function init() {
  // Initialize "database"
  await writeFileAsync(DATABASE, '[]')

  // Start express server
  http.listen(PORT, () =>
    console.log(`The server is listening closely on port ${PORT}...`)
  )
})()
