const PaymentDates = require('./payment-dates');
const Payment = require('./payment');

const timeZone = 'Europe/London';
const months = 12;
const mockedData = [
  {
    name: 'base',
    description: 'Last day of each month. If weekend, Friday before.',
    allowedDays: [1, 2, 3, 4, 5],
    allowedMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    fallback: '-5',
  },
  {
    name: 'bonus',
    description: 'Day 15th of each month. If weekend, next Wednesday.',
    allowedDays: [1, 2, 3, 4, 5],
    allowedMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    fallback: '+3',
  },
  {
    name: 'base',
    description: 'Last day of each month. If weekend, Friday before.',
    allowedDays: [1, 2, 3, 4, 5],
    allowedMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    fallback: '-5',
  },
];

describe('payment dates object', () => {
  it('constructor array, no duplicated names', () => {
    expect.assertions(2);

    const paymentDates = new PaymentDates(mockedData, months, timeZone);

    expect(paymentDates.getPayments()).toHaveLength(2);
    expect(paymentDates.length()).toBe(2);
  });

  it('constructor array, equal to Payment("base")', () => {
    expect.assertions(2);

    const paymentDates = new PaymentDates(mockedData, months, timeZone);

    const payment = paymentDates.getPayment('base')[0];
    const expected = new Payment(mockedData.filter((itm) => itm.name === 'base')[0]);

    expect(paymentDates.getPayment('base')).toHaveLength(1);
    expect(payment.equal(expected)).toBe(true);
  });

  it('constructor array, equal to Payment("bonus")', () => {
    expect.assertions(2);

    const paymentDates = new PaymentDates(mockedData, months, timeZone);

    const payment = paymentDates.getPayment('bonus')[0];
    const expected = new Payment(mockedData.filter((itm) => itm.name === 'bonus')[0]);

    expect(paymentDates.getPayment('bonus')).toHaveLength(1);
    expect(payment.equal(expected)).toBe(true);
  });

  it('constructor object base', () => {
    expect.assertions(2);

    const baseObj = mockedData.filter((itm) => itm.name === 'base')[0];
    const paymentDates = new PaymentDates(baseObj, months, timeZone);
    const expected = new Payment(baseObj);

    expect(paymentDates.getPayments()).toHaveLength(1);
    expect(paymentDates.getPayment('base')[0].equal(expected)).toBe(true);
  });

  it('constructor object bonus', () => {
    expect.assertions(2);

    const baseObj = mockedData.filter((itm) => itm.name === 'bonus')[0];
    const paymentDates = new PaymentDates(baseObj, months, timeZone);
    const expected = new Payment(baseObj);

    expect(paymentDates.getPayments()).toHaveLength(1);
    expect(paymentDates.getPayment('bonus')[0].equal(expected)).toBe(true);
  });

  it('constructor without months and timezone', () => {
    expect.assertions(2);

    const paymentDates = new PaymentDates(mockedData, months);

    expect(paymentDates.getMonths()).toBe(12);
    expect(paymentDates.getTimezone()).toBe('Europe/London');
  });

  it('constructor without timezone', () => {
    expect.hasAssertions();

    const paymentDates = new PaymentDates(mockedData, months);

    expect(paymentDates.getTimezone()).toBe('Europe/London');
  });

  it('add payment', () => {
    expect.assertions(3);

    const baseObj = mockedData.filter((itm) => itm.name === 'base')[0];
    const paymentDates = new PaymentDates(baseObj, months, timeZone);

    const bonusObj = mockedData.filter((itm) => itm.name === 'bonus')[0];
    paymentDates.addPayment(bonusObj);

    expect(paymentDates.getPayments()).toHaveLength(2);
    expect(paymentDates.getPayment('base')).toHaveLength(1);
    expect(paymentDates.getPayment('bonus')).toHaveLength(1);
  });

  it('add payment, name unique', () => {
    expect.assertions(2);

    const paymentDates = new PaymentDates(mockedData, months, timeZone);

    const baseObj = mockedData.filter((itm) => itm.name === 'base')[0];
    paymentDates.addPayment(baseObj);

    expect(paymentDates.getPayments()).toHaveLength(2);
    expect(paymentDates.getPayment('base')).toHaveLength(1);
  });

  it('remove payment', () => {
    expect.assertions(2);

    const paymentDates = new PaymentDates(mockedData, months, timeZone);

    paymentDates.removePayment('base');

    expect(paymentDates.getPayments()).toHaveLength(1);
    expect(paymentDates.getPayment('base')).toHaveLength(0);
  });
});
