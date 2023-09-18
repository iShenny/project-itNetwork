/* ---------- ---------- ----------
Funkce pro načtení všech hodnot dané pojištěné osoby.
---------- ---------- ---------- */ 
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
  
// Asynchronní funkce pro načtení detailů pojištění z API.
  async function loadInsuredPersonDetail() {
    const id = getParameterByName('id'); // Získání ID z URL.
  
    try {
      const response = await fetch(`http://localhost:3000/InsuredPersonModel/${id}`);
      const data = await response.json();
      // Zobrazení dat na stránce.
      document.getElementById('fullName').textContent = `${data.name} ${data.surname}`;
      document.getElementById('age').textContent = data.age;
      document.getElementById('phoneNumber').textContent = data.phoneNumber;
      document.getElementById('email').textContent = data.email;
      document.getElementById('fullAddress').textContent = `${data.address.street}, ${data.address.city}, ${data.address.postalCode}`;

  
    } catch (error) {
      console.error('Nepodařilo se načíst detail pojištěné osoby:', error);
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
  
/* ---------- ---------- ----------
Funkce pro načtení všech pojištění, které daná osoba má.
---------- ---------- ---------- */ 
async function loadInsuranceDetails() {
  const id = getParameterByName('id'); // Získání ID z URL.
  
  try {
    const response = await fetch(`http://localhost:3000/InsuredPersonModel/${id}/Insurances`);
    const insurances = await response.json();

    // Získání tbody elementu tabulky
    const tbody = document.getElementById('insuranceTable').getElementsByTagName('tbody')[0];
    
    // Odstranění stávajících řádků z tbody
    tbody.innerHTML = '';

    // Přidání nových řádků do tbody
    insurances.forEach(insurance => {
      const row = tbody.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      const cell5 = row.insertCell(4);
      const cell6 = row.insertCell(5);

      cell1.innerHTML = insurance.type;
      cell2.innerHTML = insurance.subject;
      cell3.innerHTML = Number(insurance.amount).toLocaleString('cs-CZ') + " Kč";
      cell4.innerHTML = formatDate(insurance.validFrom);
      cell5.innerHTML = formatDate(insurance.validTo);
      
      cell6.className = "detail-cell";
      cell6.innerHTML = `<button class="detail-button" onclick="showInsuranceDetail('${insurance._id}')"><i class="fas fa-search"></i></button>`;

      // Přidání data-label atributů
      cell1.setAttribute('data-label', 'Typ pojištění:');
      cell2.setAttribute('data-label', 'Předmět pojištění:');
      cell3.setAttribute('data-label', 'Částka:');
      cell4.setAttribute('data-label', 'Platí od:');
      cell5.setAttribute('data-label', 'Platí do:');
      cell6.setAttribute('data-label', '');
    });
  } catch (error) {
    console.error('Nepodařilo se načíst detaily pojištění:', error);
  }
} 

  /* ---------- ---------- ----------
Funkce pro přidání nového pojištění k pojištěnci.
---------- ---------- ---------- */ 
async function addInsurance() {
  const id = getParameterByName('id'); // Získání ID pojištěnce z URL.
  
  // Načtení dat z formuláře
  const type = document.getElementById('insuranceType').value;
  const subject = document.getElementById('insuranceSubject').value;
  const amount = document.getElementById('insuranceAmount').value;
  const validFrom = document.getElementById('insuranceValidFrom').value;
  const validTo = document.getElementById('insuranceValidTo').value;

  // Validace formuláře pro vyplnění všech polí.
  const validationMessageElement = document.getElementById('validationMessage');

  if (!type || !subject || !amount || !validFrom || !validTo) {
    validationMessageElement.textContent = "Prosím vyplňte všechna pole.";
    return;
  }
  
  validationMessageElement.textContent = "";
  
  // Odeslání dat na server
  try {
    const response = await fetch(`http://localhost:3000/InsuredPersonModel/${id}/InsuranceModel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        subject,
        amount,
        validFrom,
        validTo,
      }),
    });

    const data = await response.json();
    if (data._id) {
      // Úspěšně přidáno, obnovit tabulku
      loadInsuranceDetails();
    } else {
      // Chyba při přidávání
      console.error('Chyba při přidávání pojištění:', data);
    }
  } catch (error) {
    console.error('Nepodařilo se přidat pojištění:', error);
  }
}

/* ---------- ---------- ----------
Funkce pro přesměrování uživatele na detail konkrétního pojištění.
---------- ---------- ---------- */ 
function showInsuranceDetail(id) {
  window.location.href = `insuranceDetail.html?id=${id}`;
}

/* ---------- ---------- ----------
Funkce pro úpravu pojištěnce.
---------- ---------- ---------- */ 
/* ---------- ---------- ----------
Načtení dat do modálního okna.
---------- ---------- ---------- */ 
async function loadExistingDataIntoModal() {
  const id = getParameterByName('id'); // Získání ID pojištěnce z URL.
  const response = await fetch(`http://localhost:3000/InsuredPersonModel/${id}`);
  const data = await response.json();
  
  // Naplnění formuláře existujícími daty
  document.getElementById('updateName').value = data.name;
  document.getElementById('updateSurname').value = data.surname;
  document.getElementById('updateAge').value = data.age;
  document.getElementById('updatePhoneNumber').value = data.phoneNumber;
  document.getElementById('updateEmail').value = data.email;
  document.getElementById('updateStreet').value = data.address.street;
  document.getElementById('updateCity').value = data.address.city;
  document.getElementById('updatePostalCode').value = data.address.postalCode;
}

/* ---------- ---------- ----------
Modální okno pro editaci.
---------- ---------- ---------- */ 
// Ovládání modálního okna pro úpravu pojištěnce
document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("updateModal");
  const openBtn = document.getElementById("updateInsuredPersonButton");
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
    updateInsuredPersonData(); // funkce, která se stará o aktualizaci dat
  });
});

/* ---------- ---------- ----------
Aktualizace dat pojištěnce skrze modální okno.
---------- ---------- ---------- */ 
async function updateInsuredPersonData() {
  const id = getParameterByName('id'); // Získání ID pojištěnce z URL.
  
  // Načtení dat z formuláře
  const name = document.getElementById('updateName').value;
  const surname = document.getElementById('updateSurname').value;
  const age = document.getElementById('updateAge').value;
  const phoneNumber = document.getElementById('updatePhoneNumber').value;
  const email = document.getElementById('updateEmail').value;
  const street = document.getElementById('updateStreet').value;
  const city = document.getElementById('updateCity').value;
  const postalCode = document.getElementById('updatePostalCode').value;
  
  // Odeslání dat na server
  try {
    const response = await fetch(`http://localhost:3000/InsuredPersonModel/${id}`, {
      method: 'PUT', // Použijeme metodu PUT pro aktualizaci
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        surname,
        age,
        phoneNumber,
        email,
        address: {
          street,
          city,
          postalCode
        },
      }),
    });
    
    const data = await response.json();
    if (data._id) {
      // Úspěšně aktualizováno, obnovit stránku
      loadInsuredPersonDetail();
      loadInsuranceDetails();
      // Zavření modálního okna
      document.getElementById("updateModal").style.display = "none";
    } else {
      // Chyba při aktualizaci
      console.error('Chyba při aktualizaci pojištěnce:', data);
    }
  } catch (error) {
    console.error('Nepodařilo se aktualizovat pojištěnce:', error);
  }
}

/* ---------- ---------- ----------
Smazání pojištěné osoby z API prostřednictvím dialogového okna.
---------- ---------- ---------- */ 
// Funkce, která se spustí, když klikneme na "Smazat pojištěnce".
async function deleteInsuredPerson() {
  const id = getParameterByName('id');  // Získáme ID pojištěnce z URL.

  // Zeptáme se, zda opravdu chceme smazat.
  const reallyDelete = window.confirm("Opravdu chcete smazat pojištěnce?");
  
  if (reallyDelete) {
    // Pošleme požadavek na server.
    const response = await fetch(`http://localhost:3000/InsuredPersonModel/${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      // Pokud vše proběhne v pořádku, přesměrujeme se na hlavní stránku.
      window.location.href = 'index.html';
    } else {
      // Pokud se něco pokazí, vypíšeme chybu.
      console.error('Nepodařilo se smazat pojištěnce');
    }
  }
}

// Přidá se funkce k tlačítku "Smazat pojištěnce".
document.addEventListener("DOMContentLoaded", function() {
  const deleteButton = document.getElementById("deleteInsuredPersonButton");
  deleteButton.addEventListener("click", deleteInsuredPerson);
});

/* ---------- ---------- ----------
Vždy na konec se načítá.
---------- ---------- ---------- */ 
// Načítací ikona.
document.getElementById("loadingIcon").style.display = "block";

// Simulace prodlevy.
setTimeout(async () => {
  try {
    loadInsuredPersonDetail();
    loadInsuranceDetails();
    document.getElementById("addInsuranceButton").addEventListener("click", addInsurance);

  } catch (error) {
    console.error('Nepodařilo se načíst detail pojištěné osoby:', error);
  }

  document.getElementById("loadingIcon").style.display = "none";

}, 1000);