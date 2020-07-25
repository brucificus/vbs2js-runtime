describe('library', () => {
    it('can be imported', async () => {
        await expect(import('../src/index')).resolves.toBeDefined();
    });
});
