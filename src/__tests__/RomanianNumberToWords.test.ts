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
        expect(converter.convert('0.abc')).toBe('NaN');
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
      expect((converter as any).generateRomanianWords(0n, [], 'test')).toBe('test');
    });
  });

  describe('Negative numbers', () => {
    it('should handle negative numbers in generateRomanianWords', () => {
      expect((converter as any).generateRomanianWords(-5n)).toContain('minus');
      expect((converter as any).generateRomanianWords(-42n)).toContain('minus');
    });
  });

  describe('Number limits', () => {
    it('should return scale words up to decillion, and "peste limita" only for numbers above decillion', () => {
      expect(converter.convert('1000000000000')).toBe('un trilion');
      expect(converter.convert('9999999999999')).toBe('nouă trilioane nouă sute nouăzeci și nouă de miliarde nouă sute nouăzeci și nouă de milioane nouă sute nouăzeci și nouă de mii nouă sute nouăzeci și nouă');
      expect(converter.convert('10000000000000000000000000000000000')).toBe('peste limita');
    });

    it('should directly set scale words in generateRomanianWords up to decillion, "peste limita" above', () => {
      expect((converter as any).generateRomanianWords(1_000_000_000_000n)).toBe('un trilion');
      expect((converter as any).generateRomanianWords(5_000_000_000_000n)).toBe('cinci trilioane');
      const ONE_DECILLION = 1000000000000000000000000000000000n;
      expect((converter as any).generateRomanianWords(ONE_DECILLION)).toBe('un decilion');
      expect((converter as any).generateRomanianWords(ONE_DECILLION + 1n)).toBe('peste limita');
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
      expect((converter as any).matchRomanian(1n, 'un milion', 'milioane')).toBe('un milion');
      expect((converter as any).matchRomanian(2n, 'un milion', 'milioane')).toBe('două milioane');
      expect((converter as any).matchRomanian(5n, 'un milion', 'milioane')).toBe('cinci milioane');
      expect((converter as any).matchRomanian(21n, 'un milion', 'milioane')).toBe('douăzeci și unu de milioane');
      expect((converter as any).matchRomanian(22n, 'un milion', 'milioane')).toBe('douăzeci și două de milioane');
    });
  });

  describe('Romanian large scale matching', () => {
    it('should handle larger scales correctly', () => {
      expect((converter as any).matchRomanian(1n, 'un cvadrilion', 'cvadrilioane')).toBe('un cvadrilion');
      expect((converter as any).matchRomanian(2n, 'un cvadrilion', 'cvadrilioane')).toBe('două cvadrilioane');
      expect((converter as any).matchRomanian(1n, 'un sextilion', 'sextilioane')).toBe('un sextilion');
      expect((converter as any).matchRomanian(3n, 'un sextilion', 'sextilioane')).toBe('trei sextilioane');
    });
  });

  describe('Romanian large numbers conversion', () => {
    it('should convert quadrillions and handle over-limit correctly', () => {
      expect(converter.convert('1000000000000000')).toBe('un cvadrilion');
      expect(converter.convert('2000000000000000')).toBe('două cvadrilioane');
      expect(converter.convert('1000000000000000000')).toBe('un cvintilion');
      expect(converter.convert('1000000000000000000000')).toBe('un sextilion');
      expect(converter.convert('1000000000000000000000000')).toBe('un septilion');
      expect(converter.convert('1000000000000000000000000000')).toBe('un octilion');
      expect(converter.convert('1000000000000000000000000000000')).toBe('un nonilion');
      expect(converter.convert('1000000000000000000000000000000000')).toBe('un decilion');
      expect(converter.convert('10000000000000000000000000000000000')).toBe('peste limita');
    });
  });
});
