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

  getPaymentDates = (today = new Date()) => {
    let currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const headers = new Set();
    let paymentDates = [];

    for (let i = 0, len = this.#months; i < len; i++) {
      const payment = currentDate;
      let paymentDatesMonth = [];

      this.#paymentsArr.forEach((paymentItm) => {
        headers.add(paymentItm.getName());

        const paymentDate = paymentItm.getPaymentDate(payment.getFullYear(), payment.getMonth());
        paymentDatesMonth = [...paymentDatesMonth, paymentDate];
      });

      paymentDates = [...paymentDates, paymentDatesMonth];

      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }

    return [Array.from(headers), ...paymentDates];
  };

  getMonths = () => this.#months;

  getTimezone = () => this.#timezone;

  length = () => this.#paymentsArr.length;
}

module.exports = PaymentDates;
