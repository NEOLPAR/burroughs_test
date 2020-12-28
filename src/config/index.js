module.exports = {
  exportCsv: false,
  months: 12,
  timeZone: 'Europe/London',
  payments: [
    {
      name: 'base',
      description: 'last day of each month if weekend friday before',
      allowedDays: [1, 2, 3, 4, 5],
      allowedMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      paymentDay: 0,
      fallback: '-5',
    },
    {
      name: 'bonus',
      description: 'day fifteenth of each month if weekend next wednesday',
      allowedDays: [1, 2, 3, 4, 5],
      allowedMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      paymentDay: 15,
      fallback: '+3',
    },
    {
      name: 'christmas',
      description: 'last day of december if weekend friday before',
      allowedDays: [1, 2, 3, 4, 5],
      allowedMonths: [11],
      paymentDay: 0,
      fallback: '-5',
    },
  ],
};