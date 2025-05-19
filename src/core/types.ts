/**
 * Supported languages
 */
export type Language = 'en' | 'ro';

/**
 * Interface for number to words converters
 */
export interface INumberToWords {

  convert(numStr: string): string;
  getLanguage(): Language;
}

/**
 * Configuration for number normalization
 */
export interface NormalizationOptions {
  allowNegative?: boolean;
  maxDecimals?: number;
  allowScientificNotation?: boolean;
}

/**
 * Result of number normalization
 */
export interface NormalizedNumber {
  original: string;
  normalized: string;
  value: number;
  isNegative: boolean;
  integerPart: string;
  decimalPart: string;
  hasDecimal: boolean;
}
