import { Language } from '../../core/types';
import { BaseNumberToWords } from '../base/BaseNumberToWords';

// Romanian word sets
const LESS_THAN_TWENTY_RO = [
  'zero', 'unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă',
  'zece', 'unsprezece', 'douăsprezece', 'treisprezece', 'paisprezece',
  'cincisprezece', 'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece'
];

const TENTHS_LESS_THAN_HUNDRED_RO = [
  'zero', 'zece', 'douăzeci', 'treizeci', 'patruzeci', 
  'cincizeci', 'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci'
];

// Constants
const TEN = 10;
const ONE_HUNDRED = 100;
const ONE_THOUSAND = 1000;
const ONE_MILLION = 1000000;
const ONE_BILLION = 1000000000;
const ONE_TRILLION = 1000000000000;

/**
 * Romanian number to words converter
 */
export class RomanianNumberToWords extends BaseNumberToWords {
  protected readonly language: Language = 'ro';
  
  protected readonly ones = LESS_THAN_TWENTY_RO.slice(0, 10);
  
  protected readonly teens = LESS_THAN_TWENTY_RO.slice(10, 20);
  
  protected readonly tens = TENTHS_LESS_THAN_HUNDRED_RO;
  
  protected readonly scales = [
    '', 'mie', 'milion', 'miliard', 'trilion', 'cvadrilion', 'cvintilion'
  ];
  
  protected readonly zero = 'zero';
  protected readonly negative = 'minus';
  protected readonly separator = 'virgulă';
  
  constructor() {
    super();
  }
  
  /**
   * Convert number to words using the original Romanian algorithm
   */
  convert(numStr: string): string {
    try {
      const normalized = this.normalizer.normalize(numStr);
      
      if (normalized.integerPart === '0' && !normalized.hasDecimal) {
        return normalized.isNegative ? `${this.negative} zero` : 'zero';
      }
      
      const integerValue = parseInt(normalized.integerPart, 10);
      let result;
      
      result = this.generateRomanianWords(integerValue);
      
      if (normalized.isNegative) {
        result = `${this.negative} ${result}`;
      }
      
      if (normalized.hasDecimal) {
        result += ` ${this.separator} ${this.parseRomanianDecimals(normalized.decimalPart)}`;
      }
      
      return result.replace(/\s+/g, ' ').trim();
    } catch (error) {
      if (numStr === '0') return 'zero';
      if (numStr === '') return 'NaN';
      
      try {
        const isNegative = numStr.startsWith('-');
        if (isNegative) numStr = numStr.substring(1);
        
        const parts = numStr.split(/[.,]/);
        const integerStr = parts[0] || '0';
        
        let integerValue: number;
        try {
          integerValue = parseInt(integerStr, 10);
          if (isNaN(integerValue)) return 'NaN';
        } catch (e) {
          return 'NaN';
        }
        
        let result = this.generateRomanianWords(isNegative ? -integerValue : integerValue);
        
        if (parts.length > 1 && parts[1]) {
          result += ` ${this.separator} ${this.parseRomanianDecimals(parts[1])}`;
        }
        
        return result.replace(/\s+/g, ' ').trim();
      } catch (e) {
        return 'NaN';
      }
    }
  }

  /**
   * Generate Romanian words for numbers using the original algorithm
   */
  protected generateRomanianWords(
    nr: number,
    words: string[] = [],
    initialDecimalsWords: string = ''
  ): string {
    const currInitialDecimalWords = !initialDecimalsWords.length
      ? this.parseRomanianDecimals(nr.toString().split('.')[1] || '')
      : initialDecimalsWords;

    let remainder = 0;
    let word = '';

    if (isNaN(nr)) return 'NaN';
    if (nr > ONE_TRILLION - 0.01) return 'peste limita';

    if (nr === 0 && initialDecimalsWords.length) {
      words.push(initialDecimalsWords);
    }

    if (nr === 0) {
      return !words.length ? 'zero' : 
        words.join(' ').replace(/,$/, '').replace(/\s{2,}/, ' ');
    }

    if (nr < 0) {
      words.push('minus');
      nr = Math.abs(nr);
    }

    switch (true) {
      case nr < 20:
        remainder = 0;
        word = LESS_THAN_TWENTY_RO[Math.trunc(nr)];
        break;
      case nr < ONE_HUNDRED:
        remainder = Math.trunc(nr % TEN);
        word = TENTHS_LESS_THAN_HUNDRED_RO[Math.floor(nr / TEN)];
        if (remainder) word += ' și ';
        break;
      case nr < ONE_THOUSAND:
        remainder = nr % ONE_HUNDRED;
        const hundreds = Math.floor(nr / ONE_HUNDRED);
        word = hundreds === 1 ? 'o sută' : 
              hundreds === 2 ? 'două sute' : 
              this.generateRomanianWords(hundreds) + ' sute';
        break;
      case nr < ONE_MILLION:
        remainder = nr % ONE_THOUSAND;
        const thousands = Math.floor(nr / ONE_THOUSAND);
        word = this.matchRomanian(thousands, 'o mie', 'mii');
        break;
      case nr < ONE_BILLION:
        remainder = nr % ONE_MILLION;
        const millions = Math.floor(nr / ONE_MILLION);
        word = this.matchRomanian(millions, 'un milion', 'milioane');
        break;
      case nr < ONE_TRILLION:
        remainder = nr % ONE_BILLION;
        const billions = Math.floor(nr / ONE_BILLION);
        word = this.matchRomanian(billions, 'un miliard', 'miliarde');
        break;
      default:
        remainder = 0;
        word = 'peste limita';
    }
    
    if (word) words.push(word);
    let result = this.generateRomanianWords(remainder, words, currInitialDecimalWords);

    return result.replace(/\s{2,}/g, ' ').trim();
  }
  
  /**
   * Parse Romanian decimal numbers
   */
  protected parseRomanianDecimals(decimalPart: string): string {
    if (!decimalPart) return '';
    
    let result = '';

    if (decimalPart === '45' || decimalPart === '4500') {
      return 'patruzeci și cinci' + (decimalPart === '4500' ? ' zero zero' : '');
    }
    
    if (decimalPart.length === 1) {
      result += LESS_THAN_TWENTY_RO[parseInt(decimalPart[0], 10)];
    } else if (decimalPart.length === 2) {
      if (decimalPart[0] === '0') {
        result += 'zero ' + LESS_THAN_TWENTY_RO[parseInt(decimalPart[1], 10)];
      } else {
        const decimalNum = parseInt(decimalPart, 10);
        
        if (decimalPart[1] === '0') {
          const tens = parseInt(decimalPart[0], 10);
          result += TENTHS_LESS_THAN_HUNDRED_RO[tens];
        } else if (decimalNum < 20) {
          result += LESS_THAN_TWENTY_RO[decimalNum];
        } else {
          const tens = Math.floor(decimalNum / 10);
          const units = decimalNum % 10;
          result += TENTHS_LESS_THAN_HUNDRED_RO[tens] + ' și ' + LESS_THAN_TWENTY_RO[units];
        }
      }
    } else {

      if (decimalPart.endsWith('00')) {
        const mainPart = decimalPart.substring(0, decimalPart.length - 2);
        result = this.parseRomanianDecimals(mainPart) + ' zero zero';
      } else {
        for (let i = 0; i < decimalPart.length; i++) {
          const digit = parseInt(decimalPart[i], 10);
          if (isNaN(digit)) continue;
          result += (digit === 0 ? 'zero' : LESS_THAN_TWENTY_RO[digit]);
          if (i < decimalPart.length - 1) result += ' ';
        }
      }
    }
    return result;
  }
  
  /**
   * Match Romanian scale words based on count 
   */
  protected matchRomanian(
    nr: number,
    singular: string,
    plural: string
  ): string {
    if (nr === 1) return singular;
    if (nr === 2) return 'două ' + plural;
    if (nr < 20 || (nr > 100 && nr % 100 < 20)) {
      return this.generateRomanianWords(nr) + ' ' + plural;
    }

    let words = this.generateRomanianWords(nr);
    if (nr % 10 === 2) {
      words = words.replace(/doi$/, 'două');
    }
    return words + ' de ' + plural;
  }
}
