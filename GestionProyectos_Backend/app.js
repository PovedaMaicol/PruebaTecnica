const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

const empresasRouter = require('./controllers/empresas')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

// Conexión a la base de datos de MongoDB
logger.info('connecting to', config.MONGODB_URI)
mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

// Middleware de autenticación y registro de peticiones
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/empresas', middleware.userExtractor, empresasRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Middlewares para manejo de errores y registros
app.use(middleware.requestLogger)
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
