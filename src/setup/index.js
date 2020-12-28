const fs = require('fs');
const inquirer = require('inquirer');

class setupApp {
  static weekDays = ['Monday', 'Tuesday', 'Wedneday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  static months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  oldSettings;

  newSettings;

  static validateMonths = (value) => {
    const valid = !Number.isNaN(parseInt(value, 10)) && value >= 1 && value <= 24;

    return valid || 'Please enter a number between 1 and 24';
  };

  static validateStrings = (value, max) => {
    const regStr = new RegExp(`^[a-z ]{1,${max}}$`, 'g');
    const pass = value.match(regStr);

    return !!pass || `Please enter a valid name, allowed characters a-z, up to ${max} characters`;
  };

  static validateUnique = (value) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    this.oldSettings.payments.filter((itm) => itm.name === value).length === 0
    || 'This name is being used, please set a different name';

  static validatePaymentDay = (value) => {
    const valid = value === 'last' || value === 'first'
      || (!Number.isNaN(parseInt(value, 10)) && value >= 1 && value <= 31);

    return valid || 'Please enter "first", "last" or a number between 1 and 31';
  };

  static validateCheckboxes = (value) => {
    if (value.length < 1) {
      return 'You must choose at least one day.';
    }

    return true;
  }

  static init = (settings) => {
    this.oldSettings = settings;

    const questions = [
      {
        type: 'input',
        name: 'monthsInAdvance',
        message: 'How many months do you want to get between 1 and 24?',
        default: this.oldSettings.months,
        validate: this.validateMonths,
      },
      {
        type: 'list',
        name: 'exportFile',
        message: 'Do you want to export a .csv file?',
        default: this.oldSettings.exportCsv ? 'Yes' : 'No',
        choices: ['Yes', 'No'],
      },
      {
        type: 'list',
        name: 'paymentRules',
        message: 'Do you want to edit or add the payment rules?',
        default: 'No',
        choices: ['Yes', 'No'],
      },
    ];

    const answersFunction = async (answers) => {
      this.newSettings = {
        exportCsv: answers.exportFile === 'Yes',
        months: answers.monthsInAdvance,
        timeZone: 'Europe/London',
      };

      if (answers.paymentRules !== 'Yes') {
        this.newSettings.payments = this.oldSettings.payments;
      } else {
        await this.listPaymentRules();
      }

      await this.saveConfigFile();
    };

    this.newInquirer(questions, answersFunction);
  }

  static getPaymentNames = () => this.oldSettings.payments.map((itm) => itm.name);

  static listPaymentRules = async () => {
    const questions = [{
      type: 'list',
      name: 'listPayments',
      message: 'Please select a payment to modify or create a new one:',
      default: 'Add new payment',
      choices: [...this.getPaymentNames(), new inquirer.Separator(), 'Add new payment'],
    }];
    const answersFunction = async (answers) => {
      const payment = answers.listPayments !== 'Add new payment' ? answers.listPayments : null;
      const newPaymentRule = await this.addOrModifyPaymentRules(payment);

      this.newSettings.payments = [newPaymentRule,
        ...this.oldSettings.payments.filter((itm) => itm.name !== payment)];
    };

    await this.newInquirer(questions, answersFunction);
  }

  // eslint-disable-next-line arrow-body-style
  static getWeekDays = (weekDays = [1, 2, 3, 4, 5]) => {
    return weekDays.map((itm) => this.weekDays[(itm + 6) % 7]);
  };

  // eslint-disable-next-line arrow-body-style
  static getWeekDaysNumber = (weekDays = this.weekDays) => {
    return weekDays.map((itm) => ((this.weekDays.indexOf(itm) + 1 + 7) % 7));
  }

  // eslint-disable-next-line arrow-body-style
  static getMonths = (months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) => {
    return months.map((itm) => this.months[itm]);
  };

  // eslint-disable-next-line arrow-body-style
  static getMonthsNumber = (months = this.months) => {
    return months.map((itm) => this.months.indexOf(itm));
  }

  static getFallbackDay = (day = '-5') => {
    const fallbackDay = parseInt([...day][1], 10);

    return this.weekDays[(fallbackDay + 6) % 7];
  };

  static getFallbackSign = (sign = '-5') => {
    const fallbackSign = [...sign][0];

    return fallbackSign === '+' ? 'Following' : 'Previous';
  };

  static addOrModifyPaymentRules = async (choice) => {
    let newPaymentRule = this.oldSettings.payments.filter((itm) => itm.name === choice);
    // eslint-disable-next-line object-curly-newline
    newPaymentRule = newPaymentRule.length !== 0 ? newPaymentRule[0] : {};

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Payment rule name?(max 10)',
        default: newPaymentRule.name || '',
        validate: (value) => {
          const pass1 = this.validateStrings(value, 10);
          const pass2 = this.validateUnique(value);
          let pass = '';

          if (pass1 !== true) pass += `${pass1}`;
          if (pass2 !== true) pass += `${pass2}`;

          return pass === '' ? true : pass;
        },
        when: () => choice === null,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Payment rule name?(max 100)',
        default: newPaymentRule.description || '',
        validate: (value) => this.validateStrings(value, 100),
      },
      {
        type: 'checkbox',
        name: 'allowedMonths',
        message: 'Please select the months when the rule will be applied:',
        default: this.getMonths(newPaymentRule.allowedMonths),
        choices: this.months,
        validate: this.validateCheckboxes,
        pageSize: 12,
      },
      {
        type: 'input',
        name: 'paymentDay',
        message: 'Which day of the month is the payment day for this rule?(firs, last, 1-31)',
        default: newPaymentRule.paymentDay === 0 ? 'last'
          : (newPaymentRule.paymentDay === 1 ? 'first' : newPaymentRule.paymentDay) || 'last',
        validate: this.validatePaymentDay,
      },
      {
        type: 'checkbox',
        name: 'allowedDays',
        message: 'Please select the week days allowed for the payment day:',
        default: this.getWeekDays(newPaymentRule.allowedDays),
        choices: this.weekDays,
        validate: this.validateCheckboxes,
      },
      {
        type: 'list',
        name: 'fallbackSign',
        message: 'If the payment day fall in a not allowed week day. Should it be paid the previous or following week?',
        default: this.getFallbackSign(newPaymentRule.fallback),
        choices: ['Previous', 'Following'],
      },
      {
        type: 'list',
        name: 'fallbackDay',
        message: 'If the payment day fall in a not allowed week day. Which week day should be paid?',
        default: this.getFallbackDay(newPaymentRule.fallback),
        choices: this.weekDays,
      },
    ];
    const answersFunction = async (answers) => {
      let paymentDay = answers.paymentDay === 'last' ? 0 : answers.paymentDay;
      paymentDay = paymentDay === 'first' ? 1 : paymentDay;
      let fallback = answers.fallbackSign === 'Previous' ? '-' : '+';
      fallback += (this.weekDays.indexOf(answers.fallbackDay) + 1 + 7) % 7;

      newPaymentRule = {
        name: answers.name || newPaymentRule.name,
        description: answers.description,
        paymentDay,
        allowedDays: this.getWeekDaysNumber(answers.allowedDays),
        allowedMonths: this.getMonthsNumber(answers.allowedMonths),
        fallback,
      };

      return newPaymentRule;
    };

    return this.newInquirer(questions, answersFunction);
  }

  // eslint-disable-next-line consistent-return
  static saveConfigFile = async () => {
    const fileContent = `module.exports = ${JSON.stringify(this.newSettings)};`;

    try {
      fs.writeFile('./src/config/index.js', fileContent, (err) => err);
    } catch (err) {
      return err;
    }

    console.log('\nAll the settings has been saved.\n');
  };

  static newInquirer = (questions, answersFunction) => inquirer
    .prompt(questions).then(answersFunction);
}

module.exports = setupApp;
