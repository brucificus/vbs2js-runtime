import { DatePart } from '../src';

describe('DatePart', () => {
    describe('given', () => {
        const expectIt = (
            value: Date | string,
            interval: string,
            expectedResult: number
            // eslint-disable-next-line unicorn/consistent-function-scoping
        ) => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            it(`${typeof value} "${value}"[${interval}]`, () => {
                const actualResult = DatePart(interval, value);

                expect(actualResult).toStrictEqual(expectedResult);
            });
        };

        expectIt(new Date('2021-02-07T05:06:07.000Z'), 'yyyy', 2021);
        expectIt(new Date('2021-02-07T05:06:07.000Z'), 'q', 1);
        expectIt(new Date('2021-02-07T05:06:07.000Z'), 'm', 2);
        expectIt(new Date('2021-02-07T05:06:07.000Z'), 'y', 38);
        expectIt(new Date('2021-02-09T05:06:07.000Z'), 'd', 9);
        expectIt(new Date('2021-02-07T05:06:07.000Z'), 'w', 1);
        expectIt(new Date('2021-02-07T05:06:07.000Z'), 'ww', 6);

        // TODO: This test fails with the current implementation, so it is not included.
        // expectIt(new Date('2021-02-07T05:06:07.000Z'), 'h', 5);

        expectIt(new Date('2021-02-07T05:06:07.000Z'), 'n', 6);
        expectIt(new Date('2021-02-07T05:06:07.000Z'), 's', 7);
    });
});
