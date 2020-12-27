const config = require('./config');
const PaymentDates = require('./payment-dates/payment-dates');

const paymentDates = new PaymentDates(config.payments, config.monthsInAdvance, config.timeZone);

console.log(paymentDates.getPaymentDates());
console.log(paymentDates.getPaymentDates(new Date(2019, 6, 31)));
