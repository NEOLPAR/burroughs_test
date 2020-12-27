const fs = require('fs');
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
    const received = Csv.getCsv(paymentDates.getPaymentDates(new Date(2019, 6, 29)));
    const expected = `base,bonus,christmas
31/07/2019,15/07/2019,""
30/08/2019,15/08/2019,""
30/09/2019,18/09/2019,""
31/10/2019,15/10/2019,""
29/11/2019,15/11/2019,""
31/12/2019,18/12/2019,31/12/2019
31/01/2020,15/01/2020,""
28/02/2020,19/02/2020,""
31/03/2020,18/03/2020,""
30/04/2020,15/04/2020,""
29/05/2020,15/05/2020,""
30/06/2020,15/06/2020,""
`;
    expect(received).toStrictEqual(expected);
  });

  it('generate and export', async () => {
    expect.hasAssertions();

    const readFile = async (filePath) => new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(err);

        resolve(data.toString('utf8'));
      });
    });
    const paymentDates = new PaymentDates(mockedData);
    const filePath = await Csv.exportCsv(paymentDates.getPaymentDates(new Date(2019, 6, 29)));
    const expected = `base,bonus,christmas
31/07/2019,15/07/2019,""
30/08/2019,15/08/2019,""
30/09/2019,18/09/2019,""
31/10/2019,15/10/2019,""
29/11/2019,15/11/2019,""
31/12/2019,18/12/2019,31/12/2019
31/01/2020,15/01/2020,""
28/02/2020,19/02/2020,""
31/03/2020,18/03/2020,""
30/04/2020,15/04/2020,""
29/05/2020,15/05/2020,""
30/06/2020,15/06/2020,""
`;
    await expect(readFile(filePath)).resolves.toBe(expected);
    await fs.unlinkSync(filePath);
  });
});
