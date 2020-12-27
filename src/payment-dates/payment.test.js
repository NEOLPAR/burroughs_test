const { TestScheduler } = require('jest');
const { timeZone } = require('../config');
const Payment = require('./payment');

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
const setupPayment = () => {
  const objsArr = [];

  mockedData.forEach((itm) => {
    objsArr.push(new Payment(itm));
  });

  return objsArr;
};

describe.each([setupPayment()])('payment array', (obj) => {
  describe(`testing ${obj.getName()} object`, () => {
    it('constructor', () => {
      expect.hasAssertions();

      expect(obj).not.toBeUndefined();
    });

    it('allowed days between 1 and 7', () => {
      expect.assertions(2);

      expect(obj.getAllowedDays().length).toBeGreaterThanOrEqual(1);
      expect(obj.getAllowedDays().length).toBeLessThanOrEqual(7);
    });

    it('allowed months between 1 and 12', () => {
      expect.assertions(2);

      expect(obj.getAllowedMonths().length).toBeGreaterThanOrEqual(1);
      expect(obj.getAllowedDays().length).toBeLessThanOrEqual(12);
    });
  });
});

describe('payment object', () => {
  it('getName', () => {
    expect.assertions(2);
    const [baseObj, bonusObj] = setupPayment();

    expect(baseObj.getName()).toBe('base');
    expect(bonusObj.getName()).toBe('bonus');
  });

  it('getDescription', () => {
    expect.assertions(2);
    const [baseObj, bonusObj] = setupPayment();

    expect(baseObj.getDescription()).toBe('Last day of each month. If weekend, Friday before.');
    expect(bonusObj.getDescription()).toBe('Day 15th of each month. If weekend, next Wednesday.');
  });

  it('getPaymentDay', () => {
    expect.assertions(2);
    const [baseObj, bonusObj] = setupPayment();

    expect(baseObj.getPaymentDay()).toBe(0);
    expect(bonusObj.getPaymentDay()).toBe(15);
  });

  it('getFallback', () => {
    expect.assertions(2);
    const [baseObj, bonusObj] = setupPayment();

    expect(baseObj.getFallback()).toBe('-5');
    expect(bonusObj.getFallback()).toBe('+3');
  });

  it('getAllowedDays', () => {
    expect.assertions(2);
    const [baseObj, bonusObj] = setupPayment();
    const expected = [1, 2, 3, 4, 5];

    expect(baseObj.getAllowedDays()).toStrictEqual(expected);
    expect(bonusObj.getAllowedDays()).toStrictEqual(expected);
  });

  it('getAllowedMonths', () => {
    expect.assertions(2);
    const [baseObj, bonusObj] = setupPayment();
    const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    expect(baseObj.getAllowedMonths()).toStrictEqual(expected);
    expect(bonusObj.getAllowedMonths()).toStrictEqual(expected);
  });

  it('days must be integers', () => {
    expect.assertions(10);
    const [baseObj, bonusObj] = setupPayment();

    [...baseObj.getAllowedDays(), ...bonusObj.getAllowedDays()].forEach((itm) => {
      expect(typeof itm).toBe('number');
    });
  });

  it('months must be integers', () => {
    expect.assertions(24);
    const [baseObj, bonusObj] = setupPayment();

    [...baseObj.getAllowedMonths(), ...bonusObj.getAllowedMonths()].forEach((itm) => {
      expect(typeof itm).toBe('number');
    });
  });

  describe('payment dates', () => {
    expect.assertions(1);
    const [baseObj, bonusObj, christmas] = setupPayment();
    const today = new Date();

    describe('base object', () => {
      expect.hasAssertions();
      
      const getMonthDate = (year = today.getFullYear(), month = today.getMonth()) => {
        const newDate = new Date(year, month + 1, 0);
  
        // If last day of the month is allowed day, expect it.
        // If last day of the month is not allowed day, get previous Friday
        return baseObj.getAllowedDays().indexOf(newDate.getDay()) !== -1 ?
          newDate :
          new Date(newDate.setDate(newDate.getDate() - ((newDate.getDay() + (7 - 5)) % 7)));
      }

      it('current month', () => {
        expect.hasAssertions();

        const received = baseObj.getPaymentDayByMonth(today.getFullYear(), today.getMonth());
        const expected = getMonthDate();

        expect(received).toBe(expected.getDate());
      });

      describe('checking edges', () => {
        expect.hasAssertions();
  
        const lastDayCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        it('check the previous Friday for each day of the current month', () => {
          expect.assertions(lastDayCurrentMonth);
  
          for (let i = 1; i <= lastDayCurrentMonth; i++) {
            const newDate = new Date(today.getFullYear(), today.getMonth(), i);
            const received = baseObj.getFallbackDate(newDate);
  
            // Get the last Friday
            let expected = new Date(newDate.setDate(newDate.getDate() - ((newDate.getDay() + (7 - 5)) % 7)));
            
            expect(received.getDate()).toBe(expected.getDate());
          }
        });

        it('all 2020 months', () => {
          expect.assertions(12);
  
          for (let i = 0; i <= 11; i++) {
            const received = baseObj.getPaymentDayByMonth(2020, i);
            const expected = getMonthDate(2020, i);          
          
            expect(received).toBe(expected.getDate());
          }
        });
      });
    });

    describe('bonus object', () => {
      expect.hasAssertions();
      
      const getMonthDate = (year = today.getFullYear(), month = today.getMonth()) => {
        const newDate = new Date(year, month, 15);
  
        // If 15th day of the month is allowed day, expect it.
        // If 15th day of the month is not allowed day, get next Wednesday
        return bonusObj.getAllowedDays().indexOf(newDate.getDay()) !== -1 ?
          newDate :
          new Date(newDate.setDate(newDate.getDate() + ((3 + 7 - newDate.getDay()) % 7)));
      }

      it('current month', () => {
        expect.hasAssertions();

        const received = bonusObj.getPaymentDayByMonth(today.getFullYear(), today.getMonth());
        const expected = getMonthDate();

        expect(received).toBe(expected.getDate());
      });

      describe('checking edges', () => {
        expect.hasAssertions();
        
        const lastDayCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        it('check the next Wednesday for each day of the current month', () => {
          expect.assertions(lastDayCurrentMonth);

          for (let i = 1; i <= lastDayCurrentMonth; i++) {
            const newDate = new Date(today.getFullYear(), today.getMonth(), i);
            const received = bonusObj.getFallbackDate(newDate);

            // Get the next Wednesday
            let expected = new Date(newDate.setDate(newDate.getDate() + ((3 + 7 - newDate.getDay()) % 7)));
            
            expect(received.getDate()).toBe(expected.getDate());
          }
        });

        it('check 2020 months', () => {
          expect.assertions(12);

          for (let i = 0; i <= 11; i++) {
            const received = bonusObj.getPaymentDayByMonth(2020, i);
            const expected = getMonthDate(2020, i);          
          
            expect(received).toBe(expected.getDate());
          }
        });
      });
    });

    describe('christmas object', () => {
      expect.hasAssertions();
      
      const getMonthDate = (year = today.getFullYear(), month = today.getMonth()) => {
        const newDate = new Date(year, month + 1, 0);
  
        // If last day of the month is allowed day, expect it.
        // If last day of the month is not allowed day, get previous Friday
        return christmas.getAllowedDays().indexOf(newDate.getDay()) !== -1 ?
          newDate :
          new Date(newDate.setDate(newDate.getDate() - ((newDate.getDay() + (7 - 5)) % 7)));
      }

      it('december 2020 must work', () => {
        expect.hasAssertions();

        const december = new Date(2020,11,1);
        const received = christmas.getPaymentDayByMonth(december.getFullYear(), december.getMonth());
        const expected = getMonthDate();

        expect(received).toBe(expected.getDate(2020, 11));
      });

      
      it('check 2020 months all null but December', () => {
        expect.assertions(12);

        for (let month = 0; month <= 11; month++) {
          const received = christmas.getPaymentDayByMonth(2020, month);
          const expected = month !== 11 ? null : getMonthDate(2020, month).getDate();          

          if (expected === null)
            expect(received).toBeNull()
          else
            expect(received).toBe(expected);
        }
      });
    });
  });
});