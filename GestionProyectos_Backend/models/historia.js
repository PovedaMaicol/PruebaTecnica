const mongoose = require('mongoose')
const empresa = require('./empresa')

const historiaSchema = new mongoose.Schema({
    activity: {
        type: String,
        minLenght: 7,
        unique: true,
        required: true
   },
   empresaID: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Empresa',
       required: true
   },
   tickets: {
    type: [String],
    default: []
   }
})


module.exports = mongoose.model('Historia', historiaSchema)