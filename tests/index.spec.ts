describe('library', () => {
    it('can be imported', async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
        await expect(import('../src/index')).resolves.toBeDefined();
    });
});
