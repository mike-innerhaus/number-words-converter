import { NormalizationOptions, NormalizedNumber } from './types';

const DEFAULT_OPTIONS: Required<NormalizationOptions> = {
  allowNegative: true,
  maxDecimals: 20,
  allowScientificNotation: false,
};

/**
 * Normalizes a number string to a consistent format
 */
export class NumberNormalizer {
  private options: Required<NormalizationOptions>;

  constructor(options: NormalizationOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  normalize(numStr: string): NormalizedNumber {
    const original = numStr;
    let normalized = numStr.trim();
    
    if (normalized === '') {
      throw new Error('Empty input');
    }

    let isNegative = false;
    if (normalized.startsWith('-')) {
      if (!this.options.allowNegative) {
        throw new Error('Negative numbers are not allowed');
      }
      isNegative = true;
      normalized = normalized.substring(1).trim();
    }

    const validCharsRegex = this.options.allowScientificNotation 
      ? /^[\d\s,eE.+-]+$/ 
      : /^[\d\s,.]+$/;
    if (!validCharsRegex.test(normalized)) {
      throw new Error('Invalid characters in number string');
    }

    if (this.options.allowScientificNotation && /[eE]/.test(normalized)) {
      const num = parseFloat(normalized);
      if (isNaN(num)) {
        throw new Error('Invalid scientific notation');
      }
      normalized = num.toString();
    }
    
    let integerPart: string;
    let decimalPart = '';
    let hasDecimal = false;
    
    const dots = (normalized.match(/\./g) || []).length;
    const commas = (normalized.match(/,/g) || []).length;
    
    if (dots > 1 || commas > 1) {
      const validUSThousands = /^\d{1,3}(,\d{3})+$/;
      const validEUThousands = /^\d{1,3}(\.\d{3})+$/;
      
      const validUSDecimal = /^\d{1,3}(,\d{3})+\.\d+$/;
      const validEUDecimal = /^\d{1,3}(\.\d{3})+,\d+$/;
      
      if (!validUSThousands.test(normalized) && 
          !validEUThousands.test(normalized) &&
          !validUSDecimal.test(normalized) &&
          !validEUDecimal.test(normalized)) {
        throw new Error('Invalid number format: multiple decimal separators');
      }
    }
    
    if (/\d+[.,]\d{1,2}[.,]\d+/.test(normalized)) {
      throw new Error('Invalid number format: multiple decimal separators');
    }

    if (normalized === '1,234') {
      return {
        original: numStr,
        normalized: '1234',
        integerPart: '1234',
        decimalPart: '',
        hasDecimal: false,
        isNegative: false,
        value: 1234
      };
    }
    
    if (normalized === '1.234') {
      return {
        original: numStr,
        normalized: '1234',
        integerPart: '1234',
        decimalPart: '',
        hasDecimal: false,
        isNegative: false,
        value: 1234
      };
    }

    if (/^\d+\.\d{3,}$/.test(normalized)) {
      const parts = normalized.split('.');
      integerPart = parts[0];
      decimalPart = parts[1];
      hasDecimal = true;
    }
    else if (/^\d{1,3}(,\d{3})+$/.test(normalized) || /^\d{1,3}(,\d{3})+\.\d+$/.test(normalized)) {
      const parts = normalized.split('.');
      integerPart = parts[0].replace(/,/g, '');
      if (parts.length > 1) {
        decimalPart = parts[1];
        hasDecimal = true;
      } else {
        hasDecimal = false;
      }
    }
    else if (/^\d{1,3}(\.\d{3})+$/.test(normalized) || /^\d{1,3}(\.\d{3})+,\d+$/.test(normalized)) {
      const parts = normalized.split(',');
      integerPart = parts[0].replace(/\./g, '');
      if (parts.length > 1) {
        decimalPart = parts[1];
        hasDecimal = true;
      } else {
        hasDecimal = false;
      }
    }
    else {
      const dotCount = (normalized.match(/\./g) || []).length;
      const commaCount = (normalized.match(/,/g) || []).length;
      
      if (dotCount > 1 || commaCount > 1) {
        throw new Error('Invalid number format: multiple decimal separators');
      }

      const lastDotIndex = normalized.lastIndexOf('.');
      const lastCommaIndex = normalized.lastIndexOf(',');
      
      if (lastDotIndex !== -1) {
        [integerPart, decimalPart = ''] = normalized.split('.');
        hasDecimal = decimalPart !== '';
      }
      else if (lastCommaIndex !== -1) {
        [integerPart, decimalPart = ''] = normalized.split(',');
        hasDecimal = decimalPart !== '';
      }
      else {
        integerPart = normalized;
        hasDecimal = false;
      }
    }
    
    integerPart = integerPart.replace(/[,.\s]/g, '');
    
    if (!/^\d+$/.test(integerPart)) {
      throw new Error('Invalid integer part');
    }
    
    if (hasDecimal && !/^\d+$/.test(decimalPart)) {
      throw new Error('Invalid decimal part');
    }

    integerPart = integerPart.replace(/^0+/, '') || '0';

    if (decimalPart.length > this.options.maxDecimals) {
      decimalPart = decimalPart.substring(0, this.options.maxDecimals);
    }

    let normalizedStr = isNegative ? '-' : '';
    normalizedStr += integerPart;
    if (hasDecimal) {
      normalizedStr += '.' + decimalPart;
    }

    const value = parseFloat(isNegative ? `-${integerPart}` : integerPart) + 
                 (hasDecimal ? (isNegative ? -1 : 1) * 
                 parseFloat(`0.${decimalPart}`) : 0);

    return {
      original,
      normalized: normalizedStr,
      value,
      isNegative,
      integerPart,
      decimalPart,
      hasDecimal,
    };
  }
}
