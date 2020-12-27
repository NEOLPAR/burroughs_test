module.exports = {
  exportCsv: false,
  months: 12,
  timeZone: 'Europe/London',
  payments: [
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
  ],
};
