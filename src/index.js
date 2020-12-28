const config = require('./config');
const PaymentDates = require('./payment-dates/payment-dates');
const Csv = require('./csv');
const SetupApp = require('./setup');

const args = process.argv.slice(2);

if (args.indexOf('--setup') !== -1) {
  SetupApp.init(config);
} else {
  const paymentDates = new PaymentDates(config.payments, config.monthsInAdvance, config.timeZone);
  const paymentDatesArr = paymentDates.getPaymentDates();

  // eslint-disable-next-line no-console
  console.log(Csv.getCsv(paymentDatesArr));

  if (config.exportCsv) {
    Csv.exportCsv(paymentDatesArr);
  }
}
