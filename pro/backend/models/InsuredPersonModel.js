const mongoose = require('mongoose');

// Vytvoření schématu pro pojištěnou osobu
const insuredPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Jméno
  surname: { type: String, required: true },  // Příjmení
  age: { type: Number, required: true },  // Věk
  phoneNumber: { type: String, required: true },  // Telefonní číslo
  email: { type: String, required: true },  // E-mail
  address: {
    street: { type: String, required: true },  // Ulice a číslo popisné
    city: { type: String, required: true },  // Město
    postalCode: { type: String, required: true },  // PSČ
  },
  insurances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Insurance' }]  // Reference na pojištění
});

// Export modelu
module.exports = mongoose.model('InsuredPerson', insuredPersonSchema);
