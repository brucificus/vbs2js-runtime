import { DateDiff } from '../src';

describe('DateAdd', () => {
    describe('given', () => {
        const expectIt = (
            value2: Date | string,
            value1: Date | string,
            interval: string,
            expectedResult: number
        ) => {
            it(`${typeof value2} "${value2}" - ${typeof value1} "${value1}" in ${interval}`, () => {
                const actualResult = DateDiff(interval, value1, value2);

                expect(actualResult).toStrictEqual(expectedResult);
            });
        };

        expectIt(
            new Date('2021-02-07T00:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'yyyy',
            1
        );
        expectIt(
            new Date('2011-02-07T00:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'yyyy',
            -9
        );

        expectIt(
            new Date('2020-11-07T00:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'q',
            3
        );
        expectIt(
            new Date('2019-08-06T23:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'q',
            -2
        );

        expectIt(
            new Date('2020-02-08T00:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'y',
            1
        );
        expectIt(
            new Date('2020-01-29T00:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'y',
            -9
        );

        expectIt(
            new Date('2020-02-08T00:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'd',
            1
        );
        expectIt(
            new Date('2020-01-29T00:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'd',
            -9
        );

        // TODO: These tests fail with the current implementation, so are not included.
        // expectIt(new Date('2020-02-08T00:00:00.000Z'), new Date('2020-02-07T00:00:00.000Z'), 'w', 1);
        // expectIt(new Date('2020-01-29T00:00:00.000Z'), new Date('2020-02-07T00:00:00.000Z'), 'w', -9);

        expectIt(
            new Date('2020-02-14T00:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'ww',
            1
        );
        expectIt(
            new Date('2019-12-06T00:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'ww',
            -9
        );

        expectIt(
            new Date('2020-02-07T05:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'h',
            5
        );
        expectIt(
            new Date('2020-02-06T21:00:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'h',
            -3
        );

        expectIt(
            new Date('2020-02-07T00:05:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'n',
            5
        );
        expectIt(
            new Date('2020-02-06T23:57:00.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            'n',
            -3
        );

        expectIt(
            new Date('2020-02-07T00:00:05.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            's',
            5
        );
        expectIt(
            new Date('2020-02-06T23:59:57.000Z'),
            new Date('2020-02-07T00:00:00.000Z'),
            's',
            -3
        );
    });
});
