/* ---------- ---------- ----------
Funkce pro načtení všech pojištěných osob z API a zobrazení v tabulce.
---------- ---------- ---------- */ 
async function loadInsuredPeople() {
  try {
    const response = await fetch('http://localhost:3000/InsuredPersonModel');
    const data = await response.json();
    
    // Získání tbody elementu tabulky
    const tbody = document.getElementById('InsuredPersonTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";
    
    if (data.length === 0) {
      const row = tbody.insertRow();
      const cell = row.insertCell(0);
      cell.colSpan = 4;
      cell.textContent = "V tabulce se doposud nenachází žádná data.";
      cell.className = "no-data-message";
    } else {
      data.forEach(person => {
        const row = tbody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);

        cell1.textContent = `${person.name} ${person.surname}`;
        cell2.textContent = person.age;
        cell3.textContent = person.phoneNumber;

        cell4.className = "detail-cell";
        cell4.innerHTML = `<button class="detail-button" onclick="showPersonDetail('${person._id}')"><i class="fas fa-search"></i></button>`;
      
      // Přidání data-label atributů
      cell1.setAttribute('data-label', 'Jméno a Příjmení:');
      cell2.setAttribute('data-label', 'Věk:');
      cell3.setAttribute('data-label', 'Telefon:');
      cell4.setAttribute('data-label', '');
      });
    }
  } catch (error) {
    console.error("Nepodařilo se načíst data:", error);
  }
}
  
/* ---------- ---------- ----------
Funkce pro vytvoření nové pojištěné osoby.
---------- ---------- ---------- */ 
async function addInsuredPerson() {
  const name = document.getElementById('name').value;
  const surname = document.getElementById('surname').value;
  const age = document.getElementById('age').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const email = document.getElementById('email').value;
  const street = document.getElementById('street').value;
  const city = document.getElementById('city').value;
  const postalCode = document.getElementById('postalCode').value;

  // Validace formuláře pro vyplnění všech polí.
  const validationMessageElement = document.getElementById('validationMessage');

  if (!name || !surname || !age || !phoneNumber || !email || !street || !city || !postalCode) {
    validationMessageElement.textContent = "Prosím vyplňte všechna pole.";
    return;
  }
  
  validationMessageElement.textContent = "";

  // Odeslání dat na server.
  try {
    const response = await fetch("http://localhost:3000/InsuredPersonModel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          postalCode,
        },
      }),
    });

    const data = await response.json();
    if (data._id) {
      loadInsuredPeople();
    } else {
      console.error("Chyba při přidávání pojištěné osoby:", data);
    }
  } catch (error) {
    console.error("Nepodařilo se přidat pojištěnou osobu:", error);
  }
}

/* ---------- ---------- ----------
Funkce pro přesměrování uživatele na detail konkrétní pojištěné osoby.
---------- ---------- ---------- */ 
function showPersonDetail(id) {
  window.location.href = `insuredPersonDetail.html?id=${id}`;
}

/* ---------- ---------- ----------
Vždy na konec se načítá.
---------- ---------- ---------- */ 
// Načítací ikona.
document.getElementById("loadingIcon").style.display = "block";

// Simulace prodlevy.
setTimeout(async () => {
  try {
    loadInsuredPeople();
    document.getElementById("addButton").addEventListener("click", addInsuredPerson);
    
  } catch (error) {
    console.error('Nepodařilo se načíst detail pojištěné osoby:', error);
  }

  document.getElementById("loadingIcon").style.display = "none";

}, 1000);