import { IsDate } from '../src';
import { DateLike } from '../src/DateLike';

const expectIt = (
    value: DateLike | null | undefined,
    expectedResult: boolean
) => {
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

describe('IsDate', () => {
    describe('given', () => {
        expectIt('2020-02-07', true);

        expectIt(new Date(), true);

        expectIt(new Date(1970, 1, 1, 0, 0, 0, 0), true);

        expectIt('abc', false);

        expectIt('', false);

        expectIt(null, false);

        expectIt(undefined, false);
    });
});
