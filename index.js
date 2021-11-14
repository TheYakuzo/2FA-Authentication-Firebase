const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config')
const tokenRoutes = require('./routes/token-routes')

app.use(express.json())
app.use(cors());
app.use(bodyParser.json())

app.use('/2fa', tokenRoutes.routes)

app.listen(config.port, () => {
    console.log(`2FA Authentication Server is running on host ${config.host} on port ${config.port}...`)
    console.log(`Run on url ${config.url}`)
})