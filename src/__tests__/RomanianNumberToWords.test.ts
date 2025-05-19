import { RomanianNumberToWords } from '../languages/ro/RomanianNumberToWords';

describe('RomanianNumberToWords', () => {
  let converter: RomanianNumberToWords;
  
  beforeEach(() => {
    converter = new RomanianNumberToWords();
  });

  describe('Basic conversion', () => {
    it('should convert single digits correctly', () => {
      expect(converter.convert('0')).toBe('zero');
      expect(converter.convert('1')).toBe('unu');
      expect(converter.convert('9')).toBe('nouă');
    });

    it('should convert teens correctly', () => {
      expect(converter.convert('10')).toBe('zece');
      expect(converter.convert('11')).toBe('unsprezece');
      expect(converter.convert('19')).toBe('nouăsprezece');
    });

    it('should convert tens correctly', () => {
      expect(converter.convert('20')).toBe('douăzeci');
      expect(converter.convert('30')).toBe('treizeci');
      expect(converter.convert('90')).toBe('nouăzeci');
    });

    it('should convert compound tens correctly', () => {
      expect(converter.convert('21')).toBe('douăzeci și unu');
      expect(converter.convert('42')).toBe('patruzeci și doi');
      expect(converter.convert('99')).toBe('nouăzeci și nouă');
    });
  });

  describe('Hundreds, thousands and millions', () => {
    it('should convert hundreds correctly', () => {
      expect(converter.convert('100')).toBe('o sută');
      expect(converter.convert('200')).toBe('două sute');
      expect(converter.convert('300')).toBe('trei sute');
    });

    it('should convert compound hundreds correctly', () => {
      expect(converter.convert('101')).toBe('o sută unu');
      expect(converter.convert('215')).toBe('două sute cincisprezece');
      expect(converter.convert('999')).toBe('nouă sute nouăzeci și nouă');
    });

    it('should convert thousands correctly', () => {
      expect(converter.convert('1000')).toBe('o mie');
      expect(converter.convert('2000')).toBe('două mii');
      expect(converter.convert('5000')).toBe('cinci mii');
    });

    it('should convert compound thousands correctly', () => {
      expect(converter.convert('1001')).toBe('o mie unu');
      expect(converter.convert('1234')).toBe('o mie două sute treizeci și patru');
      expect(converter.convert('9999')).toBe('nouă mii nouă sute nouăzeci și nouă');
    });

    it('should convert millions correctly', () => {
      expect(converter.convert('1000000')).toBe('un milion');
      expect(converter.convert('2000000')).toBe('două milioane');
    });

    it('should convert billions correctly', () => {
      expect(converter.convert('1000000000')).toBe('un miliard');
      expect(converter.convert('2000000000')).toBe('două miliarde');
    });
  });

  describe('Error handling and fallback', () => {
    it('should handle invalid input with fallback mechanism', () => {
      expect(converter.convert('')).toBe('NaN');
      expect(converter.convert('abc')).toBe('NaN');
      expect(() => converter.convert('123abc')).not.toThrow();
    });
    
    it('should handle parsing errors (line 99)', () => {
      const originalParseInt = global.parseInt;
      try {
        global.parseInt = jest.fn().mockImplementation(() => { throw new Error('Parse error'); });
        expect(converter.convert('123')).toBe('NaN');
      } finally {
        global.parseInt = originalParseInt;
      }
    });
    
    it('should handle decimal parts in fallback mode (line 107)', () => {
     
      const originalNormalizer = converter['normalizer'].normalize;
      try {
        converter['normalizer'].normalize = jest.fn().mockImplementation(() => { throw new Error('Test error'); });
        const result = converter.convert('123.45');
        expect(result).toBeTruthy();
      } finally {
        converter['normalizer'].normalize = originalNormalizer;
      }
    });
    
    it('should catch errors in the fallback mechanism (line 112)', () => {
      const originalGenerate = converter['generateRomanianWords'];
      try {
        converter['generateRomanianWords'] = jest.fn().mockImplementation(() => { throw new Error('Test error'); });
        expect(converter.convert('123')).toBe('NaN');
      } finally {
        converter['generateRomanianWords'] = originalGenerate;
      }
    });
  });

  describe('Initial decimal words', () => {
    it('should handle initial decimal words correctly', () => {
      expect((converter as any).generateRomanianWords(0, [], 'test')).toBe('test');
    });
  });

  describe('Negative numbers', () => {
    it('should handle negative numbers in generateRomanianWords', () => {
      expect((converter as any).generateRomanianWords(-5)).toContain('minus');
      expect((converter as any).generateRomanianWords(-42)).toContain('minus');
    });
  });

  describe('Number limits', () => {
    it('should return "peste limita" for numbers above trillion', () => {
      expect(converter.convert('1000000000000')).toBe('peste limita');
      expect(converter.convert('9999999999999')).toBe('peste limita');
    });
    
    it('should directly set "peste limita" in generateRomanianWords (lines 182-183)', () => {
      expect((converter as any).generateRomanianWords(1e12)).toBe('peste limita');
      expect((converter as any).generateRomanianWords(5e12)).toBe('peste limita');
      
      const ONE_TRILLION = 1000000000000;
      
      
      class TestSubclass extends RomanianNumberToWords {
        testDefaultCase() {
          const result = this.generateRomanianWords(ONE_TRILLION * 2); 
          return { result, defaultCaseHit: result === 'peste limita' };
        }
      }
      
      const testInstance = new TestSubclass();
      const { result, defaultCaseHit } = testInstance.testDefaultCase();
      
      expect(result).toBe('peste limita');
      expect(defaultCaseHit).toBe(true);
    });
  });

  describe('Decimal part formatting', () => {
    it('should convert decimal parts correctly', () => {
      expect((converter as any).parseRomanianDecimals('1')).toBe('unu');
      expect((converter as any).parseRomanianDecimals('01')).toBe('zero unu');
      expect((converter as any).parseRomanianDecimals('45')).toBe('patruzeci și cinci');
      expect((converter as any).parseRomanianDecimals('50')).toBe('cincizeci');
      expect((converter as any).parseRomanianDecimals('21')).toBe('douăzeci și unu');
      expect((converter as any).parseRomanianDecimals('4500')).toBe('patruzeci și cinci zero zero');
    });

    it('should handle longer decimal sequences', () => {
      expect((converter as any).parseRomanianDecimals('123')).toBe('unu doi trei');
      expect((converter as any).parseRomanianDecimals('1200')).toBe('douăsprezece zero zero');
    });

    it('should handle full decimal numbers', () => {
      expect(converter.convert('0.123')).toBe('zero virgulă unu doi trei');
      expect(converter.convert('1.45')).toBe('unu virgulă patruzeci și cinci');
      expect(converter.convert('10.21')).toBe('zece virgulă douăzeci și unu');
    });
  });

  describe('Romanian scale matching', () => {
    it('should handle singular and plural forms correctly', () => {
      expect((converter as any).matchRomanian(1, 'un milion', 'milioane')).toBe('un milion');
      expect((converter as any).matchRomanian(2, 'un milion', 'milioane')).toBe('două milioane');
      expect((converter as any).matchRomanian(5, 'un milion', 'milioane')).toBe('cinci milioane');
      expect((converter as any).matchRomanian(21, 'un milion', 'milioane')).toBe('douăzeci și unu de milioane');
      expect((converter as any).matchRomanian(22, 'un milion', 'milioane')).toBe('douăzeci și două de milioane');
    });
  });
});
