import { INumberToWords, Language } from './core/types';
import { EnglishNumberToWords } from './languages/en/EnglishNumberToWords';
import { RomanianNumberToWords } from './languages/ro/RomanianNumberToWords';
import { SpanishNumberToWords } from './languages/es/SpanishNumberToWords';

type Constructor<T extends INumberToWords> = new () => T;

type LanguageMap = {
  [key in Language]: Constructor<INumberToWords>;
};

/**
 * Factory for creating number to words converters
 */
export class NumberToWordsFactory {
  private static readonly converters: LanguageMap = {
    en: EnglishNumberToWords,
    ro: RomanianNumberToWords,
    es: SpanishNumberToWords,
  };
  
  static createConverter<T extends INumberToWords = INumberToWords>(
    language: Language
  ): T {
    const Converter = this.converters[language];
    
    if (!Converter) {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    return new Converter() as T;
  }

  static getSupportedLanguages(): Language[] {
    return Object.keys(this.converters) as Language[];
  }
  
  static isLanguageSupported(language: string): language is Language {
    return language in this.converters;
  }
}
