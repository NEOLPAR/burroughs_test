class DatesCalculator {
  name;

  description;

  #allowedDays;

  #allowedMonths;

  fallback;

  constructor({ name, description, allowedDays, allowedMonths, fallback }) {
    this.name = name;
    this.description = description;
    this.#allowedDays = allowedDays;
    this.#allowedMonths = allowedMonths;
    this.fallback = fallback;
  }
}

module.exports = DatesCalculator;
