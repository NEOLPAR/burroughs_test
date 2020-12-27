const config = require('./config');
const PaymentDates = require('./payment-dates/payment-dates');
const Csv = require('./csv');

const paymentDates = new PaymentDates(config.payments, config.monthsInAdvance, config.timeZone);

console.log(Csv.getCsv(paymentDates.getPaymentDates()));