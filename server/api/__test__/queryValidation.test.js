import {
    toDefined,
    fromDefined,
    fromAndToMutuallyInclusive,
    getDate,
    rules,
    toIsAfterFrom,
    validFromDate,
    validLimit,
    validOrder,
    validToDate,
} from '../queryValidation';

describe('Query validation', () => {

    test('Knows when you have a "to" date defined', () => {
        expect(toDefined({ to: '2018-08-21T13:58:00Z' })).toBe(true);
        expect(toDefined({ random: 'gibberish' })).toBe(false);
    });

    test('Knows when you have a "from" date defined', () => {
        expect(fromDefined({ from: '2018-08-21T13:58:00Z' })).toBe(true);
        expect(fromDefined({ random: 'gibberish' })).toBe(false);
    });

    test('Will require neither or both the "from" and "to" dates', () => {
        expect(fromAndToMutuallyInclusive({ neither: 1 })).toBe(true);
        expect(fromAndToMutuallyInclusive({ from: '2018-08-21T13:58:00Z', to: '2018-08-21T13:58:00Z' })).toBe(true);
        expect(fromAndToMutuallyInclusive({ from: '2018-08-21T13:58:00Z' })).toBe(false);
        expect(fromAndToMutuallyInclusive({ to: '2018-08-21T13:58:00Z' })).toBe(false);
    });

    test('Will get a valid date', () => {
        expect(getDate('2018-08-21T13:58:00Z')).toEqual(expect.any(Date));
        expect(getDate('2018-08-21')).toEqual(expect.any(Date));
        expect(() => {
            getDate('something hideous')
        }).toThrow(/Invalid ISO 8601/);
    });

    test('Has good validation rules', () => {
        expect(rules.length).toEqual(6);
        expect(rules[0].test).toEqual(fromAndToMutuallyInclusive);
        expect(rules[1].test).toEqual(validFromDate);
        expect(rules[2].test).toEqual(validToDate);
        expect(rules[3].test).toEqual(toIsAfterFrom);
        expect(rules[4].test).toEqual(validLimit);
        expect(rules[5].test).toEqual(validOrder);
    });

    test('Knows when "to" is after "from"', () => {
        expect(toIsAfterFrom({ from: '2018-08-21T13:00:00Z', to: '2018-08-25T18:00:00Z' })).toBe(true);
        expect(toIsAfterFrom({ from: '2018-08-27T13:00:00Z', to: '2018-08-25T18:00:00Z' })).toBe(false);
    });

    test('Knows a good "to" date', () => {
        expect(validToDate({ to: '2018-08-21T13:58:00Z' })).toBe(true);
        expect(validToDate({ to: 'wef' })).toBe(false);
    });

    test('Knows a good "from" date', () => {
        expect(validFromDate({ from: '2018-08-21T13:58:00Z' })).toBe(true);
        expect(validFromDate({ from: 'wef' })).toBe(false);
    });

    test('Knows a valid limit', () => {
        expect(validLimit({ limit: 'chicken' })).toBe(false);
        expect(validLimit({ limit: 99 })).toBe(true);
        expect(validLimit({ limit: 0 })).toBe(false);
        expect(validLimit({ limit: -17 })).toBe(false);
    });

    test('Knows a valid order', () => {
        expect(validOrder({ order: 'ascending' })).toBe(true);
        expect(validOrder({ order: 'descending' })).toBe(true);
        expect(validOrder({ order: 'somethingElse' })).toBe(false);
    })
});
