import { BaseNumberToWords } from '../languages/base/BaseNumberToWords';
import { Language } from '../core/types';

class TestNumberToWords extends BaseNumberToWords {
  protected readonly language: Language = 'en';
  
  protected readonly ones = [
    'zero', 'one', 'two', 'three', 'four', 
    'five', 'six', 'seven', 'eight', 'nine'
  ];
  
  protected readonly teens = [
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
    'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
  ];
  
  protected readonly tens = [
    '', '', 'twenty', 'thirty', 'forty',
    'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
  ];
  
  protected readonly scales = [
    '', 'thousand', 'million', 'billion', 'trillion'
  ];
  
  protected readonly zero = 'zero';
  protected readonly negative = 'negative';
  protected readonly separator = 'point';
}

describe('BaseNumberToWords', () => {
  let converter: TestNumberToWords;
  
  beforeEach(() => {
    converter = new TestNumberToWords();
  });
  
  describe('convert', () => {
    it('should handle basic integers', () => {
      expect(converter.convert('0')).toBe('zero');
      expect(converter.convert('1')).toBe('one');
      expect(converter.convert('10')).toBe('ten');
      expect(converter.convert('21')).toBe('twenty-one');
    });
    
    it('should handle negative numbers', () => {
      expect(converter.convert('-5')).toBe('negative five');
      expect(converter.convert('-42')).toBe('negative forty-two');
    });
    
    it('should handle decimal numbers', () => {
      expect(converter.convert('1.5')).toBe('one point five');
      expect(converter.convert('3.14')).toBe('three point one four');
    });
    
    it('should throw error for invalid input', () => {
      expect(() => converter.convert('abc')).toThrow('Failed to convert number');
    });
  });
  
  describe('getLanguage', () => {
    it('should return the correct language', () => {
      expect(converter.getLanguage()).toBe('en');
    });
  });
  
  describe('convertInteger', () => {
    it('should handle zero', () => {
      expect((converter as any).convertInteger('0')).toBe('zero');
    });
    
    it('should handle negative numbers directly (line 60)', () => {
      expect((converter as any).convertInteger('-5')).toBe('negative five');
      expect((converter as any).convertInteger('-42')).toBe('negative forty-two');
    });
    
    it('should handle small numbers', () => {
      expect((converter as any).convertInteger('5')).toBe('five');
      expect((converter as any).convertInteger('42')).toBe('forty-two');
    });
    
    it('should handle hundreds', () => {
      expect((converter as any).convertInteger('100')).toBe('one hundred');
      expect((converter as any).convertInteger('101')).toBe('one hundred one');
      expect((converter as any).convertInteger('999')).toBe('nine hundred ninety-nine');
    });
    
    it('should handle large scales', () => {
      expect((converter as any).convertInteger('1000')).toBe('one thousand');
      expect((converter as any).convertInteger('1000000')).toBe('one million');
      expect((converter as any).convertInteger('1000000000')).toBe('one billion');
    });
    
    it('should handle complex numbers', () => {
      expect((converter as any).convertInteger('1234567')).toBe('one million two hundred thirty-four thousand five hundred sixty-seven');
    });
    
    it('should properly handle remaining values (line 81)', () => {
      expect((converter as any).convertInteger('1001')).toBe('one thousand one');
      expect((converter as any).convertInteger('1000001')).toBe('one million one');
      
      class TestWithEmptyScales extends TestNumberToWords {
        protected readonly scales = [''];
      }
      
      const converterWithEmptyScales = new TestWithEmptyScales();
      expect((converterWithEmptyScales as any).convertInteger('42')).toBe('forty-two');
    });
  });
  
  describe('convertLessThanThousand', () => {
    it('should handle zero', () => {
      expect((converter as any).convertLessThanThousand(0)).toBe('');
    });
    
    it('should handle single digits', () => {
      expect((converter as any).convertLessThanThousand(5)).toBe('five');
      expect((converter as any).convertLessThanThousand(9)).toBe('nine');
    });
    
    it('should handle teens', () => {
      expect((converter as any).convertLessThanThousand(11)).toBe('eleven');
      expect((converter as any).convertLessThanThousand(19)).toBe('nineteen');
    });
    
    it('should handle tens', () => {
      expect((converter as any).convertLessThanThousand(20)).toBe('twenty');
      expect((converter as any).convertLessThanThousand(50)).toBe('fifty');
    });
    
    it('should handle tens with ones', () => {
      expect((converter as any).convertLessThanThousand(21)).toBe('twenty-one');
      expect((converter as any).convertLessThanThousand(99)).toBe('ninety-nine');
    });
    
    it('should handle hundreds', () => {
      expect((converter as any).convertLessThanThousand(100)).toBe('one hundred');
      expect((converter as any).convertLessThanThousand(500)).toBe('five hundred');
    });
    
    it('should handle hundreds with remaining digits', () => {
      expect((converter as any).convertLessThanThousand(101)).toBe('one hundred one');
      expect((converter as any).convertLessThanThousand(999)).toBe('nine hundred ninety-nine');
    });
  });
  
  describe('convertDecimal', () => {
    it('should handle simple decimals', () => {
      expect((converter as any).convertDecimal('5')).toBe('five');
      expect((converter as any).convertDecimal('123')).toBe('one two three');
    });
    
    it('should handle zeros in decimals', () => {
      expect((converter as any).convertDecimal('0')).toBe('zero');
      expect((converter as any).convertDecimal('101')).toBe('one zero one');
    });
  });
});
