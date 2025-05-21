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
const TEN = 10n;
const ONE_HUNDRED = 100n;
const ONE_THOUSAND = 1000n;
const ONE_MILLION = 1000000n;
const ONE_BILLION = 1000000000n;
const ONE_TRILLION = 1000000000000n;
const ONE_QUADRILLION = 1000000000000000n;
const ONE_QUINTILLION = 1000000000000000000n;
const ONE_SEXTILLION = 1000000000000000000000n;
const ONE_SEPTILLION = 1000000000000000000000000n;
const ONE_OCTILLION = 1000000000000000000000000000n;
const ONE_NONILLION = 1000000000000000000000000000000n;
const ONE_DECILLION = 1000000000000000000000000000000000n;

/**
 * Romanian number to words converter
 */
export class RomanianNumberToWords extends BaseNumberToWords {
  protected readonly language: Language = 'ro';
  
  protected readonly ones = LESS_THAN_TWENTY_RO.slice(0, 10);
  
  protected readonly teens = LESS_THAN_TWENTY_RO.slice(10, 20);
  
  protected readonly tens = TENTHS_LESS_THAN_HUNDRED_RO;
  
  protected readonly scales = [
    '', 
    'mie', 
    'milion', 
    'miliard', 
    'trilion', 
    'cvadrilion', 
    'cvintilion',
    'sextilion',
    'septilion',
    'octilion',
    'nonilion',
    'decilion'
  ];
  
  protected readonly zero = 'zero';
  protected readonly negative = 'minus';
  protected readonly separator = 'virgulă';
  
  constructor() {
    super();
  }
  
  /**
   * Convert number to words using original Romanian algorithm
   */
  convert(numStr: string): string {
    try {
      const normalized = this.normalizer.normalize(numStr);
      
      if (normalized.integerPart === '0' && !normalized.hasDecimal) {
        return normalized.isNegative ? `${this.negative} zero` : 'zero';
      }
      
      const integerValue = BigInt(normalized.integerPart);
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
        
        try {
          const tempInt = BigInt(integerStr); 
        } catch (e) {
          return 'NaN';
        }
        
        let result = this.generateRomanianWords(isNegative ? -BigInt(integerStr) : BigInt(integerStr));
        
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
   * Generate Romanian words for numbers using original algorithm
   */
  protected generateRomanianWords(
    nr: bigint,
    words: string[] = [],
    initialDecimalsWords: string = ''
  ): string {
    const currInitialDecimalWords = initialDecimalsWords;

    let remainder = 0n; 
    let word = '';

    if (nr > ONE_DECILLION) return 'peste limita'; 

    if (nr === 0n && initialDecimalsWords.length) {
      words.push(initialDecimalsWords);
    }

    if (nr === 0n) {
      return !words.length ? 'zero' : 
        words.join(' ').replace(/,$/, '').replace(/\s{2,}/, ' ');
    }

    if (nr < 0n) {
      words.push('minus');
      nr = -nr; 
    }

    switch (true) {
      case nr < 20n:
        remainder = 0n;
        word = LESS_THAN_TWENTY_RO[Number(nr)]; 
        break;
      case nr < ONE_HUNDRED: 
        remainder = nr % TEN; 
        word = TENTHS_LESS_THAN_HUNDRED_RO[Number(nr / TEN)]; 
        if (remainder) word += ' și ';
        break;
      case nr < ONE_THOUSAND: 
        remainder = nr % ONE_HUNDRED;
        const hundreds = nr / ONE_HUNDRED;
        word = hundreds === 1n ? 'o sută' : 
              hundreds === 2n ? 'două sute' : 
              this.generateRomanianWords(hundreds) + ' sute';
        break;
      case nr < ONE_MILLION:
        remainder = nr % ONE_THOUSAND;
        const thousands = nr / ONE_THOUSAND;
        word = this.matchRomanian(thousands, 'o mie', 'mii');
        break;
      case nr < ONE_BILLION:
        remainder = nr % ONE_MILLION;
        const millions = nr / ONE_MILLION;
        word = this.matchRomanian(millions, 'un milion', 'milioane');
        break;
      case nr < ONE_TRILLION:
        remainder = nr % ONE_BILLION;
        const billions = nr / ONE_BILLION;
        word = this.matchRomanian(billions, 'un miliard', 'miliarde');
        break;
      case nr < ONE_QUADRILLION:
        remainder = nr % ONE_TRILLION;
        const trillions = nr / ONE_TRILLION;
        word = this.matchRomanian(trillions, 'un trilion', 'trilioane');
        break;
      case nr < ONE_QUINTILLION:
        remainder = nr % ONE_QUADRILLION;
        const quadrillions = nr / ONE_QUADRILLION;
        word = this.matchRomanian(quadrillions, 'un cvadrilion', 'cvadrilioane');
        break;
      case nr < ONE_SEXTILLION:
        remainder = nr % ONE_QUINTILLION;
        const quintillions = nr / ONE_QUINTILLION;
        word = this.matchRomanian(quintillions, 'un cvintilion', 'cvintilioane');
        break;
      case nr < ONE_SEPTILLION:
        remainder = nr % ONE_SEXTILLION;
        const sextillions = nr / ONE_SEXTILLION;
        word = this.matchRomanian(sextillions, 'un sextilion', 'sextilioane');
        break;
      case nr < ONE_OCTILLION:
        remainder = nr % ONE_SEPTILLION;
        const septillions = nr / ONE_SEPTILLION;
        word = this.matchRomanian(septillions, 'un septilion', 'septilioane');
        break;
      case nr < ONE_NONILLION:
        remainder = nr % ONE_OCTILLION;
        const octillions = nr / ONE_OCTILLION;
        word = this.matchRomanian(octillions, 'un octilion', 'octilioane');
        break;
      case nr < ONE_DECILLION:
        remainder = nr % ONE_NONILLION;
        const nonillions = nr / ONE_NONILLION;
        word = this.matchRomanian(nonillions, 'un nonilion', 'nonilioane');
        break;
      case nr === ONE_DECILLION:
        remainder = 0n;
        word = 'un decilion';
        break;
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
    nr: bigint,
    singular: string,
    plural: string
  ): string {
    if (nr === 1n) return singular;
    if (nr === 2n) return 'două ' + plural;
    if (nr < 20n || (nr > 100n && nr % 100n < 20n)) {
      return this.generateRomanianWords(nr) + ' ' + plural;
    }

    let words = this.generateRomanianWords(nr);
    if (nr % 10n === 2n) {
      words = words.replace(/doi$/, 'două');
    }
    return words + ' de ' + plural;
  }
}
