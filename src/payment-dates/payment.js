class Payment {
  #name;

  #description;

  #allowedDays;

  #allowedMonths;

  #paymentDay;

  #fallback;

  constructor({ name, description, allowedDays, allowedMonths, paymentDay, fallback }) {
    this.#name = name;
    this.#description = description;
    this.#allowedDays = allowedDays;
    this.#allowedMonths = allowedMonths;
    this.#paymentDay = paymentDay;
    this.#fallback = fallback;
  }

  getName = () => this.#name;
  
  getDescription = () => this.#description;

  getAllowedDays = () => this.#allowedDays;

  getAllowedMonths = () => this.#allowedMonths;

  getPaymentDay = () => this.#paymentDay;

  getFallback = () => this.#fallback;

  equal = (obj) => this.#name === obj.getName()
                    && this.#allowedDays === obj.getAllowedDays()
                    && this.#allowedMonths === obj.getAllowedMonths()
                    && this.#fallback === obj.getFallback();

  getPaymentDayByMonth(year, month) {
    if (this.#allowedMonths.indexOf(month) === -1) return null;

    const maxDayOfMonth = new Date(year, month + 1, 0);
    if (this.#paymentDay === 0) month++;

    let paymentDate = new Date(year, month, this.#paymentDay);

    paymentDate = paymentDate > maxDayOfMonth ? maxDayOfMonth : paymentDate;

    if (this.#allowedDays.indexOf(paymentDate.getDay()) === -1) {
      paymentDate = this.getFallbackDate(paymentDate);
    }

    return paymentDate.getDate();
  }

  getFallbackDate = (date) => {
    const weekDay = parseInt([...this.#fallback][1]);

    if (this.#fallback.indexOf('+') !== -1) {
      date.setDate(date.getDate() + ((weekDay + 7 - date.getDay()) % 7));
    } else {
      date.setDate(date.getDate() - ((date.getDay() + (7 - weekDay)) % 7));
    }

    return new Date(date);
  }
}

module.exports = Payment;
