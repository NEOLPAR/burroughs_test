/* eslint-disable comma-dangle */
const Payment = require('./payment');

class PaymentDates {
  #months;

  #timezone;

  #paymentsArr = [];

  constructor(obj, months = 12, timezone = 'Europe/London') {
    this.#months = months >= 24 ? 24 : months;
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

  getPaymentDates = (
    month = new Date(),
    headers = new Set(),
    paymentDates = [],
    iteration = 0
  ) => {
    if (iteration >= this.#months) return [Array.from(headers), ...paymentDates];

    const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);

    let paymentsThisMonth = [];
    this.#paymentsArr.forEach((paymentItm) => {
      headers.add(paymentItm.getName());

      paymentsThisMonth = [
        ...paymentsThisMonth,
        paymentItm.getPaymentDate(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth())
      ];
    });

    return this.getPaymentDates(
      new Date(firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1)),
      headers,
      [...paymentDates, paymentsThisMonth],
      iteration + 1
    );
  };

  getMonths = () => this.#months;

  getTimezone = () => this.#timezone;

  length = () => this.#paymentsArr.length;
}

module.exports = PaymentDates;
