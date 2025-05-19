import { numberToWords, LANGUAGES } from '..';

describe('numberToWords - Basic Tests', () => {
  describe('Basic integers', () => {
    const tests = [
      { input: '0', en: 'zero', ro: 'zero' },
      { input: '1', en: 'one', ro: 'unu' },
      { input: '9', en: 'nine', ro: 'nouă' },
      { input: '10', en: 'ten', ro: 'zece' },
      { input: '11', en: 'eleven', ro: 'unsprezece' },
      { input: '19', en: 'nineteen', ro: 'nouăsprezece' },
      { input: '20', en: 'twenty', ro: 'douăzeci' },
      { input: '21', en: 'twenty-one', ro: 'douăzeci și unu' },
      { input: '30', en: 'thirty', ro: 'treizeci' },
      { input: '99', en: 'ninety-nine', ro: 'nouăzeci și nouă' },
      { input: '100', en: 'one hundred', ro: 'o sută' },
      { input: '101', en: 'one hundred one', ro: 'o sută unu' },
      { input: '111', en: 'one hundred eleven', ro: 'o sută unsprezece' },
      { input: '200', en: 'two hundred', ro: 'două sute' },
      { input: '999', en: 'nine hundred ninety-nine', ro: 'nouă sute nouăzeci și nouă' },
      { input: '1000', en: 'one thousand', ro: 'o mie' },
      { input: '1001', en: 'one thousand one', ro: 'o mie unu' },
      { input: '1234', en: 'one thousand two hundred thirty-four', ro: 'o mie două sute treizeci și patru' },
      { input: '10000', en: 'ten thousand', ro: 'zece mii' },
      { input: '22000', en: 'twenty-two thousand', ro: 'douăzeci și două de mii' },
      { input: '100000', en: 'one hundred thousand', ro: 'o sută de mii' },
      { input: '1000000', en: 'one million', ro: 'un milion' },
      { input: '1000000000', en: 'one billion', ro: 'un miliard' }
    ];
    
    tests.forEach(test => {
      it(`converts ${test.input} correctly in both languages`, () => {
        expect(numberToWords(test.input, LANGUAGES.ENGLISH)).toBe(test.en);
        expect(numberToWords(test.input, LANGUAGES.ROMANIAN)).toBe(test.ro);
      });
    });
  });
  
  // Simple decimal tests
  describe('Simple decimals', () => {
    const tests = [
      { input: '0.1', en: 'zero point one', ro: 'zero virgulă unu' },
      { input: '0.01', en: 'zero point zero one', ro: 'zero virgulă zero unu' },
      { input: '0.001', en: 'zero point zero zero one', ro: 'zero virgulă zero zero unu' },
      { input: '1.0', en: 'one point zero', ro: 'unu virgulă zero' },
      { input: '1.1', en: 'one point one', ro: 'unu virgulă unu' },
      { input: '1.01', en: 'one point zero one', ro: 'unu virgulă zero unu' },
      { input: '1.001', en: 'one point zero zero one', ro: 'unu virgulă zero zero unu' },
      { input: '10.01', en: 'ten point zero one', ro: 'zece virgulă zero unu' },
      { input: '100.99', en: 'one hundred point nine nine', ro: 'o sută virgulă nouăzeci și nouă' },
      { input: '123.45', en: 'one hundred twenty-three point four five', ro: 'o sută douăzeci și trei virgulă patruzeci și cinci' }
    ];
    
    tests.forEach(test => {
      it(`converts ${test.input} correctly in both languages`, () => {
        expect(numberToWords(test.input, LANGUAGES.ENGLISH)).toBe(test.en);
        expect(numberToWords(test.input, LANGUAGES.ROMANIAN)).toBe(test.ro);
      });
    });
  });
});

describe('numberToWords - Edge Cases', () => {
  it('should return "zero" for 0 in both languages', () => {
    expect(numberToWords('0', LANGUAGES.ROMANIAN)).toBe('zero');
    expect(numberToWords('0', LANGUAGES.ENGLISH)).toBe('zero');
  });

  it('should handle negative numbers and negative decimals', () => {
    expect(numberToWords('-5', LANGUAGES.ROMANIAN)).toBe('minus cinci');
    expect(numberToWords('-5.25', LANGUAGES.ROMANIAN)).toMatch(/minus/);
    expect(numberToWords('-5', LANGUAGES.ENGLISH)).toBe('negative five');
    expect(numberToWords('-5.25', LANGUAGES.ENGLISH)).toMatch(/negative/);
  });

  it('should handle numbers with leading/trailing zeros', () => {
    expect(numberToWords('000123.0450', LANGUAGES.ROMANIAN)).toMatch(/o sută douăzeci și trei virgulă zero patru cinci zero/);
    expect(numberToWords('000123.0450', LANGUAGES.ENGLISH)).toMatch(/one hundred twenty-three point zero four five zero/);
  });

  it('should handle very large numbers', () => {
    expect(numberToWords('1000000000000', LANGUAGES.ROMANIAN)).toBe('peste limita');
    expect(numberToWords('1000000000000', LANGUAGES.ENGLISH)).toMatch(/trillion/);
  });

  it('should handle decimals with only zeros', () => {
    expect(numberToWords('1.00', LANGUAGES.ROMANIAN)).toMatch(/unu/);
    expect(numberToWords('1.00', LANGUAGES.ENGLISH)).toMatch(/one/);
  });

  it('should handle malformed input gracefully', () => {
    expect(numberToWords('', LANGUAGES.ROMANIAN)).toBe('NaN');
    expect(() => numberToWords(' ', LANGUAGES.ENGLISH)).toThrow();
    expect(numberToWords('abc', LANGUAGES.ROMANIAN)).toBe('NaN');
    expect(() => numberToWords('123abc', LANGUAGES.ENGLISH)).toThrow();
  });

  it('should handle decimal separators in both formats', () => {
    expect(numberToWords('1,25', LANGUAGES.ROMANIAN)).toMatch(/virgulă/);
    expect(numberToWords('1.25', LANGUAGES.ROMANIAN)).toMatch(/virgulă/);
    expect(numberToWords('1,25', LANGUAGES.ENGLISH)).toMatch(/point/);
    expect(numberToWords('1.25', LANGUAGES.ENGLISH)).toMatch(/point/);
  });
});

describe('numberToWords - Separator Format Tests', () => {
  describe('EU vs US decimal separators', () => {
    const tests = [
      { us: '1.23', eu: '1,23', en_words: 'one point two three', ro_words: 'unu virgulă douăzeci și trei' },
      { us: '100.45', eu: '100,45', en_words: 'one hundred point four five', ro_words: 'o sută virgulă patruzeci și cinci' },
      { us: '999.99', eu: '999,99', en_words: 'nine hundred ninety-nine point nine nine', ro_words: 'nouă sute nouăzeci și nouă virgulă nouăzeci și nouă' }
    ];
    
    tests.forEach(test => {
      it(`handles US format (${test.us}) and EU format (${test.eu}) correctly`, () => {
        expect(numberToWords(test.us, LANGUAGES.ENGLISH)).toBe(test.en_words);
        expect(numberToWords(test.us, LANGUAGES.ROMANIAN)).toBe(test.ro_words);
        
        expect(numberToWords(test.eu, LANGUAGES.ENGLISH)).toBe(test.en_words);
        expect(numberToWords(test.eu, LANGUAGES.ROMANIAN)).toBe(test.ro_words);
      });
    });
  });
  
  describe('Thousand and decimal separators', () => {
    it('should reject numbers with multiple decimal separators', () => {
      expect(() => numberToWords('1.2.3', LANGUAGES.ENGLISH)).toThrow('Invalid number format');
      expect(() => numberToWords('1,2,3', LANGUAGES.ENGLISH)).toThrow('Invalid number format');
      expect(() => numberToWords('1.2.3.4', LANGUAGES.ENGLISH)).toThrow('Invalid number format');
    });
    
    it('should interpret separators correctly in simple cases', () => {
      expect(numberToWords('1,234', LANGUAGES.ENGLISH)).toBe('one thousand two hundred thirty-four');
      expect(numberToWords('1.234', LANGUAGES.ROMANIAN)).toBe('o mie două sute treizeci și patru');
    });
  });
});

describe('numberToWords - Leading and Trailing Zeros', () => {
  it('should handle leading zeros in the integer part', () => {
    expect(numberToWords('000123', LANGUAGES.ENGLISH)).toBe('one hundred twenty-three');
    expect(numberToWords('000123', LANGUAGES.ROMANIAN)).toBe('o sută douăzeci și trei');
    expect(numberToWords('0001', LANGUAGES.ENGLISH)).toBe('one');
    expect(numberToWords('0001', LANGUAGES.ROMANIAN)).toBe('unu');
  });
  
  it('should handle trailing zeros in the decimal part', () => {
    expect(numberToWords('123.4500', LANGUAGES.ENGLISH)).toBe('one hundred twenty-three point four five zero zero');
    expect(numberToWords('123.4500', LANGUAGES.ROMANIAN)).toBe('o sută douăzeci și trei virgulă patruzeci și cinci zero zero');
    expect(numberToWords('100.00', LANGUAGES.ENGLISH)).toBe('one hundred point zero zero');
    expect(numberToWords('100.00', LANGUAGES.ROMANIAN)).toBe('o sută virgulă zero zero');
  });
  
  it('should handle both leading and trailing zeros', () => {
    expect(numberToWords('000123.4500', LANGUAGES.ENGLISH)).toBe('one hundred twenty-three point four five zero zero');
    expect(numberToWords('000123.4500', LANGUAGES.ROMANIAN)).toBe('o sută douăzeci și trei virgulă patruzeci și cinci zero zero');
    expect(numberToWords('000100.00100', LANGUAGES.ENGLISH)).toBe('one hundred point zero zero one zero zero');
    expect(numberToWords('000100.00100', LANGUAGES.ROMANIAN)).toBe('o sută virgulă zero zero unu zero zero');
  });
});

describe('numberToWords - Negative Numbers', () => {
  it('should handle negative integers', () => {
    expect(numberToWords('-1', LANGUAGES.ENGLISH)).toBe('negative one');
    expect(numberToWords('-1', LANGUAGES.ROMANIAN)).toBe('minus unu');
    expect(numberToWords('-100', LANGUAGES.ENGLISH)).toBe('negative one hundred');
    expect(numberToWords('-100', LANGUAGES.ROMANIAN)).toBe('minus o sută');
    expect(numberToWords('-1000', LANGUAGES.ENGLISH)).toBe('negative one thousand');
    expect(numberToWords('-1000', LANGUAGES.ROMANIAN)).toBe('minus o mie');
  });
  
  it('should handle negative decimals', () => {
    expect(numberToWords('-1.5', LANGUAGES.ENGLISH)).toBe('negative one point five');
    expect(numberToWords('-1.5', LANGUAGES.ROMANIAN)).toBe('minus unu virgulă cinci');
    expect(numberToWords('-0.5', LANGUAGES.ENGLISH)).toBe('negative zero point five');
    expect(numberToWords('-0.5', LANGUAGES.ROMANIAN)).toBe('minus zero virgulă cinci');
    expect(numberToWords('-100.01', LANGUAGES.ENGLISH)).toBe('negative one hundred point zero one');
    expect(numberToWords('-100.01', LANGUAGES.ROMANIAN)).toBe('minus o sută virgulă zero unu');
  });
});

describe('numberToWords - Very Large and Very Small Numbers', () => {
  it('should handle very large numbers', () => {
    expect(numberToWords('999999999999', LANGUAGES.ENGLISH)).toMatch(/nine hundred ninety-nine billion/);
    expect(numberToWords('999999999999', LANGUAGES.ROMANIAN)).toMatch(/nouă sute nouăzeci și nouă de miliarde/);
  });
  
  it('should handle very small decimals', () => {
    expect(numberToWords('0.000001', LANGUAGES.ENGLISH)).toBe('zero point zero zero zero zero zero one');
    expect(numberToWords('0.000001', LANGUAGES.ROMANIAN)).toBe('zero virgulă zero zero zero zero zero unu');
  });
});

describe('numberToWords - Malformed Input', () => {
  it('should handle malformed input gracefully', () => {
    expect(() => numberToWords('', LANGUAGES.ENGLISH)).toThrow();
    
    expect(() => numberToWords('abc', LANGUAGES.ENGLISH)).toThrow();
    expect(() => numberToWords('123abc', LANGUAGES.ENGLISH)).toThrow();
    
    expect(() => numberToWords('1.2.3', LANGUAGES.ENGLISH)).toThrow();
    
    expect(() => numberToWords(' ', LANGUAGES.ENGLISH)).toThrow();
  });
});

describe('numberToWords - Romanian', () => {
  test('should return "unu" for 1', () => {
    expect(numberToWords('1', LANGUAGES.ROMANIAN)).toBe('unu');
  });

  test('should return "nouăsprezece" for 19', () => {
    expect(numberToWords('19', LANGUAGES.ROMANIAN)).toBe('nouăsprezece');
  });

  test('should return "douăzeci și unu" for 21', () => {
    expect(numberToWords('21', LANGUAGES.ROMANIAN)).toBe('douăzeci și unu');
  });

  test('should return "o sută" for 100', () => {
    expect(numberToWords('100', LANGUAGES.ROMANIAN)).toBe('o sută');
  });

  test('should return "două sute" for 200', () => {
    expect(numberToWords('200', LANGUAGES.ROMANIAN)).toBe('două sute');
  });

  test('should return "o sută douăzeci și cinci" for 125', () => {
    expect(numberToWords('125', LANGUAGES.ROMANIAN)).toBe('o sută douăzeci și cinci');
  });

  test('should return "o mie" for 1000', () => {
    expect(numberToWords('1000', LANGUAGES.ROMANIAN)).toBe('o mie');
  });

  test('should return "o mie unu" for 1001', () => {
    expect(numberToWords('1001', LANGUAGES.ROMANIAN)).toBe('o mie unu');
  });

  test('should return "o sută optsprezece mii nouă sute treizeci și unu" for 118931', () => {
    expect(numberToWords('118931', LANGUAGES.ROMANIAN)).toBe('o sută optsprezece mii nouă sute treizeci și unu');
  });

  test('should return "două sute patruzeci și cinci de mii o sută" for 245100', () => {
    expect(numberToWords('245100', LANGUAGES.ROMANIAN)).toBe('două sute patruzeci și cinci de mii o sută');
  });

  test('should return "un milion" for 1000000', () => {
    expect(numberToWords('1000000', LANGUAGES.ROMANIAN)).toBe('un milion');
  });

  test('should return "un milion două sute cincizeci și nouă de mii șase sute treizeci și unu" for 1259631', () => {
    expect(numberToWords('1259631', LANGUAGES.ROMANIAN)).toBe('un milion două sute cincizeci și nouă de mii șase sute treizeci și unu');
  });

  test('should return "o sută unu milioane două sute treizeci de mii patru sute șaizeci și cinci" for 101230465', () => {
    expect(numberToWords('101230465', LANGUAGES.ROMANIAN)).toBe('o sută unu milioane două sute treizeci de mii patru sute șaizeci și cinci');
  });

  test('should return "o mie virgulă douăzeci și cinci" for 1000.25', () => {
    expect(numberToWords('1000.25', LANGUAGES.ROMANIAN)).toBe('o mie virgulă douăzeci și cinci');
  });

  test('should return "un miliard" for 1000000000', () => {
    expect(numberToWords('1000000000', LANGUAGES.ROMANIAN)).toBe('un miliard');
  });

  test('should return "nouă sute nouăzeci și nouă de miliarde nouă sute nouăzeci și nouă de milioane nouă sute nouăzeci și nouă de mii nouă sute nouăzeci și nouă" for 999999999999', () => {
    expect(numberToWords('999999999999', LANGUAGES.ROMANIAN)).toBe('nouă sute nouăzeci și nouă de miliarde nouă sute nouăzeci și nouă de milioane nouă sute nouăzeci și nouă de mii nouă sute nouăzeci și nouă');
  });

  test('should return "douăzeci și două de mii" for 22000', () => {
    expect(numberToWords('22000', LANGUAGES.ROMANIAN)).toBe('douăzeci și două de mii');
  });

  test('should return "nouăsprezece virgulă douăzeci și cinci" for 19.25', () => {
    expect(numberToWords('19.25', LANGUAGES.ROMANIAN)).toBe('nouăsprezece virgulă douăzeci și cinci');
  });

  test('should return "o sută nouăzeci și nouă virgulă douăzeci și cinci" for 199.25', () => {
    expect(numberToWords('199.25', LANGUAGES.ROMANIAN)).toBe('o sută nouăzeci și nouă virgulă douăzeci și cinci');
  });

  test('should return "nouă sute nouăzeci și nouă de miliarde nouă sute nouăzeci și nouă de milioane nouă sute nouăzeci și nouă de mii nouă sute nouăzeci și nouă virgulă douăzeci și cinci" for 999999999999.25', () => {
    expect(numberToWords('999999999999.25', LANGUAGES.ROMANIAN)).toBe('nouă sute nouăzeci și nouă de miliarde nouă sute nouăzeci și nouă de milioane nouă sute nouăzeci și nouă de mii nouă sute nouăzeci și nouă virgulă douăzeci și cinci');
  });

  test('should return "nouă sute nouăzeci și nouă de miliarde nouă sute nouăzeci și nouă de milioane nouă sute nouăzeci și nouă de mii nouă sute nouăzeci și nouă virgulă douăzeci și cinci" for 999999999999.25', () => {
    expect(numberToWords('999999999999.25', LANGUAGES.ROMANIAN)).toBe('nouă sute nouăzeci și nouă de miliarde nouă sute nouăzeci și nouă de milioane nouă sute nouăzeci și nouă de mii nouă sute nouăzeci și nouă virgulă douăzeci și cinci');
  });

  test('should return "o sută unu milioane două sute treizeci de mii patru sute șaizeci și cinci virgulă treizeci" for 101230465.30', () => {
    expect(numberToWords('101230465.30', LANGUAGES.ROMANIAN)).toBe('o sută unu milioane două sute treizeci de mii patru sute șaizeci și cinci virgulă treizeci');
  });

  test('should return "nouă sute nouăzeci și nouă de miliarde nouă sute nouăzeci și nouă de milioane nouă sute nouăzeci și nouă de mii nouă sute nouăzeci și nouă virgulă nouăzeci și nouă" for 999999999999.99', () => {
    expect(numberToWords('999999999999.99', LANGUAGES.ROMANIAN)).toBe('nouă sute nouăzeci și nouă de miliarde nouă sute nouăzeci și nouă de milioane nouă sute nouăzeci și nouă de mii nouă sute nouăzeci și nouă virgulă nouăzeci și nouă');
  });

  test('should return "o sută nouăzeci și nouă virgulă cinci" for 199.5', () => {
    expect(numberToWords('199.5', LANGUAGES.ROMANIAN)).toBe('o sută nouăzeci și nouă virgulă cinci');
  });

  test('should return "one hundred ninety-nine point five" for 199.5', () => {
    expect(numberToWords('199.5', LANGUAGES.ENGLISH)).toBe('one hundred ninety-nine point five');
  });

  test('should return "o sută nouăzeci și nouă virgulă zero cinci" for 199.05', () => {
    expect(numberToWords('199.05', LANGUAGES.ROMANIAN)).toBe('o sută nouăzeci și nouă virgulă zero cinci');
  });

  test('should return "o sută virgulă zero unu" for 100.01', () => {
    expect(numberToWords('100.01', LANGUAGES.ROMANIAN)).toBe('o sută virgulă zero unu');
  });

  test('should return "zece mii virgulă nouăzeci și nouă" for 10000.99', () => {
    expect(numberToWords('10000.99', LANGUAGES.ROMANIAN)).toBe('zece mii virgulă nouăzeci și nouă');
  });

  test('should return "o sută virgulă nouăzeci și cinci" for 100.95', () => {
    expect(numberToWords('100.95', LANGUAGES.ROMANIAN)).toBe('o sută virgulă nouăzeci și cinci');
  });

  test('should return "o mie virgulă douăzeci și cinci" for 1000.25', () => {
    expect(numberToWords('1000.25', LANGUAGES.ROMANIAN)).toBe('o mie virgulă douăzeci și cinci');
  });

  test('should return "un miliard" for 1000000000', () => {
    expect(numberToWords('1000000000', LANGUAGES.ROMANIAN)).toBe('un miliard');
  });

  test('should return "o sută douăzeci și trei mii patru sute cincizeci și șase virgulă șaptezeci și opt" for 123456.78', () => {
    expect(numberToWords('123456.78', LANGUAGES.ROMANIAN)).toBe('o sută douăzeci și trei de mii patru sute cincizeci și șase virgulă șaptezeci și opt');
  });

  test('should return "zero virgulă zero unu" for 0.01', () => {
    expect(numberToWords('0.01', LANGUAGES.ROMANIAN)).toBe('zero virgulă zero unu');
  });
});

describe('numberToWords - English', () => {
  test('should return "one" for 1', () => {
    expect(numberToWords('1', LANGUAGES.ENGLISH)).toBe('one');
  });

  test('should return "nineteen" for 19', () => {
    expect(numberToWords('19', LANGUAGES.ENGLISH)).toBe('nineteen');
  });

  test('should return "twenty-one" for 21', () => {
    expect(numberToWords('21', LANGUAGES.ENGLISH)).toBe('twenty-one');
  });

  test('should return "one hundred" for 100', () => {
    expect(numberToWords('100', LANGUAGES.ENGLISH)).toBe('one hundred');
  });

  test('should return "one hundred twenty-five" for 125', () => {
    expect(numberToWords('125', LANGUAGES.ENGLISH)).toBe('one hundred twenty-five');
  });

  test('should return "one thousand" for 1000', () => {
    expect(numberToWords('1000', LANGUAGES.ENGLISH)).toBe('one thousand');
  });

  test('should return "one thousand one" for 1001', () => {
    expect(numberToWords('1001', LANGUAGES.ENGLISH)).toBe('one thousand one');
  });

  test('should handle decimal points', () => {
    expect(numberToWords('1000.25', LANGUAGES.ENGLISH)).toBe('one thousand point two five');
  });
});
