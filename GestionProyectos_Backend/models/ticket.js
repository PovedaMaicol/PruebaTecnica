const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: true 
  }
})

ticketSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Ticket', ticketSchema)
