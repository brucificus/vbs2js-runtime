import { DateAdd } from '../src';

describe('DateAdd', () => {
    describe('given', () => {
        const expectIt = (
            value: Date | string,
            number: number,
            interval: string,
            expectedResult: Date | string | null | undefined
            // eslint-disable-next-line unicorn/consistent-function-scoping
        ) => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            it(`${typeof value} "${value}" + ${number} '${interval}'`, () => {
                const actualResult = DateAdd(interval, number, value);

                expect(actualResult).toStrictEqual(expectedResult);
            });
        };

        expectIt('2020-02-07', 1, 'yyyy', new Date('2021-02-07T00:00:00.000Z'));
        expectIt(
            '2020-02-07',
            -9,
            'yyyy',
            new Date('2011-02-07T00:00:00.000Z')
        );

        expectIt('2020-02-07', 3, 'q', new Date('2020-11-07T00:00:00.000Z'));
        expectIt('2020-02-07', -2, 'q', new Date('2019-08-06T23:00:00.000Z'));

        expectIt('2020-02-07', 1, 'y', new Date('2020-02-08T00:00:00.000Z'));
        expectIt('2020-02-07', -9, 'y', new Date('2020-01-29T00:00:00.000Z'));

        expectIt('2020-02-07', 1, 'd', new Date('2020-02-08T00:00:00.000Z'));
        expectIt('2020-02-07', -9, 'd', new Date('2020-01-29T00:00:00.000Z'));

        expectIt('2020-02-07', 1, 'w', new Date('2020-02-08T00:00:00.000Z'));
        expectIt('2020-02-07', -9, 'w', new Date('2020-01-29T00:00:00.000Z'));

        expectIt('2020-02-07', 1, 'ww', new Date('2020-02-14T00:00:00.000Z'));
        expectIt('2020-02-07', -9, 'ww', new Date('2019-12-06T00:00:00.000Z'));

        expectIt(
            new Date('2020-02-07T00:00:00.000Z'),
            5,
            'h',
            new Date('2020-02-07T05:00:00.000Z')
        );
        expectIt(
            new Date('2020-02-07T00:00:00.000Z'),
            -3,
            'h',
            new Date('2020-02-06T21:00:00.000Z')
        );

        expectIt(
            new Date('2020-02-07T00:00:00.000Z'),
            5,
            'n',
            new Date('2020-02-07T00:05:00.000Z')
        );
        expectIt(
            new Date('2020-02-07T00:00:00.000Z'),
            -3,
            'n',
            new Date('2020-02-06T23:57:00.000Z')
        );

        expectIt(
            new Date('2020-02-07T00:00:00.000Z'),
            5,
            's',
            new Date('2020-02-07T00:00:05.000Z')
        );
        expectIt(
            new Date('2020-02-07T00:00:00.000Z'),
            -3,
            's',
            new Date('2020-02-06T23:59:57.000Z')
        );
    });
});
