import { CDate } from '../src';

describe('CDate', () => {
    describe('given', () => {
        const expectIt = (
            value: any,
            expectedResult: Date | null | undefined
            // eslint-disable-next-line unicorn/consistent-function-scoping
        ) => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            it(`${typeof value} "${value}"`, () => {
                const actualResult = CDate(value);

                expect(actualResult).toStrictEqual(expectedResult);
            });
        };

        expectIt('2020-02-07', new Date('2020-02-07'));

        expectIt(
            new Date(1970, 1, 1, 0, 0, 0, 0),
            new Date(1970, 1, 1, 0, 0, 0, 0)
        );
    });
});
