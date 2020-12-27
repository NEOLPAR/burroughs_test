const Csv = require('./index');
const PaymentDates = require('../payment-dates/payment-dates');

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
    name: 'christmas',
    description: 'Last day of December. If weekend, Friday before.',
    allowedDays: [1, 2, 3, 4, 5],
    allowedMonths: [11],
    paymentDay: 0,
    fallback: '-5',
  },
];

describe('csv module', () => {
  it('generate', () => {
    expect.hasAssertions();

    const paymentDates = new PaymentDates(mockedData);
    const received = Csv.getCsv(paymentDates.getPaymentDates());
    const expected = `base,bonus,christmas
31/12/2020,15/12/2020,31/12/2020
29/01/2021,15/01/2021,""
26/02/2021,15/02/2021,""
31/03/2021,15/03/2021,""
30/04/2021,15/04/2021,""
31/05/2021,19/05/2021,""
30/06/2021,15/06/2021,""
30/07/2021,15/07/2021,""
31/08/2021,18/08/2021,""
30/09/2021,15/09/2021,""
29/10/2021,15/10/2021,""
30/11/2021,15/11/2021,""
`;
    expect(received).toStrictEqual(expected);
  });
});
