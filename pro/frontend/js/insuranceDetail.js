/* ---------- ---------- ----------
Funkce pro načtení všech hodnot daného pojištění.
---------- ---------- ---------- */ 
function getParameterByName(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Asynchronní funkce pro načtení detailů pojištění z API.
async function loadInsuranceDetail() {
  const insuranceId = getParameterByName('id'); // Získání ID z URL.

  try {
    const response = await fetch(`http://localhost:3000/InsuranceModel/${insuranceId}`);
    const data = await response.json();
    // Zobrazení dat na stránce.
    document.getElementById('type').textContent = data.type;
    document.getElementById('subject').textContent = data.subject;
    document.getElementById('amount').textContent = `${Number(data.amount).toLocaleString('cs-CZ')} Kč`;

    document.getElementById('validFrom').textContent = formatDate(data.validFrom);
    document.getElementById('validTo').textContent = formatDate(data.validTo);
    
    

  } catch (error) {
    console.error('Nepodařilo se načíst detail pojištění:', error);
  }
}

/* ---------- ---------- ----------
Funkce pro formát data.
---------- ---------- ---------- */ 
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Asynchronní funkce pro načtení pojistných událostí spojených s pojištěním.
async function loadInsuranceEvents() {
  const insuranceId = getParameterByName('id'); // Získání ID z URL.
  
  try {
    const response = await fetch(`http://localhost:3000/InsuranceModel/${insuranceId}/InsuranceEvent`);
    const events = await response.json();

    // Získání tbody elementu tabulky
    const tbody = document.getElementById('EventTable').getElementsByTagName('tbody')[0];
    
    // Odstranění stávajících řádků z tbody
    tbody.innerHTML = '';

    // Přidání nových řádků do tbody
    events.forEach(event => {
      const row = tbody.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);

      cell1.innerHTML = formatDate(event.date);
      cell2.innerHTML = event.eventType;
      cell3.innerHTML = event.description;

      // Přidání data-label atributů
      cell1.setAttribute('data-label', 'Datum:');
      cell2.setAttribute('data-label', 'Typ události:');
      cell3.setAttribute('data-label', 'Popis:');
    });

  } catch (error) {
    console.error('Nepodařilo se načíst pojistné události:', error);
  }
}

/* ---------- ---------- ----------
Funkce pro přidání nové pojistné události.
---------- ---------- ---------- */ 
async function addInsuranceEvent() {
  const insuranceId = getParameterByName('id'); // Získání ID pojištění z URL.
  
  // Načtení dat z formuláře
  const date = document.getElementById('date').value;
  const eventType = document.getElementById('eventType').value;
  const description = document.getElementById('description').value;

  // Validace formuláře pro vyplnění všech polí.
  const validationMessageElement = document.getElementById('validationMessage');

  if (!date || !eventType || !description) {
    validationMessageElement.textContent = "Prosím vyplňte všechna pole.";
    return;
  }
  
  validationMessageElement.textContent = "";
  
  // Odeslání dat na server
  try {
    const response = await fetch(`http://localhost:3000/InsuranceModel/${insuranceId}/InsuranceEventModel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        eventType,
        description,
      }),
    });

    const data = await response.json();
    if (data._id) {
      // Úspěšně přidáno, obnovit tabulku s pojistnými událostmi
      loadInsuranceEvents();
    } else {
      // Chyba při přidávání
      console.error('Chyba při přidávání pojistné události:', data);
    }
  } catch (error) {
    console.error('Nepodařilo se přidat pojistnou událost:', error);
  }
}



/* ---------- ---------- ----------
Funkce pro úpravu pojištěnce.
---------- ---------- ---------- */ 

/* ---------- ---------- ----------
Funkce pro převedení data za účelem zobrazení v modálním okně.
---------- ---------- ---------- */ 
function reformatDate(dateString) {
  const [day, month, year] = dateString.split('.');
  return `${year}-${month}-${day}`;
}

/* ---------- ---------- ----------
Načtení dat do modálního okna.
---------- ---------- ---------- */ 
async function loadExistingDataIntoModal() {
  const id = getParameterByName('id'); // Získání ID pojištěnce z URL.
  const response = await fetch(`http://localhost:3000/InsuranceModel/${id}`);
  const data = await response.json();
  
  // Naplnění formuláře existujícími daty
  document.getElementById('updateType').value = data.type;
  document.getElementById('updateSubject').value = data.subject;
  document.getElementById('updateAmount').value = data.amount;
  document.getElementById('updateValidFrom').value = reformatDate(formatDate(data.validFrom));
  document.getElementById('updateValidTo').value = reformatDate(formatDate(data.validTo));

}

/* ---------- ---------- ----------
Modální okno pro editaci.
---------- ---------- ---------- */ 
// Ovládání modálního okna pro úpravu pojištěnce
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("updateModal");
  const openBtn = document.getElementById("updateInsuranceButton");
  const closeBtn = document.getElementsByClassName("close")[0];
  const submitBtn = document.getElementById("submitUpdate");

  // Otevření modálního okna
  openBtn.addEventListener("click", function() {
    modal.style.display = "block";
    loadExistingDataIntoModal(); // funkce, která načte existující data do formuláře
  });

  // Zavření modálního okna
  closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
  });

  // Zavření modálního okna po kliknutí mimo něj
  window.addEventListener("click", function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Odeslání formuláře
  submitBtn.addEventListener("click", function() {
    updateInsuranceData(); // funkce, která se stará o aktualizaci dat
  });
});

/* ---------- ---------- ----------
Aktualizace dat pojištění skrze modální okno.
---------- ---------- ---------- */ 
async function updateInsuranceData() {
  const id = getParameterByName('id'); // Získání ID pojištění z URL.
  
  // Načtení dat z formuláře
  const type = document.getElementById('updateType').value;
  const subject = document.getElementById('updateSubject').value;
  const amount = document.getElementById('updateAmount').value;
  const validFrom = document.getElementById('updateValidFrom').value;
  const validTo = document.getElementById('updateValidTo').value;

  // Odeslání dat na server
  try {
    const response = await fetch(`http://localhost:3000/InsuranceModel/${id}`, {
      method: 'PUT', // Použijeme metodu PUT pro aktualizaci
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        subject,
        amount,
        validFrom,
        validTo
      }),
    });
    
    const data = await response.json();
    if (data._id) {
      // Úspěšně aktualizováno, obnovit stránku
      loadInsuranceDetail();
      loadInsuranceEvents();
      // Zavření modálního okna
      document.getElementById("updateModal").style.display = "none";
    } else {
      // Chyba při aktualizaci
      console.error('Chyba při aktualizaci pojištění:', data);
    }
  } catch (error) {
    console.error('Nepodařilo se aktualizovat pojištění:', error);
  }
}




/* ---------- ---------- ----------
Smazání pojištění z API prostřednictvím dialogového okna.
---------- ---------- ---------- */ 
// Funkce, která se spustí, když klikneme na "Smazat pojištění".
async function deleteInsurance() {
  const id = getParameterByName('id');  // Získáme ID pojištění z URL.

  // Zeptáme se, zda opravdu chceme smazat.
  const reallyDelete = window.confirm("Opravdu chcete smazat pojištění?");
  
  if (reallyDelete) {
    // Pošleme požadavek na server.
    const response = await fetch(`http://localhost:3000/InsuranceModel/${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      // Pokud vše proběhne v pořádku, přesměrujeme se na hlavní stránku.
      window.location.href = 'index.html';
    } else {
      // Pokud se něco pokazí, vypíšeme chybu.
      console.error('Nepodařilo se smazat pojištění');
    }
  }
}

// Přidá se funkce k tlačítku "Smazat pojištěnce".
document.addEventListener("DOMContentLoaded", function() {
  const deleteButton = document.getElementById("deleteInsuranceButton");
  deleteButton.addEventListener("click", deleteInsurance);
});

/* ---------- ---------- ----------
Vždy na konec se načítá.
---------- ---------- ---------- */ 
// Načítací ikona.
document.getElementById("loadingIcon").style.display = "block";

// Simulace prodlevy.
setTimeout(async () => {
  try {
    loadInsuranceDetail();
    loadInsuranceEvents();
    document.getElementById("addEventButton").addEventListener("click", addInsuranceEvent);

  } catch (error) {
    console.error('Nepodařilo se načíst detail pojištěné osoby:', error);
  }

  document.getElementById("loadingIcon").style.display = "none";

}, 1000);