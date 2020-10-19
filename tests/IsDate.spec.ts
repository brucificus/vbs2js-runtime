import { IsDate } from '../src';

describe('IsDate', () => {
    describe('given', () => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const expectIt = (value: any, expectedResult: boolean) => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            it(`${typeof value} "${value}"`, () => {
                const actualResult = IsDate(value);

                if (expectedResult) {
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(actualResult).toBeTruthy();
                } else {
                    // eslint-disable-next-line jest/no-conditional-expect
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
