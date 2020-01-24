const isJs = require('is_js');
require('.');

describe('types', () => {
  describe('stringsArray', () => {
    it('exists', () => {
      expect(isJs.stringsArray).toEqual(expect.any(Function));
    });

    it('supports native API', () => {
      expect(isJs.not.stringsArray('abc')).toBe(true);
      expect(isJs.not.stringsArray(['a'])).toBe(false);
      expect(isJs.all.stringsArray([1], 'a')).toBe(false);
      expect(isJs.all.stringsArray([['a'], ['b']])).toBe(true);
      expect(isJs.any.stringsArray([['1', '2'], '1'])).toBe(true);
      expect(isJs.any.stringsArray('1', 2)).toBe(false);
    });

    describe('when the payload is an array of strings', () => {
      it('returns true', () => {
        expect(isJs.stringsArray(['a'])).toBe(true);
        expect(isJs.stringsArray(['a', 'b'])).toBe(true);
      });
    });

    describe('when the payload is not an array of strings', () => {
      it('returns false', () => {
        expect(isJs.stringsArray(['a', [2]])).toBe(false);
        expect(isJs.stringsArray([1, 2])).toBe(false);
        expect(isJs.stringsArray(null)).toBe(false);
      });
    });
  });

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

  describe('numbersArray', () => {
    it('exists', () => {
      expect(isJs.numbersArray).toEqual(expect.any(Function));
    });

    it('supports native API', () => {
      expect(isJs.not.numbersArray('abc')).toBe(true);
      expect(isJs.not.numbersArray([1.1])).toBe(false);
      expect(isJs.all.numbersArray([1.1], '1')).toBe(false);
      expect(isJs.all.numbersArray([[1.1], [2.3]])).toBe(true);
      expect(isJs.any.numbersArray([[1.1, 2.2], '1'])).toBe(true);
      expect(isJs.any.numbersArray('1', 2)).toBe(false);
    });

    describe('when the payload is an array of numbers', () => {
      it('returns true', () => {
        expect(isJs.numbersArray([1.1])).toBe(true);
        expect(isJs.numbersArray([1.1, 2.2])).toBe(true);
      });
    });

    describe('when the payload is not an array of numbers', () => {
      it('returns false', () => {
        expect(isJs.numbersArray([1, [2]])).toBe(false);
        expect(isJs.numbersArray(['1.1', 2])).toBe(false);
        expect(isJs.numbersArray(null)).toBe(false);
      });
    });
  });
});
