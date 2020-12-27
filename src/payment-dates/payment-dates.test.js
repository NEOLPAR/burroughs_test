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
    paymentDay: 0,
    fallback: '-5',
  },
  {
    name: 'bonus',
    description: 'Day 15th of each month. If weekend, next Wednesday.',
    allowedDays: [1, 2, 3, 4, 5],
    allowedMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    paymentDay: 15,
    fallback: '+3',
  },
  {
    name: 'base',
    description: 'Last day of each month. If weekend, Friday before.',
    allowedDays: [1, 2, 3, 4, 5],
    allowedMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    paymentDay: 0,
    fallback: '-5',
  },
];

describe('payment dates object', () => {
  it('get months', () => {
    expect.hasAssertions();

    const paymentDates = new PaymentDates(mockedData, months, timeZone);

    expect(paymentDates.getMonths()).toBe(months);
  });

  it('get timezone', () => {
    expect.hasAssertions();

    const paymentDates = new PaymentDates(mockedData, months, timeZone);

    expect(paymentDates.getTimezone()).toBe(timeZone);
  });

  it('get payments', () => {
    expect.hasAssertions();

    const paymentDates = new PaymentDates(mockedData, months, timeZone);
    const received = paymentDates.getPayments().map((itm) => itm.getName());
    const expected = ['base', 'bonus'];

    expect(received).toStrictEqual(expected);
  });

  it('get payments must be base', () => {
    expect.hasAssertions();

    const paymentDates = new PaymentDates(mockedData, months, timeZone);
    const received = paymentDates.getPayment('base').map((itm) => itm.getName());
    const expected = ['base'];

    expect(received).toStrictEqual(expected);
  });

  it('get payments must be bonus', () => {
    expect.hasAssertions();

    const paymentDates = new PaymentDates(mockedData, months, timeZone);
    const received = paymentDates.getPayment('bonus').map((itm) => itm.getName());
    const expected = ['bonus'];

    expect(received).toStrictEqual(expected);
  });

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

  describe('get payment dates, array multidimensional, headers on first row', () => {
    it('getting correct number of files', () => {
      expect.hasAssertions();

      const paymentDates = new PaymentDates(mockedData, months, timeZone);
      const received = paymentDates.getPaymentDates().length;
      const expected = 1 + months;

      expect(received).toStrictEqual(expected);
    });

    it('checking headers', () => {
      expect.hasAssertions();

      const paymentDates = new PaymentDates(mockedData, months, timeZone);
      const received = paymentDates.getPaymentDates()[0];
      const expected = ['base', 'bonus'];

      expect(received).toStrictEqual(expected);
    });

    it('checking specific date', () => {
      expect.hasAssertions();

      const paymentDates = new PaymentDates(mockedData, months, timeZone);
      const received = paymentDates.getPaymentDates(new Date(2019, 6, 29));
      const expected = [
        ['base', 'bonus'],
        ['31/07/2019', '15/07/2019'],
        ['30/08/2019', '15/08/2019'],
        ['30/09/2019', '18/09/2019'],
        ['31/10/2019', '15/10/2019'],
        ['29/11/2019', '15/11/2019'],
        ['31/12/2019', '18/12/2019'],
        ['31/01/2020', '15/01/2020'],
        ['28/02/2020', '19/02/2020'],
        ['31/03/2020', '18/03/2020'],
        ['30/04/2020', '15/04/2020'],
        ['29/05/2020', '15/05/2020'],
        ['30/06/2020', '15/06/2020'],
      ];
      expect(received).toStrictEqual(expected);
    });
  });
});
