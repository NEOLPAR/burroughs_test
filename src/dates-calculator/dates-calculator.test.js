const DatesCalculator = require('./index');

const mockedData = [
  {
    name: 'base',
    description: 'Last day of each month. If weekend, Friday before.',
    allowedDays: [1, 2, 3, 4, 5],
    allowedMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    fallback: '-5',
  },
  {
    name: 'bonus',
    description: 'Day 15th of each month. If weekend, next Wednesday.',
    allowedDays: [1, 2, 3, 4, 5],
    allowedMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    fallback: '+3',
  },
];
const setupDatesCalculator = () => {
  const objsArr = [];

  mockedData.forEach((itm) => {
    objsArr.push(new DatesCalculator(itm));
  });

  return objsArr;
};

describe.each([setupDatesCalculator()])('dates calculator module', (obj) => {
  describe(`testing ${obj.name} object`, () => {
    it('creation', () => {
      expect.hasAssertions();

      expect(obj).not.toBeUndefined();
    });

    it('name required', () => {
      expect.hasAssertions();
      const [baseObj, bonusObj] = setupDatesCalculator();

      expect(baseObj.name).toBe('base');
      expect(bonusObj.name).toBe('bonus');
    });

    it('allowed days between 1 and 7', () => {
      expect.hasAssertions();

      expect(obj.getAllowedDays()).toBeGreaterThanOrEqual(1).toBeLessThanOrEqual(7);
    });

    it('allowed months between 1 and 12', () => {
      expect.hasAssertions();

      expect(obj.getAllowedMonths()).toBeGreaterThanOrEqual(1).toBeLessThanOrEqual(12);
    });

    it('days and months must been integers', () => {
      expect.hasAssertions();

      [...obj.getAllowedDays(), ...obj.getAllowedMonths()].forEach((itm) => {
        expect(typeof itm).toBe('Number');
      });
    });
  });
});
