import { NumberToWordsFactory } from './NumberToWordsFactory';
import type { Language, INumberToWords } from './core/types';

export type { Language, INumberToWords };

export const LANGUAGES = {
  ENGLISH: 'en' as const,
  ROMANIAN: 'ro' as const,
  SPANISH: 'es' as const,
} as const;

function numberToWords(numStr: string, language: Language = 'en'): string {
  const converter = NumberToWordsFactory.createConverter(language);
  return converter.convert(numStr);
}

export { numberToWords };
export { NumberToWordsFactory };
