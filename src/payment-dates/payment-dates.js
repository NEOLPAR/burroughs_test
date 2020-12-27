const Payment = require('./payment');

class PaymentDates {
  #months;

  #timezone;

  #paymentsArr = [];

  constructor(obj, months = 12, timezone = 'Europe/London') {
    this.#months = months;
    this.#timezone = timezone;

    if (Array.isArray(obj)) {
      obj.forEach((itm) => this.addPayment(itm));
    } else {
      this.addPayment(obj);
    }
  }
  
  #getIndex = (name) => this.#paymentsArr.find((itm) => itm.getName() === name);

  addPayment(obj) {
    if (!this.#getIndex(obj.name)) {
      this.#paymentsArr = [...this.#paymentsArr, new Payment(obj)];
    }
  }

  removePayment = (name) => {
    this.#paymentsArr = this.#paymentsArr.filter((itm) => itm.getName() !== name);
  }

  getPayment = (name) => this.#paymentsArr.filter((itm) => itm.getName() === name);

  getPayments = () => this.#paymentsArr;

  getMonths = () => this.#months;

  getTimezone = () => this.#timezone;

  length = () => this.#paymentsArr.length;
}

module.exports = PaymentDates;
