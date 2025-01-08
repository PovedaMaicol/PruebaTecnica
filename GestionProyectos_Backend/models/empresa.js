const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const empresaSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  city: {
    type: String, 
    minLength: 4,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  historias: [{  type: mongoose.Schema.Types.ObjectId, ref: 'Historia' }]
})

empresaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Empresa', empresaSchema)