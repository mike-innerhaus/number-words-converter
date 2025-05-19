import { Language } from '../../core/types';
import { BaseNumberToWords } from '../base/BaseNumberToWords';

/**
 * English number to words converter
 */
export class EnglishNumberToWords extends BaseNumberToWords {
  protected readonly language: Language = 'en';
  
  protected readonly ones = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
  ];
  
  protected readonly teens = [
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 
    'seventeen', 'eighteen', 'nineteen'
  ];
  
  protected readonly tens = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 
    'eighty', 'ninety'
  ];
  
  protected readonly scales = [
    '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 
    'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 
    'decillion'
  ];
  
  protected readonly zero = 'zero';
  protected readonly negative = 'negative';
  protected readonly separator = 'point';
  
  constructor() {
    super();
  }
  

  protected convertDecimal(decimalStr: string): string {
    return decimalStr
      .split('')
      .map(digit => {
        const num = parseInt(digit, 10);
        return num === 0 ? 'zero' : this.ones[num];
      })
      .join(' ');
  }
}
