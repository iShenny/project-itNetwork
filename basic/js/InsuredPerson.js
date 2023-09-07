// Definovaná třída InsuredPerson
class InsuredPerson {

    // Konstruktor přebírá čtyři parametry a přiřazuje je k vlastnostem nového objektu.
    constructor(name, surname, age, phoneNumber) {
        this.name = name;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
        this.age = age;
    }

    // Metoda třídy, která převede informace o objektu na řetězec.
    toString() {
        return `${this.name} ${this.surname}, ${this.phoneNumber}, ${this.age}`;
    }
}