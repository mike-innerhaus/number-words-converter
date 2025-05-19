import { INumberToWords, Language, NormalizedNumber } from '../../core/types';
import { NumberNormalizer } from '../../core/numberNormalizer';

/**
 * Base class for number to words converters
 */
export abstract class BaseNumberToWords implements INumberToWords {
  protected readonly normalizer: NumberNormalizer;
  protected abstract readonly language: Language;
  
  protected abstract readonly ones: string[];
  protected abstract readonly teens: string[];
  protected abstract readonly tens: string[];
  protected abstract readonly scales: string[];
  
  protected abstract readonly zero: string;
  protected abstract readonly negative: string;
  protected abstract readonly separator: string;
  
  constructor() {
    this.normalizer = new NumberNormalizer({
      allowNegative: true,
      maxDecimals: 20,
    });
  }

  convert(numStr: string): string {
    try {
      const normalized = this.normalizer.normalize(numStr);
      let result = this.convertInteger(normalized.integerPart);
      
      if (normalized.isNegative) {
        result = `${this.negative} ${result}`;
      }
      
      if (normalized.hasDecimal) {
        result += ` ${this.separator} ${this.convertDecimal(normalized.decimalPart)}`;
      }
      
      return result.replace(/\s+/g, ' ').trim();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to convert number: ${errorMessage}`);
    }
  }
  

  getLanguage(): Language {
    return this.language;
  }
  
  protected convertInteger(integerStr: string): string {
    const num = BigInt(integerStr);
    
    if (num === 0n) {
      return this.zero;
    }
    
    if (num < 0n) {
      return `${this.negative} ${this.convertInteger(integerStr.substring(1))}`;
    }
    
    let result = '';
    let remaining = num;
    
    for (let i = this.scales.length - 1; i >= 0; i--) {
      const scaleValue = BigInt(10) ** BigInt(3 * i);
      if (remaining >= scaleValue) {
        const scaleCount = remaining / scaleValue;
        remaining = remaining % scaleValue;
        
        if (scaleCount > 0n) {
          const scaleName = this.scales[i];
          const scaleStr = this.convertLessThanThousand(Number(scaleCount));
          result += `${scaleStr} ${scaleName} `;
        }
      }
    }
    
    if (remaining > 0n) {
      result += this.convertLessThanThousand(Number(remaining));
    }
    
    return result.trim();
  }
  
  protected convertLessThanThousand(num: number): string {
    if (num === 0) {
      return '';
    }
    
    let result = '';
    
    if (num >= 100) {
      const hundreds = Math.floor(num / 100);
      result += `${this.ones[hundreds]} hundred `;
      num %= 100;
    }
    
    if (num > 0) {
      if (num < 10) {
        result += this.ones[num];
      } else if (num < 20) {
        result += this.teens[num - 10];
      } else {
        const tens = Math.floor(num / 10);
        const ones = num % 10;
        result += this.tens[tens];
        if (ones > 0) {
          result += `-${this.ones[ones]}`;
        }
      }
    }
    
    return result.trim();
  }
  
  protected convertDecimal(decimalStr: string): string {
    return decimalStr
      .split('')
      .map(digit => this.ones[parseInt(digit, 10)] || this.zero)
      .join(' ');
  }
}
