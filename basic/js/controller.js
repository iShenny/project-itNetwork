// Vytvoří se prázdné pole.
let InsuredPeople = [];

// Funkce, která přidává novou pojištěnou osobu, prostřednictvím hodnot, načtených z .html formulářových polí.
function addInsuredPerson() {

    // Zde se zobrazí varovná zpráva.
    const validationMessage = document.getElementById("validationMessage");
    validationMessage.innerText = "";

    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const age = document.getElementById("age").value;

    // Validace vstupních polí .html formuláře.
    if (!name || !surname || !phoneNumber || !age) {
        validationMessage.innerText = "Všechna pole musí být vyplněna!";
        return;
    }

    // Vytvoří nový objekt InsuredPerson a přidá do tabulky.
    const newInsuredPerson = new InsuredPerson(name, surname, phoneNumber, age);
    InsuredPeople.push(newInsuredPerson);

    // Aktualizuje tabulku.
    updateTable();

    // Obnoví formulář pro nové zadání.
    document.getElementById("name").value = "";
    document.getElementById("surname").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("age").value = "";
}

// Funkce, která aktualizuje .html tabulku s InsuredPersonTable na základě obsahu pole InsuredPeople. 
function updateTable() {

    // Vyhledá v .html souboru tabulku a v elementu 'tbody' přidává nový řádek.
    const tbody = document.getElementById("InsuredPersonTable").getElementsByTagName("tbody")[0];

    // Smazání všech řádků v tbody.
    tbody.innerHTML = "";

    // Hláška o žádných datech v tabulce jako podmínka.
    if (InsuredPeople.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = "3";
        cell.className = "no-data-message";
        cell.innerHTML = "V tabulce se doposud nenachází žádná data.";
    } else {
        
        // Vytvoření nových řádků pro každou pojištěnou osobu.
        InsuredPeople.forEach(InsuredPerson => {
            const row = tbody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);

            cell1.innerHTML = `${InsuredPerson.name} ${InsuredPerson.surname}`;
            cell2.innerHTML = InsuredPerson.phoneNumber;
            cell3.innerHTML = InsuredPerson.age;
        });
    }
}

// Inicializace formuláře pro přidání pojištěnce.
document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.getElementById("addButton");
    addButton.addEventListener("click", addInsuredPerson);
});