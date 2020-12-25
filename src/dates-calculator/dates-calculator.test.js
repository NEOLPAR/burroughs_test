const DatesCalculatorClass = require('./index');

describe('dates calculator module', () => {
  it('object creation', () => {
    expect.hasAssertions();

    const datesCalculator = new DatesCalculatorClass();
    expect(datesCalculator).not.toBeUndefined();
  });
});
