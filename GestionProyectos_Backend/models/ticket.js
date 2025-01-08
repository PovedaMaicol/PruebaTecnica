const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: String,
    estado: { type: String, enum: ['activo', 'en proceso', 'finalizado'], default: 'activo' },
    historiaID: { type: mongoose.Schema.Types.ObjectId, ref: 'Historia', required: true },
    historial: [
      {
        estado: { type: String, enum: ['activo', 'en proceso', 'finalizado'] },
        fecha: { type: Date, default: Date.now },
      },
    ],
  });
  module.exports = mongoose.model('Ticket', ticketSchema);
  