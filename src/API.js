import fs from 'fs'
import path from 'path'
import express from 'express'
import cors from 'cors'
import https from 'https'
import bodyParser from 'body-parser'

import { onNewZalogRequest } from './services/onNewZalogRequest.js'
import { onNewInvestRequest } from './services/onNewInvestRequest.js'

import config from './global/config.js'
const { API_ROOT, PORT } = config

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  console.log("Online");
  res.json({ status: 'Online', port: PORT })
})

app.post('/zalog', onNewZalogRequest)
app.post('/invest', onNewInvestRequest)

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV.trim() === "development") {
  app.listen(PORT, () => {
    console.log(`API Server running locally at http://localhost:${PORT}...`)
  })
} else {
  const options = {
    key: fs.readFileSync(path.join(process.cwd(), './ssl/privkey.pem')),
    cert: fs.readFileSync(path.join(process.cwd(), './ssl/fullchain.pem'))
  }

  const server = https.createServer(options, app)

  server.listen(PORT, () => {
    console.log(`API Server running at ${API_ROOT} on port ${PORT}...`)
  })
}