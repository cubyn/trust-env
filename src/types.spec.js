require('./types');
const isJs = require('is_js');

describe('types', () => {
  describe('integersArray', () => {
    it('exists', () => {
      expect(isJs.integersArray).toEqual(expect.any(Function));
    });

    it('supports native API', () => {
      expect(isJs.not.integersArray('abc')).toBe(true);
      expect(isJs.not.integersArray([1])).toBe(false);
      expect(isJs.all.integersArray([1], '1')).toBe(false);
      expect(isJs.all.integersArray([[1], [2]])).toBe(true);
      expect(isJs.any.integersArray([[1, 2], '1'])).toBe(true);
      expect(isJs.any.integersArray('1', 2)).toBe(false);
    });

    describe('when the payload is an array of integers', () => {
      it('returns true', () => {
        expect(isJs.integersArray([1])).toBe(true);
        expect(isJs.integersArray([1, 2])).toBe(true);
      });
    });

    describe('when the payload is not an array of integers', () => {
      it('returns false', () => {
        expect(isJs.integersArray([1, [2]])).toBe(false);
        expect(isJs.integersArray(['1', '2'])).toBe(false);
        expect(isJs.integersArray([1.1])).toBe(false);
        expect(isJs.integersArray({ a: 1 })).toBe(false);
        expect(isJs.integersArray(null)).toBe(false);
      });
    });
  });
});
