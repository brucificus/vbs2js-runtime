import { IsDate } from '../src';

describe('IsDate', () => {
    describe('given', () => {
        const expectIt = (value: any, expectedResult: boolean) => {
            it(`${typeof value} "${value}"`, () => {
                const actualResult = IsDate(value);

                if (expectedResult) {
                    expect(actualResult).toBeTruthy();
                } else {
                    expect(actualResult).toBeFalsy();
                }
            });
        };

        expectIt('2020-02-07', true);

        expectIt(new Date(), true);

        expectIt(new Date(1970, 1, 1, 0, 0, 0, 0), true);

        expectIt('abc', false);

        expectIt('', false);

        expectIt(null, false);

        expectIt(undefined, false);
    });
});
