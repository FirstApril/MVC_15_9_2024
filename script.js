// script.js

class CowModel {
    constructor() {
        // Example cow data, 15 cows and 2 goats
        this.cows = [
            { id: "12345678", age_years: 5, age_months: 2, num_teats: 4 },
            { id: "23456789", age_years: 3, age_months: 8, num_teats: 4 },
            { id: "34567890", age_years: 6, age_months: 1, num_teats: 3 },
            { id: "45678901", age_years: 4, age_months: 11, num_teats: 4 },
            { id: "56789012", age_years: 2, age_months: 5, num_teats: 4 },
            { id: "67890123", age_years: 7, age_months: 3, num_teats: 3 },
            { id: "78901234", age_years: 5, age_months: 9, num_teats: 4 },
            { id: "89012345", age_years: 3, age_months: 0, num_teats: 4 },
            { id: "90123456", age_years: 6, age_months: 7, num_teats: 3 },
            { id: "87249391", age_years: 4, age_months: 4, num_teats: 4 },
            { id: "13579246", age_years: 2, age_months: 10, num_teats: 4 },
            { id: "24680135", age_years: 5, age_months: 6, num_teats: 3 },
            { id: "36912578", age_years: 3, age_months: 1, num_teats: 4 },
            { id: "48157290", age_years: 7, age_months: 8, num_teats: 4 },
            { id: "59263748", age_years: 4, age_months: 5, num_teats: 3 },
            { id: "87654321", age_years: null, age_months: null, num_teats: null }, // Goat
            { id: "98765432", age_years: null, age_months: null, num_teats: null }  // Goat
          ];
    }

    getAnimalById(cowId) {
        return this.cows.find(cow => cow.id === cowId) || null;
    }

    updateTeats(cowId, newTeats) {
        const cow = this.getAnimalById(cowId);
        if (cow) {
            cow.num_teats = newTeats;
        }
    }

    calculateMilkYield(cow) {
        if(cow.num_teats === 3) return null;
        if (cow.age_years !== null && cow.age_months !== null) {
            // Calculate milk yield based on age and number of teats
            const baseYield = cow.age_years + (cow.age_months / 12);
            const teatFactor = cow.num_teats / 4; // Max 4 teats
            return baseYield * teatFactor;
        }
        return 0;
    }
}

class CowController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Attach event listener to the button
        this.view.checkButton.addEventListener('click', () => this.checkAnimal());
        this.view.yieldMilkButton.addEventListener('click', () => this.yieldMilk());
        this.view.kickBackButton.addEventListener('click', () => this.kickBack());
    }

    checkAnimal() {
        const animalId = this.view.getAnimalIdInput();

        if (!this.isValidId(animalId)) {
            this.view.displayResult("Invalid ID. Must be 8 digits and not start with 0.");
            return;
        }

        const animal = this.model.getAnimalById(animalId);
        if (!animal) {
            this.view.displayResult(`No cow or goat found with ID: ${animalId}`);
            this.view.hideAnimalDetails();
            this.view.resetInput();
            return;
        }

        if (animal.num_teats === null) {
            this.view.displayResult("This is a goat! You can kick it back to the mountain.");
            this.view.showAnimalDetails(animal);
            this.view.showKickBackButton();
        } else {
            this.view.displayResult(`Cow with ID ${animalId} found.`);
            this.view.showAnimalDetails(animal);

            if (animal.num_teats === 4) {
                const milkYield = this.model.calculateMilkYield(animal);
                this.view.updateMilkYield(milkYield);
                this.view.showYieldMilkButton();
            } else if (animal.num_teats === 3) {
                if (Math.random() < 0.20) {
                    this.model.updateTeats(animalId, 4)
                }
                this.view.displayResult(`Cow with ID ${animalId} has 3 teats. Cannot be milked.`);
                this.view.hideAllButtons();
            }
        }
    }

    yieldMilk() {
        const animalId = this.view.getAnimalIdInput();
        const animal = this.model.getAnimalById(animalId);
        const milkYield = this.model.calculateMilkYield(animal);
        if (animal && animal.num_teats === 4) {
            
            this.view.displayResult(`Milk yielded: ${milkYield.toFixed(2)} liters.`);

            // Update teats count and milk yield display
            if (Math.random() < 0.05) {
                this.model.updateTeats(animalId, 3);
                this.view.displayResult(`Oops! Cow with ID ${animalId} lost a teat. Now has 3 teats.`);
            }

            this.view.updateMilkYield(this.model.calculateMilkYield(animal));
        } else {
            this.view.displayResult("Cannot yield milk. Ensure the cow has 4 teats.");
        }
        this.view.resetInput();
        this.view.hideAnimalDetails();
        this.view.hideAllButtons();
    }

    kickBack() {
        const animalId = this.view.getAnimalIdInput();
        this.view.displayResult(`Goat with ID ${animalId} has been kicked back to the mountain.`);
        this.view.resetInput();
        this.view.hideAnimalDetails();
        this.view.hideAllButtons();
    }

    isValidId(animalId) {
        return /^\d{8}$/.test(animalId) && animalId[0] !== '0';
    }
}

class CowView {
    constructor() {
        this.animalIdInput = document.getElementById('animalIdInput');
        this.checkButton = document.getElementById('checkButton');
        this.resultDiv = document.getElementById('result');
        this.animalDetailsDiv = document.getElementById('animalDetails');
        this.animalIdSpan = document.getElementById('animalId');
        this.animalAgeSpan = document.getElementById('animalAge');
        this.animalTeatsSpan = document.getElementById('animalTeats');
        this.animalMilkSpan = document.getElementById('animalMilk');
        this.yieldMilkButton = document.getElementById('yieldMilkButton');
        this.kickBackButton = document.getElementById('kickBackButton');
    }

    getAnimalIdInput() {
        return this.animalIdInput.value;
    }

    displayResult(message) {
        this.resultDiv.textContent = message;
    }

    showAnimalDetails(animal, milkYield = null) {
        this.animalIdSpan.textContent = animal.id;
        this.animalAgeSpan.textContent = animal.age_years !== null ? `${animal.age_years} years ${animal.age_months} months` : "N/A (Goat)";
        this.animalTeatsSpan.textContent = animal.num_teats !== null ? animal.num_teats : "N/A (Goat)";
        this.animalMilkSpan.textContent = milkYield !== null && animal.num_teats === 4 ? `${milkYield.toFixed(2)} liters` : "N/A";

        this.animalDetailsDiv.classList.remove('hidden');
    }

    hideAnimalDetails() {
        this.animalDetailsDiv.classList.add('hidden');
    }

    showYieldMilkButton() {
        this.yieldMilkButton.classList.remove('hidden');
        this.kickBackButton.classList.add('hidden');
    }

    showKickBackButton() {
        this.kickBackButton.classList.remove('hidden');
        this.yieldMilkButton.classList.add('hidden');
    }

    hideAllButtons() {
        this.yieldMilkButton.classList.add('hidden');
        this.kickBackButton.classList.add('hidden');
    }

    updateMilkYield(milkYield) {
        this.animalMilkSpan.textContent = milkYield !== null ? `${milkYield.toFixed(2)} liters` : "N/A";
    }

    resetInput() {
        this.animalIdInput.value = '';
    }
}

// Initialize the MVC components
document.addEventListener('DOMContentLoaded', () => {
    const model = new CowModel();
    const view = new CowView();
    new CowController(model, view);
});