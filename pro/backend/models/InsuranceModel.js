const mongoose = require('mongoose');

// Vytvoření schématu pro pojištění
const insuranceSchema = new mongoose.Schema({
  type: { type: String, required: true },  // Typ pojištění (např. pojištění bytu)
  subject: { type: String, required: true },  // Předmět pojištění (např. byt)
  amount: { type: Number, required: true },  // Částka v CZK
  validFrom: { type: Date, required: true },  // Platnost od
  validTo: { type: Date, required: true },  // Platnost do
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InsuranceEvent' }]  // Reference na pojistné události
});

// Export modelu
module.exports = mongoose.model('Insurance', insuranceSchema);