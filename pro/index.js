// Nahrání modulů express a mongoose.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Načtení vytvořených schémat ze složky models.
const InsuredPersonModel = require('./models/InsuredPersonModel');
const InsuranceModel = require('./models/InsuranceModel');
const InsuranceEventModel = require('./models/InsuranceEventModel');

// Inicializace express modulu.
const app = express();

// Povolení zpracování JSON dat.
app.use(express.json());

// Povolit CORS pro všechny domény.
app.use(cors());

// Definice koncového bodu.
const port = 3000;

// Vytvoření spojení s MongoDB.
mongoose.connect('mongodb://localhost:27017/InsuranceDatabase', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.log('Failed to connect to MongoDB', err);
});

/* ---------- INSURED PERSON ---------- */

// GET: Získání všech pojištěných osob.
app.get('/InsuredPersonModel', async (req, res) => {
  try {
    const insuredPeople = await InsuredPersonModel.find();
    res.json(insuredPeople);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Získání jedné pojištěné osoby podle ID.
app.get('/InsuredPersonModel/:id', async (req, res) => {
  try {
    const insuredPerson = await InsuredPersonModel.findById(req.params.id);
    if (insuredPerson == null) {
      return res.status(404).json({ message: 'Cannot find insured person' });
    }
    res.json(insuredPerson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Přidání nové pojištěné osoby.
app.post('/InsuredPersonModel', async (req, res) => {
  console.log(req.body);
  try {
    const newInsuredPerson = new InsuredPersonModel(req.body);
    const savedInsuredPerson = await newInsuredPerson.save();
    res.status(201).json(savedInsuredPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Aktualizace pojištěné osoby podle ID.
app.put('/InsuredPersonModel/:id', async (req, res) => {
  try {
    const updatedInsuredPerson = await InsuredPersonModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedInsuredPerson == null) {
      return res.status(404).json({ message: 'Cannot find insured person' });
    }
    res.json(updatedInsuredPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Odstranění pojištěné osoby podle ID.
app.delete('/InsuredPersonModel/:id', async (req, res) => {
  try {
    const insuredPerson = await InsuredPersonModel.findById(req.params.id).populate('insurances');
    if (insuredPerson == null) {
      return res.status(404).json({ message: 'Cannot find insured person' });
    }
    
    // Smazání všech pojistných událostí spojených s pojištěními této osoby
    for (const insurance of insuredPerson.insurances) {
      await InsuranceEventModel.deleteMany({ _id: { $in: insurance.events } });
    }

    // Smazání všech pojištění spojených s touto osobou
    await InsuranceModel.deleteMany({ _id: { $in: insuredPerson.insurances.map(ins => ins._id) } });
    
    // Smazání pojištěné osoby
    await InsuredPersonModel.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Insured person and all related insurances and events deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ---------- INSURANCE ---------- */

// POST: Přidání nového pojištění pro konkrétní pojištěnou osobu.
app.post('/InsuredPersonModel/:insuredPersonId/InsuranceModel', async (req, res) => {
  
  // Získá se ID pojištěné osoby.
  const insuredPersonId = req.params.insuredPersonId;

  try {
    const insuredPerson = await InsuredPersonModel.findById(insuredPersonId);
    if (!insuredPerson) {
      return res.status(404).json({ message: 'Insured Person not found' });
    }

    // Úprava dvou objektů. Jelikož je objekt Insurance uložen v poli Insurances u konkrétní pojištěné osoby, je nutné v tuto chvíli manipulovat se dvěma objekty.
    const newInsurance = new InsuranceModel(req.body);
    const savedInsurance = await newInsurance.save();
    insuredPerson.insurances.push(savedInsurance._id);
    await insuredPerson.save();

    res.status(201).json(savedInsurance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Získání všech pojištění pro konkrétního pojištěného
app.get('/InsuredPersonModel/:insuredPersonId/Insurances', async (req, res) => {
  const insuredPersonId = req.params.insuredPersonId;
  try {
    const insuredPerson = await InsuredPersonModel.findById(insuredPersonId).populate('insurances');
    if (!insuredPerson) {
      return res.status(404).json({ message: 'Insured Person not found' });
    }
    res.json(insuredPerson.insurances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET: Získání detailu jednoho konkrétního pojištění.
app.get('/InsuranceModel/:insuranceId', async (req, res) => {
  const insuranceId = req.params.insuranceId;
  try {
    const insurance = await InsuranceModel.findById(insuranceId);
    if (!insurance) {
      return res.status(404).json({ message: 'Insurance not found' });
    }
    res.json(insurance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Editace jednoho konkrétního pojištění.
app.put('/InsuranceModel/:insuranceId', async (req, res) => {
  const insuranceId = req.params.insuranceId;
  try {
    const updatedInsurance = await InsuranceModel.findByIdAndUpdate(insuranceId, req.body, { new: true });
    if (!updatedInsurance) {
      return res.status(404).json({ message: 'Insurance not found' });
    }
    res.json(updatedInsurance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Odstranění jednoho konkrétního pojištění.
app.delete('/InsuranceModel/:insuranceId', async (req, res) => {
  try {
    const insurance = await InsuranceModel.findById(req.params.insuranceId);
    if (insurance == null) {
      return res.status(404).json({ message: 'Cannot find insurance' });
    }

    // Smazání všech událostí spojených s tímto pojištěním
    await InsuranceEventModel.deleteMany({ _id: { $in: insurance.events } });

    // Smazání pojištění
    await InsuranceModel.findByIdAndDelete(req.params.insuranceId);
    
    res.json({ message: 'Insurance and all related events deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ---------- INSURANCE EVENT ---------- */

// POST: Přidání nové pojistné události k existujícímu pojištění.
app.post('/InsuranceModel/:insuranceId/InsuranceEventModel', async (req, res) => {
  
  // Získá se ID pojištění.
  const insuranceId = req.params.insuranceId;

  try {
    const insurance = await InsuranceModel.findById(insuranceId);
    if (!insurance) {
      return res.status(404).json({ message: 'Insurance not found' });
    }

    // Úprava dvou objektů. Jelikož je objekt InsuranceEvent uložen v poli events u konkrétního pojištění, je nutné v tuto chvíli manipulovat se dvěma objekty.
    const newInsuranceEvent = new InsuranceEventModel(req.body);
    const savedInsuranceEvent = await newInsuranceEvent.save();
    insurance.events.push(savedInsuranceEvent._id);
    await insurance.save();

    res.status(201).json(savedInsuranceEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET: Získání všech pojistných událostí pro konkrétní pojištění
app.get('/InsuranceModel/:insuranceId/InsuranceEvent', async (req, res) => {
  try {
    const insurance = await InsuranceModel.findById(req.params.insuranceId).populate('events');
    if (!insurance) return res.status(404).json({ message: 'Insurance not found' });
    res.json(insurance.events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Editace pojistné události
app.put('/InsuranceEventModel/:eventId', async (req, res) => {
  try {
    const updatedEvent = await InsuranceEventModel.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Smazání pojistné události
app.delete('/InsuranceEventModel/:eventId', async (req, res) => {
  try {
    const deletedEvent = await InsuranceEventModel.findByIdAndDelete(req.params.eventId);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json(deletedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* 
----------
---------- END -> END POINTS ----------
----------
*/

// ---------- VŽDY NA KONCI
// Spuštění serveru.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});