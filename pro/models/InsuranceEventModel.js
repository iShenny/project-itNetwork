const mongoose = require('mongoose');

// Vytvoření schématu pro pojistnou událost
const insuranceEventSchema = new mongoose.Schema({
  date: { type: Date, required: true },  // Datum události
  eventType: { type: String, required: true },  // Typ události (např. požár)
  description: { type: String, required: true }  // Popis události
});

// Export modelu
module.exports = mongoose.model('InsuranceEvent', insuranceEventSchema);